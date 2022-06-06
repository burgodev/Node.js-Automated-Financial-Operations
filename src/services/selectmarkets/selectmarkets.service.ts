import APIError from "../../errors/api-error";
import { l } from "../../helpers/general";
import selectAPI from "../../helpers/select-integration";

class SelectMarketsService {

    /*public async synchronizeAccount() {
        const { data } = await selectApi.post(
            "/webhook/botmoney/synchronize-account",
            {
                integration_token: integration_token,
                botmoney_reference: user.user_id,
            }
        );
    }

    public async listOperationsAccount() {

    }*/

    public async startRobot(integration_token: string, account_number: number, robot_id: string, expires_at: Date) {
        const body = {
            integration_token,
            account_number,
            robot_id,
            expires_at
        }

        try {
            const { data } = await selectAPI.post("/webhook/botmoney/start-robot-request", body);   
            return data;
        } catch (err) {
            l("ERROR", "SelectMarkets start robot request failed: ", err);
            throw new APIError("selectmarkets.request_failed");
        }
    }

    public async stopRobot(account_number: number, integration_token: string) {
        const body = {
            account_number,
            integration_token
        }

        try {
            const { data } = await selectAPI.post("/webhook/botmoney/stop-robot-request", body);
            return data;
        } catch (err) {
            l("ERROR", "SelectMarkets stop robot request failed: ", err);
            throw new APIError("selectmarkets.request_failed");
        }
    }

}

export default SelectMarketsService;