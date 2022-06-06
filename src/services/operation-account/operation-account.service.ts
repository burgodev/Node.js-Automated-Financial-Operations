import OperationAccountRepository from "../../repositories/operation-account-repository";
import { ILoggedUser } from "../../types/auth";
import {
    IOperationAccountCreateRepository,
    IOperationAccountListRepository,
    ISelectOperationAccount,
} from "../../types/operation-accounts";
import selectApi from "../../helpers/select-integration";
import ValidationError from "../../errors/validation-error";
import { OperationAccountType } from "@prisma/client";
import BrokerAccountRepository from "../../repositories/broker-account-repository";
import { IBrokerAccountGetByUserRepository } from "../../types/broker-account";

class OperationAccountService {
    private operationAccountRepository: OperationAccountRepository;
    private brokerAccountRepository: BrokerAccountRepository;

    constructor(
        operationAccountRepository: OperationAccountRepository,
        brokerAccountRepository: BrokerAccountRepository
    ) {
        this.operationAccountRepository = operationAccountRepository;
        this.brokerAccountRepository = brokerAccountRepository;
    }

    public async list(
        user: ILoggedUser,
        account_type: string,
        integration_token: string
    ) {
        if (account_type !== "REAL" && account_type !== "DEMO") {
            throw new ValidationError(
                "OPERATION_ACCOUNT.BAD_REQUEST.INVALID_ACCOUNT_TYPE"
            );
        }

        const broker = await this.brokerAccountRepository.getByUser(
            user.user_id
        );

        if (!broker) {
            throw new ValidationError(
                "OPERATION_ACCOUNT.ERROR.COULD_NOT_FIND_USER_BROKER"
            );
        }
        const { data } = await selectApi.post(
            "/webhook/botmoney/list-operation-account",
            {
                integration_token,
                account_type,
                filter: "ALL",
            }
        );

        if (!data) {
            throw new ValidationError(
                "API.SELECT.EERROR.CANNOT_FIND_ACCOUNTS_IN_DATABASE"
            );
        }
        const select_operation_accounts = data.payload;

        if (select_operation_accounts.length === 0) {
            throw new ValidationError(
                "OPERATION_ACCOUNT.ERROR.CANNOT_FIND_ACCOUNTS_IN_DATABASE"
            );
        }

        const botmoney_operation_accounts: IOperationAccountListRepository[] =
            await this.operationAccountRepository.list(
                user.user_id,
                account_type
            );

        await this.operationAccountSynchronization(
            select_operation_accounts,
            botmoney_operation_accounts,
            broker.id
        );

        return select_operation_accounts;
    }

    private async operationAccountSynchronization(
        select_operation_accounts: ISelectOperationAccount[],
        botmoney_operation_accounts: IOperationAccountListRepository[],
        broker_id: string
    ): Promise<void> {
        for (let i = 0; i < select_operation_accounts.length; i++) {
            const sa = select_operation_accounts[i];
            // const find_account = botmoney_operation_accounts.find(
            //     (ba) => ba.number === sa.account_number
            // );

            // if (find_account) {
            //     if (find_account.balance_total !== sa.balance) {
            //         this.operationAccountRepository.update(
            //             find_account.number,
            //             sa.name,
            //             sa.balance
            //         );
            //     }
            // } else {
            // const { ...obj } = sa;
            const account_type: OperationAccountType =
                this.castOperationAccountType(sa.is_demo);
            const new_oa: IOperationAccountCreateRepository = {
                number: sa.account_number,
                name: sa.name,
                type: account_type,
                balance_total: sa.balance,
                broker_account_id: broker_id,
            };
            this.operationAccountRepository.create(new_oa);
            // }
        }

        for (let i = 0; i < botmoney_operation_accounts.length; i++) {
            const ba = botmoney_operation_accounts[i];
            const find_account = select_operation_accounts.find(
                (sa) => sa.account_number === ba.number
            );
            if (!find_account) {
                this.operationAccountRepository.delete(ba.number);
            }
        }
    }

    private castOperationAccountType(is_demo: boolean): OperationAccountType {
        if (!is_demo) {
            return "REAL";
        } else if (is_demo) {
            return "DEMO";
        }

        throw new ValidationError(
            "OPERATION_ACCOUNT.SYNCHRONIZATION.INVALID_ACCOUNT_TYPE"
        );
    }
}

export default OperationAccountService;
