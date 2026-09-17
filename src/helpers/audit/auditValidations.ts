/**
 *  AUTHOR: NANDHAKUMAR S V
 *  DATE : 17/9/2026
 * DESCRIPTION: ADD AUDIT LOG TYPES
**/

// Interface for the audit logs
export type audit_logs_type = {
    Id: string;
    UserName: string | null;
    Action: string;
    Module: string;
    RecordId: string | null;
    IpAddress: string | null;
    CreatedAt: string;
  };
  