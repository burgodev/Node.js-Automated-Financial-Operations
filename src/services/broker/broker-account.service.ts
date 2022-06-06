import BrokerAccountRepository from "../../repositories/broker-account-repository";
import BrokerRepository from "../../repositories/broker-repository";
import { ILoggedUser } from "../../types/auth";
import selectApi from "../../helpers/select-integration";
import ValidationError from "../../errors/validation-error";

class BrokerAccountService {
    private brokerAccountRepository: BrokerAccountRepository;
    private brokerRepository: BrokerRepository;

    constructor(
        brokerAccountRepository: BrokerAccountRepository,
        brokerRepository: BrokerRepository
    ) {
        this.brokerAccountRepository = brokerAccountRepository;
        this.brokerRepository = brokerRepository;
    }

    public async synchronize(
        user: ILoggedUser,
        integration_token: string,
        broker_name: string
    ) {
        const broker = await this.brokerRepository.findByName(broker_name);

        if (!broker) {
            throw new ValidationError("BROKER.INVALID_BROKER_NAME");
        }

        //Verfica se o token de integração inserido é valido dentro da select markets
        const { data } = await selectApi.post(
            "/webhook/botmoney/synchronize-account",
            {
                integration_token: integration_token,
                botmoney_reference: user.user_id,
            }
        );

        const broker_account_synchronize = data.payload;

        if (data.error) {
            throw new ValidationError(
                "BROKER.SYNCHRONIZE.INVALID_INTEGRATION_TOKEN"
            );
        }

        if (data.message === "success") {
            const token_checked = await this.brokerAccountRepository.checkToken(
                integration_token,
                user.user_id
            );

            if (!token_checked) {
                await this.brokerAccountRepository.create(
                    integration_token,
                    user.user_id,
                    broker.id
                );
            } else {
                throw new ValidationError(
                    "BROKER.SYNCHRONIZE.TOKEN_ALREADY_USED_OR_INVALID"
                );
            }
        }

        return broker_account_synchronize;
    }

    public async checkBrokerExternalBrokerAccountId(user_id: string) {
        const result = await this.brokerAccountRepository.getByUser(user_id);

        if (!result) {
            return false;
        }

        return result;
    }
}

export default BrokerAccountService;
