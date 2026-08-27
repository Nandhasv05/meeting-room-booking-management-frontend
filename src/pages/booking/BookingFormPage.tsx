import { useCallback, useEffect } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  Building2,
  CalendarRange,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  MapPin,
  Tag,
  Users,
} from 'lucide-react';
import type { Hall } from '../../types/api';
import { EVENT_TYPES } from '../../types/api';
import { Spinner } from '../../components/ui/Feedback';
import { celebrate } from '../../components/ui/SuccessFx';
import { GhostButton, PrimaryButton } from '../../components/ui/Form';
import { EmployeePicker, type PickedEmployee } from '../../components/booking/EmployeePicker';;
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchHallsStart } from '../../redux/halls/halls.action';
import { selectHalls, selectHallsLoading } from '../../redux/halls/halls.selector';
import { fetchDepartmentsStart } from '../../redux/departments/departments.action';
import { selectDepartments } from '../../redux/departments/departments.selector';
import { createBookingResponseResetStart, createBookingStart } from '../../redux/bookings/bookings.action';
import { selectCreateBookingLoading, selectCreateBookingResponse } from '../../redux/bookings/bookings.selector';
import { selectCurrentUser } from '../../redux/login/login.selector';
import { useReduxResponse } from '../../redux/_common/useReduxResponse';

export function BookingFormPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const signedIn = useAppSelector(selectCurrentUser);
  const halls = useAppSelector(selectHalls) as Hall[] | undefined;
  const isLoading = useAppSelector(selectHallsLoading);
  const departments = useAppSelector(selectDepartments) as { Id: string; Name: string }[] | undefined;
  const pending = useAppSelector(selectCreateBookingLoading);
  const createResponse = useAppSelector(selectCreateBookingResponse);

  useEffect(() => {
    dispatch(fetchHallsStart({ active: 'true' }));
    dispatch(fetchDepartmentsStart());
  }, [dispatch]);

  const methods = useForm<Values>({
    resolver: zodResolver(schema as never) as never,
    defaultValues: {
      name: '',
      eventType: 'MEETING',
      departmentId: signedIn?.departmentId ?? '',
      mailId: signedIn?.email ?? '',
      hallId: params.get('hallId') ?? '',
      hallAttendance: 8,
      employees: [],
      extraEmails: '',
      date: params.get('date') ?? defaults.date,
      startTime: params.get('start') ?? defaults.startTime,
      endTime: params.get('end') ?? defaults.endTime,
      purpose: '',
    },
  });

  const resetCreate = useCallback(() => dispatch(createBookingResponseResetStart()), [dispatch]);
  useReduxResponse(createResponse, resetCreate, (response) => {
    const booking = response as { data?: { Id: string; inviteMail?: { configured: boolean; sent: number; failed: number; error?: string } } };
    const mail = booking.data?.inviteMail;
    const id = booking.data?.Id;
    if (mail?.sent) {
      celebrate(
        'Booking confirmed',
        `Invitations were emailed to ${mail.sent} guest${mail.sent === 1 ? '' : 's'}. Replies go to your mail ID.`,
      );
    } else if (mail && !mail.configured) {
      celebrate('Booking confirmed', 'Hall is booked. Invitations were not emailed yet.');
      toast.error(mail.error || 'Save the sending mailbox app password in Settings, then book again.');
    } else if (id) {
      celebrate('Booking confirmed', 'Hall is booked, but some invitation emails failed.');
      toast.error(mail?.error || 'Meeting invitations could not be emailed. Check SMTP settings.');
    }
    if (id) navigate(`/bookings/${id}`);
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="animate-rise">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((v: Values) => {
            const fromPeople = v.employees
              .map((e: PickedEmployee) => cleanMailText(e.email).toLowerCase())
              .filter(Boolean);
            const invites = [...new Set([...fromPeople, ...parseEmails(v.extraEmails ?? '')])];
            if (invites.length === 0) {
              toast.error('Add at least one employee or invitation mail ID.');
              return;
            }
            const bad = invites.find((email) => !isMailId(email));
            if (bad) {
              toast.error(`Invalid invitation mail ID: ${bad}`);
              return;
            }
            const startAt = new Date(`${v.date}T${v.startTime}:00`);
            const endAt = new Date(`${v.date}T${v.endTime}:00`);
            if (startAt.getTime() < Date.now() - 60_000) {
              toast.error('Cannot book a time in the past. Choose a later start time or tomorrow.');
              return;
            }
            if (endAt <= startAt) {
              toast.error('End time must be after start time.');
              return;
            }
            const named = new Map(v.employees.map((emp: PickedEmployee) => [emp.email.toLowerCase(), emp.name]));
            dispatch(
              createBookingStart({
                eventName: v.name,
                eventType: v.eventType,
                departmentId: v.departmentId,
                mailId: v.mailId.trim(),
                invitationEmails: invites,
                hallId: v.hallId,
                startAt: startAt.toISOString(),
                endAt: endAt.toISOString(),
                attendeeCount: Number(v.hallAttendance),
                purpose: v.purpose,
                attendees: invites.map((email) => ({
                  name: named.get(email) ?? email.split('@')[0] ?? email,
                  email,
                })),
              }),
            );
          })}
        >
          <Composer halls={halls ?? []} departments={departments ?? []} pending={pending} />
        </form>
      </FormProvider>
    </div>
  );
}


