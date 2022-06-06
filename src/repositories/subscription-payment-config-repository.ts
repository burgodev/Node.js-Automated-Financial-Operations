import { PrismaClient } from "@prisma/client";
import { ISubscriptionPaymentConfig } from "../types/subscription-payment-config";

class SubscriptionPaymentConfigRepository {
    private prisma;
    private client;

    protected select_arguments = {
        id: true,
        payment_external_reference: true,
        payment_card_id: true,
        customer_gateway_id: true,
    };

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.client = prisma.subscriptionPaymentConfig;
    }

    public async create(
        subscription_payment_config: ISubscriptionPaymentConfig
    ) {
        const result = await this.client.create({
            data: subscription_payment_config,
        });

        return result;
    }

    public async update(
        id: string,
        subscription_payment_config: ISubscriptionPaymentConfig
    ) {
        const result = await this.client.update({
            where: {
                id: id,
            },
            data: subscription_payment_config,
        });
        return result;
    }
}

export default SubscriptionPaymentConfigRepository;
