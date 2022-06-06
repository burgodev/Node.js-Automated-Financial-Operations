import UserRepository from "../../repositories/user-repository";
import { hash, genSaltSync } from "bcrypt";
import { IUserService, IUser } from "../../types/user";
import CrudService from "../crud.service";
import ValidationError from "../../errors/validation-error";
import { l } from "../../helpers/general";

class UserService
    extends CrudService<IUser, UserRepository>
    implements IUserService
{
    constructor() {
        super(new UserRepository());
    }

    private async hashPassword(password: string): Promise<string> {
        return await hash(password, genSaltSync(10));
    }

    public async create(data: IUser): Promise<Partial<IUser>> {
        if (data.password !== data.confirm_password) {
            throw new ValidationError("VALIDATIONS.PASSWORDS_DIFFERS");
        }

        l("INFO", "trying to create user", data);

        const password_hashed = await this.hashPassword(
            data.password as string
        );

        data.password_hash = await Promise.resolve(password_hashed);

        const user = await this.repository.create({
            name: data.name,
            email: data.email,
            password_hash: data.password_hash,
            birthday: data.birthday,
            phone: data.phone,
            ddi: data.ddi,
            nationality_id: data.nationality_id,
        });

        l("INFO", "create user", user);

        return user;
    }

    public async findById(id: string): Promise<Partial<IUser>> {
        return this.repository.findById(id);
    }

    public async findByEmail(
        email: string,
        args = {}
    ): Promise<Partial<IUser>> {
        return this.repository.findByEmail(email, args);
    }

    public async changePassword(
        user_id: string,
        password: string
    ): Promise<void> {
        const password_hashed = await this.hashPassword(password);
        await this.repository.changePassword(user_id, password_hashed);
    }

    public async findUserNationality(email: string) {
        const user_nationality = await this.repository.findUserNationality(
            email
        );

        return user_nationality;
    }
}

export default UserService;
