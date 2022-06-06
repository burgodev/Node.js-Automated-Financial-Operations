import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import UserController from "../controllers/user-controller";
import ensureAuthenticated from "../middlewares/ensure-authenticated";
import {
    createSchema,
    findByIdSchema,
    updateSchema,
} from "../middlewares/validators/user";
import AddressRepository from "../repositories/address-repository";
import AddressService from "../services/address.service";

const prisma = new PrismaClient();
const addressRepository = new AddressRepository(prisma);
const addressService = new AddressService(addressRepository);
const userController = new UserController(addressService);

const UserRoutes = Router();

UserRoutes.post("/", createSchema, userController.create.bind(userController));

UserRoutes.get("/", userController.list.bind(userController));

UserRoutes.get(
    "/profile",
    ensureAuthenticated,
    userController.profile.bind(userController)
);

UserRoutes.get(
    "/:id",
    findByIdSchema,
    userController.findById.bind(userController)
);

UserRoutes.put(
    "/",
    ensureAuthenticated,
    updateSchema,
    userController.update.bind(userController)
);

// ! TDB THE RULES FOR THIS ROUTE
// UserRoutes.delete("/:id", deleteSchema, middleware, userController.destroy.bind(userController));

export default UserRoutes;
