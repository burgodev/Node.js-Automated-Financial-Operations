import { Router } from "express";
import PaymentMethodRepository from "../repositories/payment-method-repository";
import PaymentMethodController from "../controllers/payment-method-controller";
import PaymentMethodService from "../services/payment-method/payment-method.service";
import { PrismaClient } from "@prisma/client";
import ensureAuthenticated from "../middlewares/ensure-authenticated";

const prisma = new PrismaClient();
const paymentMethodRepository = new PaymentMethodRepository(prisma);
const paymentMethodService = new PaymentMethodService(paymentMethodRepository);
const paymentMethodController = new PaymentMethodController(
    paymentMethodService
);

const paymentMethodRoutes = Router();

paymentMethodRoutes.get(
    "/",
    ensureAuthenticated,
    paymentMethodController.list.bind(paymentMethodController)
);

export default paymentMethodRoutes;
