import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import CardController from "../controllers/card-controller";
import ensureAuthenticated from "../middlewares/ensure-authenticated";
import AddressRepository from "../repositories/address-repository";
import CardRepository from "../repositories/card-repository";
import PaymentMethodRepository from "../repositories/payment-method-repository";
import CardService from "../services/card/card.service";
import PaymentMethodService from "../services/payment-method/payment-method.service";

const prisma = new PrismaClient();
const addressRepository = new AddressRepository(prisma);
const paymentMethodRepository = new PaymentMethodRepository(prisma);

const cardRepository = new CardRepository(prisma);
const paymentMethodService = new PaymentMethodService(paymentMethodRepository);
const cardService = new CardService(cardRepository, addressRepository);
const cardController = new CardController(cardService, paymentMethodService);

const cardRoutes = Router();

cardRoutes.post(
    "/",
    ensureAuthenticated,
    cardController.create.bind(cardController)
);
cardRoutes.post(
    "/validation",
    ensureAuthenticated,
    cardController.validation.bind(cardController)
);
cardRoutes.get(
    "/",
    ensureAuthenticated,
    cardController.list.bind(cardController)
);
cardRoutes.get(
    "/:card_id",
    ensureAuthenticated,
    cardController.getById.bind(cardController)
);

export default cardRoutes;
