import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getRenterSummary(user: any): Promise<{
        message: string;
        data: any;
    }>;
    getHostSummary(user: any): Promise<{
        message: string;
        data: any;
    }>;
}
