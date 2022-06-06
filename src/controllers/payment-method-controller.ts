import { Request, Response } from "express";
import { r } from "../helpers/general";
import PaymentMethodService from "../services/payment-method/payment-method.service";

class PaymentMethodController {
    private paymentMethodService: PaymentMethodService;

    constructor(paymentMethodService: PaymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }

    public async list(request: Request, response: Response) {
        const data = await this.paymentMethodService.list();

        return r(response, "SUCCESS", data);
    }

    public async findById(request: Request, response: Response) {
        const payment_method_id: string = request.query
            .payment_method_id as string;
        const data = await this.paymentMethodService.findById(
            payment_method_id
        );

        return r(response, "SUCCESS", data);
    }
}

export default PaymentMethodController;
