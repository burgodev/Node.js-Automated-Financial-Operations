import { Router } from "express";
import PaymentTypeRepository from "../repositories/payment-type-repository";
import PaymentTypeController from "../controllers/payment-type-controller";
import PaymentTypeService from "../services/payment-type/payment-type.service";
import { PrismaClient } from "@prisma/client";
import ensureAuthenticated from "../middlewares/ensure-authenticated";

const prisma = new PrismaClient();
const paymentTypeRepository = new PaymentTypeRepository(prisma);
const paymentTypeService = new PaymentTypeService(paymentTypeRepository);
const paymentTypeController = new PaymentTypeController(paymentTypeService);

const paymentTypeRoutes = Router();

paymentTypeRoutes.get(
    "/",
    ensureAuthenticated,
    paymentTypeController.list.bind(paymentTypeController)
);

export default paymentTypeRoutes;
