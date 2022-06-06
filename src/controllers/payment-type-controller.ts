import { Request, Response } from "express";
import { r } from "../helpers/general";
import PaymentTypeService from "../services/payment-type/payment-type.service";

class PaymentTypeController {
    private paymentTypeService: PaymentTypeService;

    constructor(paymentTypeService: PaymentTypeService) {
        this.paymentTypeService = paymentTypeService;
    }

    public async list(request: Request, response: Response) {
        const data = await this.paymentTypeService.list();

        return r(response, "SUCCESS", data);
    }
}

export default PaymentTypeController;
