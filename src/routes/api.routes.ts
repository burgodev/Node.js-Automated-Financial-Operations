import { Router } from "express";
import UserRoutes from "./user.routes";
import SubscriptionRoutes from "./subscription.routes";
import GatewayRoutes from "./gateway.routes";
import AuthRoutes from "./auth.routes";
import signInRoutes from "./sign-in.routes";
import cardRoutes from "./card.routes";
import addressRoutes from "./address.routes";
import countryRoutes from "./country.routes";
import brokerRoutes from "./broker.routes";
import operationAccountRoutes from "./operation-account.routes";
import subscriptionPlanRoutes from "./subscription-plan.routes";
import paymentTypeRoutes from "./payment-type.routes";
import paymentMethodRoutes from "./payment-method.routes";
import paymentCardRoutes from "./payment-card.routes";

const api = Router();

api.get("/test", (req, res) => {
    console.log("Working API");
    res.json({ msg: "Working API" });
});

api.use("/users", UserRoutes);
api.use("/subscriptions", SubscriptionRoutes);
api.use("/gateway", GatewayRoutes);
api.use("/cards", cardRoutes);
api.use("/signin", signInRoutes);
api.use("/auth", AuthRoutes);
api.use("/addresses", addressRoutes);
api.use("/countries", countryRoutes);
api.use("/brokers", brokerRoutes);
api.use("/operation-accounts", operationAccountRoutes);
api.use("/subscription-plans", subscriptionPlanRoutes);
api.use("/payment-types", paymentTypeRoutes);
api.use("/payment-methods", paymentMethodRoutes);
api.use("/payment-card", paymentCardRoutes);

export default api;
