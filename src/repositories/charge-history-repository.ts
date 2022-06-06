import { IChargeHistory } from "../types/charge-history";
import CrudRepository from "./crud-repository";

class ChargeHistoryRepository extends CrudRepository<IChargeHistory> {
    
    protected select_arguments = {
        id: true,
        due_date: true,
        price: true,
        paid_at: true,
        gateway_charge_id: true,
        error_code: true,
        user_id: true,
        payment_config_id: true,
    };

    constructor() {
        super();
        this.setClient(this.prisma.chargeHistory);
    }

    public async findCurrent(externalReference: string, value: number): Promise<Partial<IChargeHistory>> {
        return await this.client.findFirst({
            where: {
                paymentConfig: {
                    payment_external_reference: externalReference,
                },
                price: value,
                paid_at: null,
            },
            select: this.select_arguments,
            orderBy: {
                due_date: 'desc',
            }
        });
    }

    public async paid(id: string): Promise<void> {
        await this.client.update({
            where: {
                id: id,
            },
            data: {
                paid_at: (new Date()).toISOString(),
            },
        });
    }

}

export default ChargeHistoryRepository;