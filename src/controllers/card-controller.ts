import { Request, Response } from "express";
import CardService from "../services/card/card.service";
import { ILoggedUser } from "../types/auth";
import { ICardAndPaymentMethod, ICardRequest } from "../types/card";
import { r } from "../helpers/general";
import PaymentMethodService from "../services/payment-method/payment-method.service";

class CardController {
    private cardService: CardService;
    private paymentMethodService: PaymentMethodService;

    constructor(
        cardService: CardService,
        paymentMethodService: PaymentMethodService
    ) {
        this.cardService = cardService;
        this.paymentMethodService = paymentMethodService;
    }

    public async create(
        request: Request,
        response: Response
    ): Promise<Response> {
        const card: ICardRequest = request.body;
        const user: ILoggedUser = request.user;

        const created_obj = await this.cardService.create(user, card);

        return r(response, "CARD.CREATE.SUCCESS", created_obj);
    }

    public async list(request: Request, response: Response) {
        const user: ILoggedUser = request.user;
        const card = await this.cardService.list(user.user_id);

        return r(response, "CARD.LIST", card);
    }

    public async getById(
        request: Request,
        response: Response
    ): Promise<Response> {
        const user: ILoggedUser = request.user;
        const card_id: string = request.params.card_id;
        const card = await this.cardService.findById(user, card_id);
        const data = card === null ? {} : card;

        return r(response, "CARD.GET_BY_ID", data);
    }

    public async validation(
        request: Request,
        response: Response
    ): Promise<Response> {
        const card: ICardRequest = request.body;

        const data = await this.cardService.validation(card);

        return r(response, "SUCCESS", data);
    }
}

export default CardController;
