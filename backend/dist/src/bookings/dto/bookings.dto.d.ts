export declare class CreateBookingDto {
    vehicleId: string;
    startDate: string;
    endDate: string;
    pickupTime: string;
    dropoffTime: string;
    pickupLocation: string;
    dropoffLocation: string;
    extras?: any;
}
export declare class ExtendBookingDto {
    newEndDate: string;
}
