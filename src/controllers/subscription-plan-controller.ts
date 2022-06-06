import { Request, Response } from "express";
import ValidationError from "../errors/validation-error";
import { r } from "../helpers/general";
import SubscriptionPlanService from "../services/subscription-plan/subscription-plan.service";

class SubscriptionPlanController {
    private subscriptionPlanService: SubscriptionPlanService;

    constructor(subscriptionPlanService: SubscriptionPlanService) {
        this.subscriptionPlanService = subscriptionPlanService;
    }

    public async list(request: Request, response: Response) {
        const data = await this.subscriptionPlanService.list();

        return r(response, "SUCCESS", data);
    }
}

export default SubscriptionPlanController;
