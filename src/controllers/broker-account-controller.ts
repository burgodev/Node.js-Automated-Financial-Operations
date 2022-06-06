import { Request, Response } from "express";
import ValidationError from "../errors/validation-error";
import { r } from "../helpers/general";
import BrokerAccountService from "../services/broker/broker-account.service";
import { ILoggedUser } from "../types/auth";

class BrokerAccountController {
    private brokenAccountService: BrokerAccountService;

    constructor(brokerAccountService: BrokerAccountService) {
        this.brokenAccountService = brokerAccountService;
    }

    public async synchronize(request: Request, response: Response) {
        const user: ILoggedUser = request.user;
        const integration_token: string = request.body.integration_token;
        const broker_name = "SELECT MARKETS";

        const data = await this.brokenAccountService.synchronize(
            user,
            integration_token,
            broker_name
        );

        return r(response, "BROKER.SYNCHRONIZE.SUCCESS", data);
    }
    public async checkBrokerAccount(request: Request, response: Response) {
        const user: ILoggedUser = request.user;
        const broker_account_id =
            await this.brokenAccountService.checkBrokerExternalBrokerAccountId(
                user.user_id
            );

        if (broker_account_id === false) {
            throw new ValidationError(
                "BROKER_ACCOUNT.EXTERNAL_ACCOUNT_NOT_CHECKED"
            );
        }
        return r(
            response,
            "BROKER_ACCOUNT.EXTERNAL_ACCOUNT_ID.CHECKED",
            broker_account_id
        );
    }
}

export default BrokerAccountController;
