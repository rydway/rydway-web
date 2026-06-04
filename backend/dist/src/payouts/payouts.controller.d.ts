import { PayoutsService } from './payouts.service';
export declare class PayoutsController {
    private readonly payoutsService;
    constructor(payoutsService: PayoutsService);
    handleWebhook(req: any, payload: any): Promise<{
        success: boolean;
    }>;
}
