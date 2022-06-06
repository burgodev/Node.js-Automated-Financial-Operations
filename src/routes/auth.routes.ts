import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import AuthController from "../controllers/auth-controller";
import ActionLogRepository from "../repositories/action-log-repository";
import DeviceRepository from "../repositories/device-repository";
import ActionLogService from "../services/action-log/action-log.service";
import DeviceService from "../services/device/device.service";
const AuthApi = Router();

const prisma = new PrismaClient();
const actionLogRepository = new ActionLogRepository(prisma);
const actionLogService = new ActionLogService(actionLogRepository);
const deviceRepository = new DeviceRepository(prisma);
const deviceService = new DeviceService(deviceRepository);
const authController = new AuthController(deviceService, actionLogService);

AuthApi.post(
    "/request-password-recovery",
    authController.requestPasswordRecovery.bind(authController)
);
AuthApi.post(
    "/password-recovery",
    authController.passwordRecovery.bind(authController)
);
AuthApi.post("/login", authController.login.bind(authController));

export default AuthApi;
