
export function hallTone(status: string, occupied: boolean) {
    if (status === 'MAINTENANCE' || status === 'BLOCKED') return 'border-amber-300/50 bg-amber-50';
    if (occupied || status === 'OCCUPIED' || status === 'BOOKED') return 'border-brand-400/30 bg-brand-50';
    return 'border-signal/25 bg-signal/[0.07]';
  }