import { Request, Response } from "express";
import AddressService from "../services/address.service";
import { IAddress } from "../types/address";
import { ILoggedUser } from "../types/auth";
import { r } from "../helpers/general";

class AddressController {
    private addressService: AddressService;

    constructor(addressService: AddressService) {
        this.addressService = addressService;
    }

    public async list(request: Request, response: Response) {
        const user: ILoggedUser = request.user;
        const ret = await this.addressService.listById(user.user_id);

        return r(response, "ADDRESS.LIST", ret);
    }

    public async create(
        request: Request,
        response: Response
    ): Promise<Response> {
        const address: IAddress = request.body;
        const new_address = await this.addressService.createAddress(address);

        return r(response, "ADDRESS.CREATE", new_address);
    }
}

export default AddressController;
