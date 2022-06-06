import { generateUUID } from "../../helpers/general";
import PasswordRecoveryRepository from "../../repositories/password-recovery-repository";
import { IUser } from "../../types/user";
import EmailService from "../email/email.service";

class PasswordRecoveryService {

    private email_service: EmailService;
    private repository: PasswordRecoveryRepository;

    constructor() {
        this.email_service = new EmailService();
        this.repository = new PasswordRecoveryRepository();
    }

    private async sendEmail(user: IUser, token: string): Promise<boolean> {
        const url = `${process.env.APP_URL}/auth/password-recovery/${token}`;

        return await this.email_service.send({
            destination: user.name ? {
                name: user.name,
                email: user.email,
            } : user.email,
            subject: 'BotMoney - Password recovery',
            text: `${user.name}, you requested password recovery on our system. To be able to make the exchange, access the link below and reset your password. (${url})`,
            html: {
                path: 'password-recovery.html',
                args: {
                    url: url,
                    email_password_recovery_title: {
                        translate: "auth.password.recovery.title",
                        args: {
                            user_name: user.name as string,
                        }
                    },
                    password_recovery_bt: {
                        translate: 'auth.password.recovery.bt'
                    }
                },
            },
        });
    }

    public async hasRequestedInLastMinutes(user_id: string, minutes = 5): Promise<boolean> {
        return await this.repository.hasRequestedInLastMinutes(user_id, minutes);
    }

    public async create(user: IUser): Promise<boolean> {
        const token = generateUUID();
        const now = new Date();

        const password_recovery = this.repository.create({
            user_id: user.id,
            token,
            expires_at: new Date(now.setMinutes(now.getMinutes() + 30)),
        });

        if (password_recovery == null) throw new Error('Something is wrong');

        return await this.sendEmail(user, token);
    }

    public async validateToken(token: string): Promise<string> {
        const user_id = await this.repository.tokenIsValid(token);

        if (user_id) {
            await this.repository.invalidateToken(token);
        }

        return user_id;        
    }

}

export default PasswordRecoveryService;