// AUTHOR : NANDNHAKUMAR SV 
// DATE : 27/08/2026
// DESCRIPTION : Booking form page to create a new booking
import { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Hall } from '../../types/api';
import { Spinner } from '../../components/ui/Feedback';
import { celebrate } from '../../components/ui/SuccessFx';
import type { PickedEmployee } from '../../components/booking/EmployeePicker';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchHallsStart } from '../../redux/halls/halls.action';
import { selectHalls, selectHallsLoading } from '../../redux/halls/halls.selector';
import { fetchDepartmentsStart } from '../../redux/departments/departments.action';
import { selectDepartments } from '../../redux/departments/departments.selector';
import { createBookingResponseResetStart, createBookingStart } from '../../redux/bookings/bookings.action';
import { selectCreateBookingLoading, selectCreateBookingResponse } from '../../redux/bookings/bookings.selector';
import { selectCurrentUser } from '../../redux/login/login.selector';
import { useReduxResponse } from '../../redux/_common/useReduxResponse';
import { Composer } from '../../components/booking/BookingComposer';
import {
  cleanMailText,
  defaults,
  isMailId,
  parseEmails,
  schema,
  slotIso,
  type Values,
} from '../../helpers/booking/bookingFromValidations';

export function BookingFormPage() {
  /******* STATE *******/
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  /******* SELECTORS *******/
  const signedIn = useAppSelector(selectCurrentUser);
  const halls = useAppSelector(selectHalls) as Hall[] | undefined;
  const isLoading = useAppSelector(selectHallsLoading);
  const departments = useAppSelector(selectDepartments) as { Id: string; Name: string; Code?: string }[] | undefined;
  const pending = useAppSelector(selectCreateBookingLoading);
  const createResponse = useAppSelector(selectCreateBookingResponse);

  /******* EFFECTS *******/
  useEffect(() => {
    dispatch(fetchHallsStart({ active: 'true' }));
    dispatch(fetchDepartmentsStart());
  }, [dispatch]);

  /******* FORM *******/
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

  useEffect(() => {
    const list = departments ?? [];
    if (!list.length) return;
    const current = String(methods.getValues('departmentId') ?? '');
    const match = list.find((d) => {
      const id = String(d.Id);
      const code = String(d.Code ?? '').toUpperCase();
      const name = String(d.Name ?? '').toUpperCase();
      const value = current.toUpperCase();
      return id === current || code === value || name === value;
    });
    if (match && String(match.Id) !== current) methods.setValue('departmentId', String(match.Id));
  }, [departments, methods]);

  /******* HANDLERS *******/
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
    } else if (id && (!mail || mail.failed === 0)) {
      celebrate('Booking confirmed', 'Hall is booked.');
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
            const bad = invites.find((email) => !isMailId(email));
            if (bad) {
              toast.error(`Invalid invitation mail ID: ${bad}`);
              return;
            }
            const startIso = slotIso(v.date, v.startTime);
            const endIso = slotIso(v.date, v.endTime);
            if (!startIso || !endIso) {
              toast.error('Choose a valid date and time.');
              return;
            }
            const startAt = new Date(startIso);
            const endAt = new Date(endIso);
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
                startAt: startIso,
                endAt: endIso,
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


