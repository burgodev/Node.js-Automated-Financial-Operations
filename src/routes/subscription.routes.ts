import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import SubscriptionController from "../controllers/subscription-controller";
import ensureAuthenticated from "../middlewares/ensure-authenticated";
import AddressRepository from "../repositories/address-repository";
import CustomerGatewayInfoRepository from "../repositories/customer-gateway-infos-repository";
import PaymentCardRepository from "../repositories/payment-card-repository";
import PaymentMethodRepository from "../repositories/payment-method-repository";
import SubscriptionRepository from "../repositories/subscription-repository";
import AddressService from "../services/address.service";
import AsaasService from "../services/gateways/asaas.service";
import GatewayService from "../services/gateways/gateway.service";
import PaymentCardService from "../services/payment-card/payment-card.service";
import PaymentMethodService from "../services/payment-method/payment-method.service";
import SubscriptionService from "../services/subscription/subscription.service";
import UserService from "../services/user/user.service";
import SelectMarketsService from "../services/selectmarkets/selectmarkets.service";
import BrokerAccountRepository from "../repositories/broker-account-repository";
import SubscriptionPlanRepository from "../repositories/subscription-plan-repository";

const SubscriptionRoutes = Router();

const prisma = new PrismaClient();

const subscriptionRepository = new SubscriptionRepository(prisma);
const customerGatewayInfosRepository = new CustomerGatewayInfoRepository(prisma);
const paymentMethodRepository = new PaymentMethodRepository(prisma);
const paymentCardRepository = new PaymentCardRepository(prisma);
const addressRepository = new AddressRepository(prisma);
const asaasService = new AsaasService();
const userService = new UserService();
const addressService = new AddressService(addressRepository);
const gatewayService = new GatewayService(customerGatewayInfosRepository);
const paymentMethodService = new PaymentMethodService(paymentMethodRepository);
const paymentCardService = new PaymentCardService(paymentCardRepository);
const selectMarketsService = new SelectMarketsService();
const brokerAccountRepository = new BrokerAccountRepository(prisma);
const subscriptionPlanRepository =  new SubscriptionPlanRepository(prisma);
const subscriptionService = new SubscriptionService(subscriptionRepository, brokerAccountRepository);

const subscriptionController = new SubscriptionController(
    subscriptionService,
    asaasService,
    userService,
    addressService,
    gatewayService,
    paymentMethodService,
    paymentCardService,
    selectMarketsService,
    brokerAccountRepository,
    subscriptionPlanRepository
);

// SubscriptionApi.post('/', ensureAuthenticated, subscriptionController.create.bind(subscriptionController));
// SubscriptionApi.get('/', subscriptionController.list.bind(subscriptionController));

SubscriptionRoutes.post(
    "/asaas/subscription",
    ensureAuthenticated,
    subscriptionController.asaasCreateSubscription.bind(subscriptionController)
);

SubscriptionRoutes.get(
    "/",
    ensureAuthenticated,
    subscriptionController.listByUser.bind(subscriptionController)
);

SubscriptionRoutes.post(
    "/asaas/generate/ticket",
    ensureAuthenticated,
    subscriptionController.asaasGenerateTicket.bind(subscriptionController)
);

SubscriptionRoutes.post(
    "/simulation",
    ensureAuthenticated,
    subscriptionController.createSimulation.bind(subscriptionController)
);

SubscriptionRoutes.post(
    "/cancel",
    ensureAuthenticated,
    subscriptionController.cancelSubscription.bind(subscriptionController)
);

export default SubscriptionRoutes;
