import { z } from "zod";

/******* TYPE *******/
export type EventDetail = {
    Id: string;
    BookingId: string;
    EventName: string;
    EventType: string;
    Description: string | null;
    ExpectedAttendees: number;
    ActualAttendees: number | null;
    Requirements: string | null;
    HallName: string;
    OrganizerName: string;
    Contact: string | null;
    StartAt: string;
    EndAt: string;
    Purpose: string | null;
  };
  
  /******* SCHEMA *******/
  export const schema = z.object({
    description: z.string().optional(),
    expectedAttendees: z.coerce.number(),
    actualAttendees: z.coerce.number(),
    requirements: z.string().optional(),
  });
  
  /******* FORM DATA *******/
  export type FormInput = z.input<typeof schema>;
  export type FormData = z.output<typeof schema>;
  
  
export type EventRow = {
    Id: string;
    EventName: string;
    EventType: string;
    HallName: string;
    StartAt: string;
    EndAt: string;
    Status: string;
    OrganizerName: string;
    ExpectedAttendees: number;
  };