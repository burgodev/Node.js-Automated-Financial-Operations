import UserService from "../services/user/user.service";
import { IUser } from "../types/user";
import { Request, Response } from "express";
import CrudController from "./crud-controller";
import ValidationError from "../errors/validation-error";
import Res, { r } from "../helpers/response";
import AddressService from "../services/address.service";
import { l } from "../helpers/general";

class UserController extends CrudController<IUser, UserService> {
    private addressService: AddressService;
    constructor(addressService: AddressService) {
        super(new UserService());
        this.addressService = addressService;
    }

    public async create(
        request: Request,
        response: Response
    ): Promise<Response> {
        const obj = request.body;

        const objCreate = await this.service.create(obj);

        if (!objCreate) {
            throw new ValidationError("USER.ERROR_CREATING_A_NEW_USER");
        }

        return r(response, "USER.SUCCESS_CREATED", objCreate);
    }

    public async profile(
        request: Request,
        response: Response
    ): Promise<Response> {
        const obj = request.body;

        const user_data = await this.service.findById(request.user.user_id);

        return new Res(response).success(user_data);
    }

    public async update(
        request: Request,
        response: Response
    ): Promise<Response> {
        const id = request.user.user_id;

        const {
            name,
            birthday,
            phone,
            ddi,
            document,
            street,
            number,
            neighborhood,
            complement,
            cep,
            state,
            city,
            country_id,
        } = request.body;

        const user = await this.service.update(id, {
            name,
            birthday,
            phone,
            ddi,
            document,
        });

        const address = await this.addressService.getUserMainAddress(id);

        const address_data = {
            cep,
            number,
            street,
            city,
            state,
            country_id,
            user_id: user.id,
            neighborhood,
            is_main_address: true,
            complement,
        };

        l("INFO", "address to save", address_data);

        if (address?.id) {
            await this.addressService.update(address.id, address_data);
        } else {
            await this.addressService.createAddress(address_data);
        }

        delete user.id;
        return new Res(response)
            .setMessage("USER.CREATE.SUCCESS")
            .success(user);
    }
}

export default UserController;
