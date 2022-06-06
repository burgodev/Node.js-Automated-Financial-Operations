import { PrismaClient } from "@prisma/client";
import {
    ISimulationCreateRepository,
    ISubscriptionCancelRepository,
    ISubscriptionCreateRepository,
} from "../types/subscription";

class SubscriptionRepository {
    private prisma;
    private client;

    protected select_arguments = {
        id: true,
        is_active: true,
        is_simulation: true,
        created_at: true,
        // paymentConfig: {
        //     select: {
        //         payment_external_reference: true,
        //     },
        // },
        subscriptionPlan: {
            select: {
                price: true,
                traderRobot: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        },
        brokerOperationAccount: {
            select: {
                number: true,
                balance_total: true,
            },
        },
        paymentConfig: {
            select: {
                payment_card_id: true,
            },
        },
    };

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.client = prisma.subscription;
    }

    public async listByUser(user_id: string) {
        const result = await this.client.findMany({
            select: this.select_arguments,
            orderBy: {
                created_at: "desc",
            },
            where: {
                user_id: user_id,
            },
        });

        return result.map((r) => {
            return {
                id: r.id,
                is_active: r.is_active,
                is_simulation: r.is_simulation,
                created_at: r.created_at,
                // payment_external_reference:
                //     r.paymentConfig.payment_external_reference,
                subscription_plan_price: r.subscriptionPlan.price,
                trader_robot_id: r.subscriptionPlan.traderRobot.id,
                trader_robot_name: r.subscriptionPlan.traderRobot.name,
                broker_operation_account_number:
                    r.brokerOperationAccount?.number,
                broker_operation_account_balance:
                    r.brokerOperationAccount?.balance_total,
                payment_card_id: r.paymentConfig?.payment_card_id,
            };
        });
    }

    public async create(subscription: ISubscriptionCreateRepository) {
        const result = await this.client.create({
            data: subscription,
        });
        return result;
    }

    public async createSimulation(simulation: ISimulationCreateRepository) {
        const result = await this.client.create({
            data: simulation,
        });

        return result;
    }

    public async subscriptionById(subscription_id: string) {
        const result = await this.client.findFirst({
            where: {
                id: subscription_id,
            },
            select: {
                id: true,
                subscription_plan_id: true,
                paymentConfig: {
                    select: {
                        payment_external_reference: true,
                    },
                },
                brokerOperationAccount: {
                    select: { number: true }
                }
            },
        });

        return result;
    }

    public async cancelSubscription(
        subscription_id: string,
        is_active: boolean
    ) {
        const result = await this.client.update({
            where: {
                id: subscription_id,
            },
            data: {
                is_active,
            },
        });

        return result;
    }
}

export default SubscriptionRepository;
