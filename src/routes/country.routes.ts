import { Router } from "express";
import CountryRepository from "../repositories/country-repository";
import { PrismaClient } from "@prisma/client";
import CountryService from "../services/country/country.service";
import CountryController from "../controllers/country-controller";

const prisma = new PrismaClient();
const countryRepository: CountryRepository = new CountryRepository(prisma);
const countryService: CountryService = new CountryService(countryRepository);
const countryController: CountryController = new CountryController(
    countryService
);

const countryRoutes = Router();

countryRoutes.get("/", countryController.list.bind(countryController));

export default countryRoutes;
