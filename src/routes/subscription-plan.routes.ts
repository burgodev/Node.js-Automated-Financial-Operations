import { Router } from "express";
import SubscriptionPlanRepository from "../repositories/subscription-plan-repository";
import SubscriptionPlanController from "../controllers/subscription-plan-controller";
import SubscriptionPlanService from "../services/subscription-plan/subscription-plan.service";
import { PrismaClient } from "@prisma/client";
import ensureAuthenticated from "../middlewares/ensure-authenticated";

const prisma = new PrismaClient();
const subscriptionPlanRepository = new SubscriptionPlanRepository(prisma);
const subscriptionPlanService = new SubscriptionPlanService(
    subscriptionPlanRepository
);
const subscriptionPlanController = new SubscriptionPlanController(
    subscriptionPlanService
);

const subscriptionPlanRoutes = Router();

subscriptionPlanRoutes.get(
    "/",
    ensureAuthenticated,
    subscriptionPlanController.list.bind(subscriptionPlanController)
);

export default subscriptionPlanRoutes;
