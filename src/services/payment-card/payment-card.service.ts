import ValidationError from "../../errors/validation-error";
import PaymentCardRepository from "../../repositories/payment-card-repository";
import { IPaymentCardCreateRepository } from "../../types/payment-card";

class PaymentCardService {
    private paymentCardRepository: PaymentCardRepository;

    constructor(paymentCardRepository: PaymentCardRepository) {
        this.paymentCardRepository = paymentCardRepository;
    }

    public async create(
        user_id: string,
        cardholder: string,
        number: string,
        expiry_month: string,
        expiry_year: string,
        address_id: string
    ) {
        const new_payment_card: IPaymentCardCreateRepository = {
            cardholder,
            number,
            expiry_month,
            expiry_year,
            user_id,
            address_id,
        };

        const payment_card = await this.paymentCardRepository.createWithAddress(
            new_payment_card
        );
        if (!payment_card) {
            throw new ValidationError(
                "PAYMENT_CARD.ERROR.CANNOT_ADD_A_NEW_CREDIT_CARD"
            );
        }
        return payment_card;
    }

    public async findById(user_id: string) {
        const result = await this.paymentCardRepository.findById(user_id);

        return result;
    }

    public async findByNumber(number: string) {
        const result = await this.paymentCardRepository.findByNumber(number);

        return result;
    }
}

export default PaymentCardService;
