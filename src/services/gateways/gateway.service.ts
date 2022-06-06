import { PaymentGateway, PaymentType, PrismaClient } from "@prisma/client";
import ValidationError from "../../errors/validation-error";
import { generateUUID } from "../../helpers/general";
import { r } from "../../helpers/response";
import ChargeHistoryRepository from "../../repositories/charge-history-repository";
import CustomerGatewayInfoRepository from "../../repositories/customer-gateway-infos-repository";
import PaymentCardRepository from "../../repositories/payment-card-repository";
import PaymentTypeRepository from "../../repositories/payment-type-repository";
import SubscriptionCostHistoryRepository from "../../repositories/subscription-cost-history-repository";
import SubscriptionPaymentConfigRepository from "../../repositories/subscription-payment-config-repository";
import SubscriptionPlanRepository from "../../repositories/subscription-plan-repository";
import SubscriptionRepository from "../../repositories/subscription-repository";
import UserRepository from "../../repositories/user-repository";
import BrokerOperationAccountRepository from "../../repositories/broker-operation-account-repository";
import {
    IAsaasCreateSubscriptionRepository,
    IAsaasCreateTicketRepository,
} from "../../types/asaas";
import { IChargeHistory } from "../../types/charge-history";
import { ICustomerGatewayInfoCreateRepository } from "../../types/gateway-customer-info";
import { IPaymentCardCreateRepository } from "../../types/payment-card";
import { ISubscriptionCreateRepository } from "../../types/subscription";
import { ISubscriptionCostHistory } from "../../types/subscription-cost-history";
import { ISubscriptionPaymentConfig } from "../../types/subscription-payment-config";
import {
    ISubscriptionPlan,
    ISubscriptionPlanCreateRepository,
} from "../../types/subscription-plan";
import AsaasService from "./asaas.service";

export type SubscriptionRequestData = {
    subscription_plan_id: string;
    payment_method_id: string;
    card_id?: string;
    ccv?: string;
    payment_gateway_id: PaymentGateway | any;
    payment_type_id: PaymentType | any;
    credit_card?: {
        ccv: number;
        payment_card_id?: string | any;
        data?: {
            cardholder: string;
            number: string;
            expiry_month: string | number;
            expiry_year: string | number;
        };
    };
};

class GatewayService {
    private customerGatewayInfosRepository: CustomerGatewayInfoRepository;

    constructor(customerGatewayInfosRepository: CustomerGatewayInfoRepository) {
        this.customerGatewayInfosRepository = customerGatewayInfosRepository;
    }

    protected async getCustomer(data: ICustomerGatewayInfoCreateRepository) {
        const prisma = new PrismaClient();
        const repository = new CustomerGatewayInfoRepository(prisma);
        let gateway_customer = await repository.getGatewayCustomer(data);

        if (!gateway_customer || gateway_customer === null) {
            gateway_customer = await this.customerGatewayInfosRepository.create(
                data
            );
        }

        return gateway_customer;
    }

    protected async getSubscriptionPlan(
        subscription_plan_id: string
    ): Promise<Partial<ISubscriptionPlan>> {
        const prisma = new PrismaClient();
        const repository = new SubscriptionPlanRepository(prisma);
        const sub_plan = repository.findById(subscription_plan_id);
        if (sub_plan == null) {
            throw new Error("Subscription plan not found");
        } else {
            return sub_plan as Partial<ISubscriptionPlan>;
        }
    }

    protected async createPaymentConfig(data: ISubscriptionPaymentConfig) {
        const prisma = new PrismaClient();
        const repository = new SubscriptionPaymentConfigRepository(prisma);
        return repository.create(data);
    }

    protected async updatePaymentConfig(
        id: string,
        data: ISubscriptionPaymentConfig
    ) {
        const prisma = new PrismaClient();
        const repository = new SubscriptionPaymentConfigRepository(prisma);
        return repository.update(id, data);
    }

    protected async createSubscription(data: ISubscriptionCreateRepository) {
        const prisma = new PrismaClient();
        const repository = new SubscriptionRepository(prisma);
        return repository.create(data);
    }

    protected async createCostHistory(
        data: any
    ): Promise<Partial<ISubscriptionCostHistory>> {
        const repository = new SubscriptionCostHistoryRepository();
        return repository.create(data);
    }

    protected async createChargeHistory(
        data: any
    ): Promise<Partial<IChargeHistory>> {
        const repository = new ChargeHistoryRepository();
        return repository.create(data);
    }

    protected async getPaymentType(id: string): Promise<string> {
        const prisma = new PrismaClient();
        const repository = new PaymentTypeRepository(prisma);
        const payment_type = await repository.findById(id);
        return payment_type?.name as string;
    }

    public async checkBrokerOperationAccount(broker_account_number: number) {
        const prisma = new PrismaClient();
        const repository = new BrokerOperationAccountRepository(prisma);
        const broker_operation_account = await repository.getByBrokerNumber(
            broker_account_number
        );

        return broker_operation_account?.id;
    }

