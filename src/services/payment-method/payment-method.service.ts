import ValidationError from "../../errors/validation-error";
import PaymentMethodRepository from "../../repositories/payment-method-repository";

class PaymentMethodService {
    private paymentMethodRepository: PaymentMethodRepository;

    constructor(paymentMethodRepository: PaymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
    }

    public async list() {
        const payment_method = await this.paymentMethodRepository.list();

        if (!payment_method || payment_method.length === 0) {
            throw new ValidationError(
                "PAYMENT_METHOD.NO_PAYMENT_METHOD_AVAILABLE"
            );
        }

        return payment_method;
    }

    public async findById(id: string) {
        const payment_method = await this.paymentMethodRepository.findById(id);
        if (!payment_method) {
            throw new ValidationError(
                "PAYMENT_METHOD.NO_PAYMENT_METHOD_AVAILABLE"
            );
        }
        return payment_method;
    }

    public async findByPaymentTypeId(id: string) {
        const payment_method_id =
            await this.paymentMethodRepository.findByPaymentTypeId(id);
        if (!payment_method_id) {
            throw new ValidationError(
                "PAYMENT_METHOD.NO_PAYMENT_METHOD_AVAILABLE"
            );
        }

        return payment_method_id;
    }
}

export default PaymentMethodService;
