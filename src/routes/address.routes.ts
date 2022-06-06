import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import AddressController from "../controllers/address-controller";
import ensureAuthenticated from "../middlewares/ensure-authenticated";
import AddressRepository from "../repositories/address-repository";
import AddressService from "../services/address.service";

const prisma = new PrismaClient();
const addressRepository = new AddressRepository(prisma);
const addressService = new AddressService(addressRepository);
const addressController = new AddressController(addressService);

const addressRoutes = Router();

addressRoutes.get(
    "/",
    ensureAuthenticated,
    addressController.list.bind(addressController)
);
addressRoutes.post(
    "/",
    ensureAuthenticated,
    addressController.create.bind(addressController)
);

export default addressRoutes;
