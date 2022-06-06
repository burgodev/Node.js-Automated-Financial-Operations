import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import OperationAccountController from "../controllers/operation-account-controller";
import ensureAuthenticated from "../middlewares/ensure-authenticated";
import BrokerAccountRepository from "../repositories/broker-account-repository";
import OperationAccountRepository from "../repositories/operation-account-repository";
import OperationAccountService from "../services/operation-account/operation-account.service";

const prisma = new PrismaClient();
const operationAccountRepository = new OperationAccountRepository(prisma);
const brokerAccountRepository = new BrokerAccountRepository(prisma);
const operationAccountService = new OperationAccountService(
    operationAccountRepository,
    brokerAccountRepository
);
const operationAccountController = new OperationAccountController(
    operationAccountService
);

const operationAccountRoutes = Router();

// operationAccountRoutes.get("/", ensureAuthenticated, operationAccountController.list.bind(operationAccountController));
operationAccountRoutes.post(
    "/",
    ensureAuthenticated,
    operationAccountController.list.bind(operationAccountController)
);

export default operationAccountRoutes;
