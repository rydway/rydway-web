export declare class CreateVehicleReviewDto {
    bookingId: string;
    rating: number;
    body: string;
}
export declare class CreateHostReviewDto {
    bookingId: string;
    hostRating: number;
    hostComment?: string;
}
export declare class CreateRenterReviewDto {
    bookingId: string;
    renterRating: number;
    renterComment?: string;
}
