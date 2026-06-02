export declare class SearchVehiclesDto {
    location?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    startDate?: string;
    endDate?: string;
    category?: string;
    priceMin?: number;
    priceMax?: number;
    seats?: number;
    transmission?: string;
    fuelType?: string;
    verifiedOnly?: boolean;
    featuredOnly?: boolean;
    page?: number;
    limit?: number;
}
