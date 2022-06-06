import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import PaymentCardRepository from "../repositories/payment-card-repository";
import PaymentCardService from "../services/payment-card/payment-card.service";
import PaymentCardController from "../controllers/payment-card-controller";
import ensureAuthenticated from "../middlewares/ensure-authenticated";
import GatewayService from "../services/gateways/gateway.service";
import CustomerGatewayInfoRepository from "../repositories/customer-gateway-infos-repository";

const prisma = new PrismaClient();
const gatewayRepository = new CustomerGatewayInfoRepository(prisma);
const gatewayService = new GatewayService(gatewayRepository);
const paymentCardRepository = new PaymentCardRepository(prisma);
const paymentCardService = new PaymentCardService(paymentCardRepository);
const paymentCardController = new PaymentCardController(
    paymentCardService,
    gatewayService
);

const paymentCardRoutes = Router();

paymentCardRoutes.get(
    "/list",
    ensureAuthenticated,
    paymentCardController.findCardByUserId.bind(paymentCardController)
);

export default paymentCardRoutes;
