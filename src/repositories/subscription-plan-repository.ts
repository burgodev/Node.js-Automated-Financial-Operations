import { PrismaClient } from "@prisma/client";
import { ISubscriptionPlanCreateRepository } from "../types/subscription-plan";

class SubscriptionPlanRepository {
    private prisma;
    private client;

    private select_arguments = {
        id: true,
        name: true,
        type: true,
        active: true,
        validity_start: true,
        validity_end: true,
        price: true,
    };

    constructor(prisma: PrismaClient) {
        // super();
        // this.setClient(this.prisma.subscriptionPlan);
        this.prisma = prisma;
        this.client = prisma.subscriptionPlan;
    }

    public async create(subscription_plan: ISubscriptionPlanCreateRepository) {
        const result = await this.client.create({
            data: subscription_plan,
            select: this.select_arguments,
        });

        return result;
    }

    public async list() {
        const result = await this.client.findMany({
            select: this.select_arguments,
            where: {
                active: true,
            },
        });

        return result;
    }

    public async findById(subscription_plan_id: string) {
        const result = await this.client.findFirst({
            where: {
                id: subscription_plan_id,
            },
        });

        return result;
    }
}

export default SubscriptionPlanRepository;
