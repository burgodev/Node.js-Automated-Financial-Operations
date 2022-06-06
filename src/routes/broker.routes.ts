import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import BrokerAccountController from "../controllers/broker-account-controller";
import ensureAuthenticated from "../middlewares/ensure-authenticated";
import BrokerAccountRepository from "../repositories/broker-account-repository";
import BrokerRepository from "../repositories/broker-repository";
import BrokerAccountService from "../services/broker/broker-account.service";

const prisma = new PrismaClient();

const brokerRepository = new BrokerRepository(prisma);
const brokerAccountRepository = new BrokerAccountRepository(prisma);
const brokerAccountService = new BrokerAccountService(
    brokerAccountRepository,
    brokerRepository
);
const brokerAccountController = new BrokerAccountController(
    brokerAccountService
);

const brokerRoutes = Router();

brokerRoutes.post(
    "/synchronize",
    ensureAuthenticated,
    brokerAccountController.synchronize.bind(brokerAccountController)
);

brokerRoutes.get(
    "/check-broker-account",
    ensureAuthenticated,
    brokerAccountController.checkBrokerAccount.bind(brokerAccountController)
);

export default brokerRoutes;
