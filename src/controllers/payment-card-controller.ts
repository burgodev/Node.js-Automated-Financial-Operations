import { Request, response, Response } from "express";
import ValidationError from "../errors/validation-error";
import { r } from "../helpers/response";
import GatewayService from "../services/gateways/gateway.service";
import PaymentCardService from "../services/payment-card/payment-card.service";
import { ILoggedUser } from "../types/auth";

class PaymentCardController {
    private paymentCardService: PaymentCardService;
    private gatewayService: GatewayService;

    constructor(
        paymentCardService: PaymentCardService,
        gatewayService: GatewayService
    ) {
        this.paymentCardService = paymentCardService;
        this.gatewayService = gatewayService;
    }

    // public async create(request: Request, response: Response) {
    //     const user: ILoggedUser = request.user;
    //     const { cardholder, number, expiry_month, expiry_year, address_id } =
    //         request.body;

    //     const data = await this.paymentCardService.create(
    //         user,
    //         cardholder,
    //         number,
    //         expiry_month,
    //         expiry_year,
    //         address_id
    //     );

    //     if (!data) {
    //         throw new ValidationError(
    //             "PAYMENT_CARD.ERROR.CANNOT_ADD_A_NEW_PAYMENT_CARD"
    //         );
    //     }

    //     return r(response, "SUCCESS", data);
    // }

    public async findCardByUserId(request: Request, response: Response) {
        const user: ILoggedUser = request.user;

        const data: any = await this.paymentCardService.findById(user.user_id);

        return r(response, "SUCCESS", data);
    }
}

export default PaymentCardController;