    public async updateBrokerOperationAccount(
        broker_operation_account_id: string,
        subscription_id: string
    ) {
        const prisma = new PrismaClient();
        const repository = new BrokerOperationAccountRepository(prisma);
        const broker_operation_account = await repository.updateSubscriptionId(
            broker_operation_account_id,
            subscription_id
        );
        return broker_operation_account;
    }

    public async makeSubscription(
        user_id: string,
        data: SubscriptionRequestData,
        customer: ICustomerGatewayInfoCreateRepository,
        external_reference: string
        // broker_number: number
    ): Promise<any> {
        const user_data = await new UserRepository().findById(user_id);

        // * gateway_customer
        const gateway_customer = await this.getCustomer(customer);

        // * payment_type
        const payment_type = await this.getPaymentType(data.payment_type_id);

        const subscription_plan = await this.getSubscriptionPlan(
            data.subscription_plan_id
        );

        // // * subscription_payment_config

        const subscription_payment_config = await this.createPaymentConfig({
            customer_gateway_id: gateway_customer.id,
            payment_card_id: data.credit_card?.payment_card_id,
            payment_external_reference: external_reference,
            // payment_method_id: data.payment_method_id,
        });

        // * subscription
        const subscription = await this.createSubscription({
            user_id,
            subscription_plan_id: data.subscription_plan_id,
            payment_config_id: subscription_payment_config.id,
            created_at: new Date(),
        });

        // * broker_operation_account
        // const broker_operation_account = await this.checkBrokerOperationAccount(
        //     broker_number
        // );
        // if (
        //     !broker_operation_account ||
        //     broker_operation_account.length === 0
        // ) {
        //     throw new ValidationError(
        //         "BROKER_OPERATION_ACCOUNT.DOES_NOT_EXISTS"
        //     );
        // } else {
        //     await this.updateBrokerOperationAccount(
        //         broker_operation_account,
        //         subscription.id
        //     );
        // }

        // * define due_date
        const due_date = this.defineDue(payment_type);

        // * charge_history
        const charge_history = await this.createChargeHistory({
            due_date: due_date.toISOString(),
            price: subscription_plan.price,
            user_id,
            payment_config_id: subscription_payment_config.id,
        });

        // * cost_history
        await this.createCostHistory({
            subscription_id: subscription.id,
            charge_id: charge_history.id,
            due_date: due_date.toISOString(),
        });

        return { charge_history, payment_type: payment_type };
    }

    public async makeSubscriptionInGateway(
        user_data: any,
        customer_id: string,
        payment_type: string,
        subscription_plan: Partial<ISubscriptionPlanCreateRepository>,
        credit_card_data: any
    ) {
        const due_date = this.defineDue(payment_type);
        const asaasService = new AsaasService();
        const subscription: IAsaasCreateSubscriptionRepository = {
            customer: customer_id,
            billingType: payment_type,
            nextDueDate: due_date.toISOString().split("T")[0],
            value: subscription_plan.price,
            cycle: "MONTHLY",
            description: subscription_plan.name,
            creditCard: {
                holderName: credit_card_data.holderName,
                number: credit_card_data.number,
                ccv: credit_card_data.ccv,
                expiryMonth: credit_card_data.expiryMonth,
                expiryYear: credit_card_data.expiryYear,
            },
            creditCardHolderInfo: {
                name: user_data.name,
                email: user_data.email,
                cpfCnpj: user_data.document,
                postalCode: credit_card_data.postalCode,
                addressNumber: credit_card_data.addressNumber,
                phone: user_data.phone,
                mobilePhone: user_data.mobilePhone,
            },
            fine: {
                value: 0, // TBD
            },
            interest: {
                value: 0, // TBD
            },
        };
        try {
            const result = await asaasService.makeSubscription(subscription);
            return result.data;
        } catch (errors) {
            return errors;
        }
    }

    public async getSubscriptionStatus(subscription_id: string) {
        const asaasService = new AsaasService();

        try {
            const result = await asaasService.getSubscriptionStatus(
                subscription_id
            );
            return result.data;
        } catch (error) {
            return error;
        }
    }

    protected defineDue(payment_type: string): Date {
        const today = new Date();
        if (payment_type === "CREDIT_CARD") {
            today.setDate(today.getDate() + 30);
        } else if (payment_type === "BOLETO") {
            today.setDate(today.getDate() + 3);
        }
        return today; // TBD
    }

    public async getTicket(create_ticket: IAsaasCreateTicketRepository) {
        const asaasService = new AsaasService();
        const due_date = this.defineDue(create_ticket.billingType);
        try {
            const new_ticket: IAsaasCreateTicketRepository = {
                dueDate: due_date,
                ...create_ticket,
            };
            const result = await asaasService.getTicket(new_ticket);

            return result.data;
        } catch (error) {
            return error;
        }
    }
}

export default GatewayService;
