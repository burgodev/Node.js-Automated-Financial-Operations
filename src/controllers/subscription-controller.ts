import { Request, Response } from "express";
import { request } from "http";
import ValidationError from "../errors/validation-error";
import { r } from "../helpers/response";
import AddressService from "../services/address.service";
import AsaasService from "../services/gateways/asaas.service";
import GatewayService from "../services/gateways/gateway.service";
import PaymentCardService from "../services/payment-card/payment-card.service";
import PaymentMethodService from "../services/payment-method/payment-method.service";
import SubscriptionService from "../services/subscription/subscription.service";
import UserService from "../services/user/user.service";
import { IAsaasCreateCostumerRepository } from "../types/asaas";
import { ILoggedUser } from "../types/auth";
import SelectMarketsService from "../services/selectmarkets/selectmarkets.service";
import BrokerAccountRepository from "../repositories/broker-account-repository";
import SubscriptionPlanRepository from "../repositories/subscription-plan-repository";

class SubscriptionController {
    private subscriptionService: SubscriptionService;
    private asaasService: AsaasService;
    private userService: UserService;
    private addressService: AddressService;
    private gatewayService: GatewayService;
    private paymentMethodService: PaymentMethodService;
    private paymentCardService: PaymentCardService;
    private selectMarketsService: SelectMarketsService;
    private brokerAccountRepository: BrokerAccountRepository;
    private subscriptionPlanRepository: SubscriptionPlanRepository;

    constructor(
        subscriptionService: SubscriptionService,
        asaasService: AsaasService,
        userService: UserService,
        addressService: AddressService,
        gatewayService: GatewayService,
        paymentMethodService: PaymentMethodService,
        paymentCardService: PaymentCardService,
        selectMarketsService: SelectMarketsService,
        brokerAccountRepository: BrokerAccountRepository,
        subscriptionPlanRepository: SubscriptionPlanRepository
    ) {
        this.subscriptionService = subscriptionService;
        this.asaasService = asaasService;
        this.userService = userService;
        this.addressService = addressService;
        this.gatewayService = gatewayService;
        this.paymentMethodService = paymentMethodService;
        this.paymentCardService = paymentCardService;
        this.selectMarketsService = selectMarketsService;
        this.brokerAccountRepository = brokerAccountRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
    }

    public async create(request: Request, response: Response) {
        const user: ILoggedUser = request.user;
        const { payment_config_id, subscription_plan_id } = request.body;

        const data = await this.subscriptionService.create(
            user,
            payment_config_id,
            subscription_plan_id
        );

        return r(response, "SUBSCRIPTION.SUCCESS", data);
    }

    public async asaasGenerateTicket(request: Request, response: Response) {
        const user: ILoggedUser = request.user;
        const {
            name,
            cpf,
            description,
            price,
            subscription_plan_id,
            payment_method_id,
        } = request.body;
        const user_info = await this.userService.findById(user.user_id);

        const payment_method = await this.paymentMethodService.findById(
            payment_method_id
        );

        if (!payment_method || payment_method === null) {
            throw new ValidationError("PAYMENT_METHOD.METHOD_NOT_FOUND");
        }

        const customer = {
            name,
            cpfCnpj: cpf,
            email: user_info.email,
        };

        const create_customer = await this.asaasService.createCustomer(
            customer
        );

        const subscription_data = {
            subscription_plan_id: subscription_plan_id,
            payment_method_id: payment_method_id,
            payment_gateway_id: payment_method.payment_gateway_id,
            payment_type_id: payment_method.payment_type_id,
        };

        const ticket_information = {
            customer: create_customer.id,
            billingType: "BOLETO",
            value: price,
            description,
            postalService: false,
        };

        const create_ticket: any = await this.gatewayService.getTicket(
            ticket_information
        );

        if (!create_ticket) {
            throw new ValidationError("CREATE_TICKET_ASAAS.ERROR_ON_CREATE");
        }
        const gateway_customer = {
            customer_id: create_customer.id,
            payment_gateway_id: payment_method.payment_gateway_id,
            user_id: user.user_id,
        };
        const external_reference = create_ticket.id;

        const subscription = await this.gatewayService.makeSubscription(
            user.user_id,
            subscription_data,
            gateway_customer,
            external_reference
            // broker_number
        );
        if (!subscription || subscription === null) {
            throw new ValidationError("SUBSCRIPTION.CREATE_ERROR");
        }

        return r(response, "SUCCESS", create_ticket);
    }

