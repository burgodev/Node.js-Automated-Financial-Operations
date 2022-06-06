import ValidationError from "../../errors/validation-error";
import PaymentTypeRepository from "../../repositories/payment-type-repository";

class PaymentTypeService {
    private paymentTypeRepository: PaymentTypeRepository;

    constructor(paymentTypeRepository: PaymentTypeRepository) {
        this.paymentTypeRepository = paymentTypeRepository;
    }

    public async list() {
        const payment_type = await this.paymentTypeRepository.list();

        if (!payment_type || payment_type.length === 0) {
            throw new ValidationError("PAYMENT_TYPE.NO_PAYMENT_TYPE_AVAILABLE");
        }

        return payment_type;
    }
}

export default PaymentTypeService;
