import ValidationError from "../../errors/validation-error";
import BrokerAccountRepository from "../../repositories/broker-account-repository";
import SubscriptionRepository from "../../repositories/subscription-repository";
import { ILoggedUser } from "../../types/auth";
import {
    ISimulationCreateRepository,
    ISubscriptionCreateRepository,
} from "../../types/subscription";
import AsaasService from "../gateways/asaas.service";
import SelectMarketsService from "../selectmarkets/selectmarkets.service";

class SubscriptionService {
    private subscriptionRepository: SubscriptionRepository;
    private brokerAccountRepository: BrokerAccountRepository;

    constructor(
        subscriptionRepository: SubscriptionRepository,
        brokerAccountRepository: BrokerAccountRepository
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.brokerAccountRepository = brokerAccountRepository;
    }

    public async create(
        user: ILoggedUser,
        payment_config_id: string,
        subscription_plan_id: string
    ) {
        const new_subscription: ISubscriptionCreateRepository = {
            created_at: new Date(),
            user_id: user.user_id,
            payment_config_id,
            subscription_plan_id,
        };
        const subscription = await this.subscriptionRepository.create(
            new_subscription
        );
        if (!subscription) {
            throw new ValidationError(
                "SUBSCRIPTION.ERROR.CANNOT_CREATE_A_NEW_SUBSCRIPTION"
            );
        }
        return subscription;
    }

    public async listByUser(user: string) {
        const subscription = await this.subscriptionRepository.listByUser(user);
        if (!subscription || subscription.length === 0) {
            throw new ValidationError(
                "SUBSCRIPTION.ERROR.NO_SUBSCRIPTION_AVAILABLE_FOR_THIS_USER"
            );
        }

        return subscription;
    }

    public async createSimulation(data: ISimulationCreateRepository) {
        const simulation = await this.subscriptionRepository.createSimulation(
            data
        );

        if (!simulation) {
            throw new ValidationError(
                "SUBSCRIPTION.ERROR.SIMULATION_NOT_CREATED"
            );
        }

        return simulation;
    }

    public async cancelSubscription(
        subscription_id: string,
        is_active: boolean,
        is_simulation: boolean,
        user_id: string
    ) {
        const asaasService = new AsaasService();

        let subscription;
        if (!is_simulation) {
            subscription = await this.subscriptionRepository.subscriptionById(subscription_id);

            if (subscription?.paymentConfig) {
                await asaasService.cancelSubscription(
                    subscription?.paymentConfig.payment_external_reference
                );
            }
        }

        if (!subscription) { throw new ValidationError("subscription.not_found") }

        const cancel_subscription =
            await this.subscriptionRepository.cancelSubscription(
                subscription_id,
                is_active
            );

        if (!cancel_subscription) {
            throw new ValidationError(
                "SUBSCRIPTION.FAILED_ON_CANCEL_SUBSCRIPTION"
            );
        }

        const broker_account = await this.brokerAccountRepository.getByUser(user_id);
        if (!broker_account) { throw new ValidationError("broker_account.not_found"); }
        const operation_account = subscription.brokerOperationAccount;
        if (!operation_account) { throw new ValidationError("operation_account.not_found")}
        const account_number = operation_account.number;
        const integration_token = broker_account.external_broker_account_id;
        await new SelectMarketsService().stopRobot(account_number, integration_token);

        return cancel_subscription;
    }
}

export default SubscriptionService;
