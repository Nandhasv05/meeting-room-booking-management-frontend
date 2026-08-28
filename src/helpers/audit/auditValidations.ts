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
  