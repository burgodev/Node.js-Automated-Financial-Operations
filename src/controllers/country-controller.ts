import { Request, Response } from "express";
import CountryService from "../services/country/country.service";
import { r } from "../helpers/general";

class CountryController {
    private coutryService: CountryService;

    constructor(countryService: CountryService) {
        this.coutryService = countryService;
    }

    public async list(request: Request, response: Response) {
        const iso_code: string = request.query.iso_code as string;
        const country: any = await this.coutryService.getById(iso_code);

        if (!iso_code) {
            const countries = await this.coutryService.list();
            return r(response, "SUCCESS", countries);
        }

        return r(response, "SUCCESS", country);
    }
}

export default CountryController;
