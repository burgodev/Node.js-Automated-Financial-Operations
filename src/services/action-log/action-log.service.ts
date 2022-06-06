import ActionLogRepository from "../../repositories/action-log-repository";
import { IActionLogCreateRepository } from "../../types/action-log";

class ActionLogService {
    private actionLogRepository: ActionLogRepository;

    constructor(actionLogRepository: ActionLogRepository) {
        this.actionLogRepository = actionLogRepository;
    }

    public async create(ip: string, user_id: string, device_id: string) {
        const new_action_log: IActionLogCreateRepository = {
            ip,
            datetime: new Date(),
            action: "LOGIN",
            user_id,
            device_id,
        };
        const action_log = await this.actionLogRepository.create(
            new_action_log
        );

        return action_log;
    }

    public async list(user_id: string) {
        const action_log = this.actionLogRepository.list(user_id);

        return action_log;
    }
}

export default ActionLogService;