    public async asaasCreateSubscription(request: Request, response: Response) {
        const user: ILoggedUser = request.user;
        let address_info = await this.addressService.getUserMainAddress(
            user.user_id
        );

        const user_info = await this.userService.findById(user.user_id);
        const {
            subscription_plan_id,
            // broker_number,
            payment_method_id,
            payment_type,
            plan_name,
            plan_price,
            card_holderName,
            card_number,
            card_cvv,
            card_expiry_month,
            card_expiry_year,
            phone,
            cpf,
            country_id,
            state,
            city,
            street,
            neighborhood,
            complement,
            address_number,
            cep,
        } = request.body;

        const new_address = {
            country_id,
            cep,
            state,
            city,
            street,
            neighborhood,
            complement,
            number: address_number,
            user_id: user.user_id,
            is_main_address: true,
        };

        if (!address_info) {
            address_info = await this.addressService.createAddress(new_address);
        }

        const customer: IAsaasCreateCostumerRepository = {
            name: card_holderName,
            cpfCnpj: cpf,
            email: user_info.email,
            phone: phone,
            postalCode: cep,
        };

        const create_customer = await this.asaasService.createCustomer(
            customer
        );

        if (!create_customer || create_customer === null) {
            throw new ValidationError("CUSTOMER.CREATE_CUSTOMER_ERROR");
        }

        const payment_method = await this.paymentMethodService.findById(
            payment_method_id
        );

        if (!payment_method || payment_method === null) {
            throw new ValidationError("PAYMENT_METHOD.METHOD_NOT_FOUND");
        }

        const card_address_id: any = address_info?.id;
        let payment_card: any = await this.paymentCardService.findByNumber(
            card_number
        );

        if (!payment_card && card_number !== "") {
            payment_card = await this.paymentCardService.create(
                user.user_id,
                card_holderName,
                card_number,
                card_expiry_month,
                card_expiry_year,
                card_address_id
            );
        }

        const user_data = {
            name: user_info.name,
            email: user_info.email,
            document: cpf,
            phone: phone,
            mobilePhone: phone,
        };

        const subscription_plan = {
            name: plan_name,
            price: plan_price,
        };
        const credit_card_data = {
            holderName: card_holderName,
            number: card_number,
            ccv: card_cvv,
            expiryMonth: card_expiry_month,
            expiryYear: card_expiry_year,
            postalCode: cep,
            addressNumber: address_number,
        };

        const gateway_customer = {
            customer_id: create_customer.id,
            payment_gateway_id: payment_method.payment_gateway_id,
            user_id: user.user_id,
        };

        const subscription_data = {
            subscription_plan_id: subscription_plan_id,
            payment_method_id: payment_method_id,
            card_id: payment_card?.id,
            ccv: card_cvv,
            payment_gateway_id: payment_method.payment_gateway_id,
            payment_type_id: payment_method.payment_type_id,
            credit_card: {
                ccv: card_cvv,
                payment_card_id: payment_card?.id,
                data: {
                    cardholder: card_holderName,
                    number: card_number,
                    expiry_month: card_expiry_month,
                    expiry_year: card_expiry_year,
                },
            },
        };

        const subscription_on_gateway: any =
            await this.gatewayService.makeSubscriptionInGateway(
                user_data,
                create_customer.id,
                payment_type,
                subscription_plan,
                credit_card_data
            );

        if (!subscription_on_gateway || subscription_on_gateway === null) {
            throw new ValidationError("SUBSCRIPTION_ON_GATEWAY.ERROR");
        }

        const external_reference: string = subscription_on_gateway.id;

        const subscription = await this.gatewayService.makeSubscription(
            user.user_id,
            subscription_data,
            gateway_customer,
            external_reference
            // broker_number
        );
        if (!subscription || subscription === null) {
            throw new ValidationError("SUBSCRIPTION.CREATE_ERROR");
        }

        return r(
            response,
            "ASAAS_SUBSCRIPTION.SUCCESS_SUBSCRIBED",
            subscription
        );
    }

    public async listByUser(request: Request, response: Response) {
        const user: ILoggedUser = request.user;

        const subscription = await this.subscriptionService.listByUser(
            user.user_id
        );

        return r(
            response,
            "SUBSCRIPTION.SUBSCRIPTION_PLAN_LIST_DONE",
            subscription
        );
    }

    public async createSimulation(request: Request, response: Response) {
        const user: ILoggedUser = request.user;

        const { subscription_plan_id, broker_number } = request.body;
        const account_number = broker_number;

        const broker_account = await this.brokerAccountRepository.getByUser(user.user_id);
        if (!broker_account) { throw new ValidationError("selectmarkets.broker_account_not_synchrozed"); }
        const external_broker_account_id = broker_account.external_broker_account_id;
        
        const now = new Date();
        const expires_at = new Date(now.setMonth(now.getMonth() + 1));

        const subscription_plan = await this.subscriptionPlanRepository.findById(subscription_plan_id);
        if (!subscription_plan) { throw new ValidationError("subscription_plan.not_found"); } 
        const robot_id = subscription_plan.trader_robot_id;

        await this.selectMarketsService.startRobot(external_broker_account_id, account_number, robot_id, expires_at);

        const new_simulation = {
            start_date: new Date(),
            expires_at,
            is_active: true,
            is_simulation: true,
            created_at: new Date(),
            user_id: user.user_id,
            subscription_plan_id,
        };

        const simulation = await this.subscriptionService.createSimulation(
            new_simulation
        );

        const broker_operation_account =
            await this.gatewayService.checkBrokerOperationAccount(
                broker_number
            );
        if (
            !broker_operation_account ||
            broker_operation_account.length === 0
        ) {
            throw new ValidationError(
                "BROKER_OPERATION_ACCOUNT.DOES_NOT_EXISTS"
            );
        } else {
            await this.gatewayService.updateBrokerOperationAccount(
                broker_operation_account,
                simulation.id
            );
        }

        return r(
            response,
            "SUBSCRIPTION.SIMULATION_SUCCESS_CREATED",
            simulation
        );
    }

    public async cancelSubscription(request: Request, response: Response) {
        const { subscription_id, is_active, is_simulation } = request.body;
        const user: ILoggedUser = request.user;
        const result = await this.subscriptionService.cancelSubscription(
            subscription_id,
            is_active,
            is_simulation,
            user.user_id
        );

        return r(response, "SUBSCRIPTION.SUCCESS_CANCELED", result);
    }
}

export default SubscriptionController;
