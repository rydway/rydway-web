export declare class RaiseDisputeDto {
    bookingId: string;
    reason: string;
}
export declare class ResolveDisputeDto {
    resolution: string;
    outcome: 'RESOLVED' | 'REJECTED';
}
