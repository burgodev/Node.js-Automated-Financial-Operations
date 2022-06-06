import NotFoundError from "../../errors/not-found-error";
import ValidationError from "../../errors/validation-error";
import SubscriptionPlanRepository from "../../repositories/subscription-plan-repository";

class SubscriptionPlanService {
    private subscriptionPlanRepository: SubscriptionPlanRepository;

    constructor(subscriptionPlanRepository: SubscriptionPlanRepository) {
        this.subscriptionPlanRepository = subscriptionPlanRepository;
    }

    public async list() {
        const subscription_plan = await this.subscriptionPlanRepository.list();

        if (!subscription_plan || subscription_plan.length === 0) {
            throw new ValidationError("SUBSCRIPTION_PLANS.NO_PLANS_AVAILABLE");
        }

        return subscription_plan;
    }
}

export default SubscriptionPlanService;
