export type AuthUser = {
  id: string;
  email: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  roleId: string;
  roleCode: string;
  roleName: string;
  departmentId: string | null;
  permissions: string[];
};

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type Paged<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type Hall = {
  Id: string;
  Name: string;
  Code: string;
  Description: string | null;
  Location: string | null;
  Building: string | null;
  Floor: string | null;
  Capacity: number;
  HallType: string;
  Status: string;
  ImageUrl: string | null;
  OpeningTime: string;
  ClosingTime: string;
  ContactPersonId: string | null;
  ContactName: string | null;
  IsActive: boolean;
  facilities?: { Id: string; Code: string; Name: string }[];
  layouts?: { Id: string; Name: string; Capacity: number; IsDefault: boolean }[];
};

export type Booking = {
  Id: string;
  BookingNumber: string;
  EventName: string;
  EventType: string;
  DepartmentId: string;
  DepartmentName: string;
  OrganizerId: string;
  OrganizerName: string;
  ContactNumber: string | null;
  HallId: string;
  HallName: string;
  HallCode: string;
  HallCapacity: number;
  BookingDate: string;
  StartAt: string;
  EndAt: string;
  AttendeeCount: number;
  SeatingLayoutId: string | null;
  Purpose: string | null;
  CateringRequired: boolean;
  SpecialRequirements: string | null;
  Status: string;
  ApprovedByName: string | null;
  ApprovedAt: string | null;
  RejectedByName: string | null;
  RejectedAt: string | null;
  RejectionReason: string | null;
  CancellationReason: string | null;
  EventId: string | null;
  facilities?: { Id: string; Code: string; Name: string }[];
  history?: { Id: string; FromStatus: string | null; ToStatus: string; Comment: string | null; CreatedAt: string; ActorName: string | null }[];
};

export type DisplayPayload = {
  hallName: string;
  hallCode: string;
  state: 'AVAILABLE' | 'UPCOMING' | 'ONGOING' | 'MAINTENANCE';
  subtitle: string;
  headline: string;
  availableFrom: string | null;
  current: Booking | null;
  next: Booking | null;
};

export const EVENT_TYPES = [
  'MEETING',
  'CONFERENCE',
  'SEMINAR',
  'TRAINING',
  'WORKSHOP',
  'PRESENTATION',
  'CLIENT_MEETING',
  'CORPORATE_EVENT',
  'OTHER',
] as const;

export const HALL_TYPES = ['BOARDROOM', 'AUDITORIUM', 'TRAINING', 'MEETING', 'MULTIPURPOSE', 'CONFERENCE'] as const;
