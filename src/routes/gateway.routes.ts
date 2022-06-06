import { Router } from "express";
import GatewayController from "../controllers/gateway-controller";
const GatewayRoutes = Router();

const gatewayController = new GatewayController();

// GatewayRoutes.post('/webhook/:gateway', gatewayController.webhook.bind(gatewayController));

export default GatewayRoutes;
