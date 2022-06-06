import {
    IAsaasCreateCostumerRepository,
    IAsaasCreateSubscriptionRepository,
    IAsaasCreateTicketRepository,
} from "../../types/asaas";
import { asaasApi } from "./gateway-api";

class AsaasService {
    public async createCustomer(customer_info: IAsaasCreateCostumerRepository) {
        try {
            const result = await asaasApi.post("customers", customer_info);
            return result.data;
        } catch (error) {
            return error;
        }
    }

    public async makeSubscription(
        subscription_info: IAsaasCreateSubscriptionRepository
    ) {
        const result = await asaasApi.post("subscriptions", subscription_info);

        return result;
    }

    public async getSubscriptionStatus(subscription_id: string) {
        const result = await asaasApi.get(`subscriptions/${subscription_id}`);

        return result;
    }

    public async getTicket(create_ticket: IAsaasCreateTicketRepository) {
        const result = await asaasApi.post("/payments", create_ticket);

        return result;
    }

    public async cancelSubscription(payment_external_reference: string) {
        const result = await asaasApi.delete(
            `/subscriptions/${payment_external_reference}`
        );

        return result;
    }
}

export default AsaasService;
