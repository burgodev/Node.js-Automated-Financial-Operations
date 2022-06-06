import { ISubscriptionCostHistory } from "../types/subscription-cost-history";
import CrudRepository from "./crud-repository";

class SubscriptionCostHistoryRepository extends CrudRepository<ISubscriptionCostHistory> {
    
    protected select_arguments = {
        due_date: true,
        paid_at: true,
        start_validity: true,
        end_validity: true,
        subscription_id: true,
        charge_id: true,
    };

    constructor() {
        super();
        this.setClient(this.prisma.subscriptionCostHistory);
    }

    public async paid(id: string): Promise<void> {
        await this.client.updateMany({
            where: {
                charge_id: id,
            },
            data: {
                paid_at: (new Date()).toISOString(),
            },
        });
    }

}

export default SubscriptionCostHistoryRepository;