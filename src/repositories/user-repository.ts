//import { IUserRepository, IUser } from "../types/user";
import APIError from "../errors/api-error";
import { IUser, IUserRepository } from "../types/user";
import CrudRepository from "./crud-repository";

class UserRepository extends CrudRepository<IUser> implements IUserRepository {
    protected select_arguments = {
        id: true,
        name: true,
        email: true,
        birthday: true,
        phone: true,
        ddi: true,
        document: true,
        nationality_id: true,
        address: {
            select: {
                street: true,
                number: true,
                neighborhood: true,
                complement: true,
                cep: true,
                state: true,
                city: true,
                country_id: true,
            },
        },
    };

    constructor() {
        super();
        this.setClient(this.prisma.user);
    }

    public async findById(id: string) {
        try {
            const result = await this.client.findFirst({
                where: {
                    id: id,
                },
                select: this.select_arguments,
            });

            return result;
        } catch (err: any) {
            throw new APIError(err?.message as string);
        }
    }

    public async findByEmail(
        email: string,
        args = {}
    ): Promise<Partial<IUser>> {
        return await this.client.findFirst({
            where: {
                email: email,
                // deleted_at: null
            },
            select: {
                ...this.select_arguments,
                ...args,
            },
        });
    }

    public async changePassword(
        user_id: string,
        password: string
    ): Promise<void> {
        await this.client.update({
            where: {
                id: user_id,
            },
            data: {
                password_hash: password,
            },
        });
    }

    public async findUserNationality(email: string) {
        return await this.client.findFirst({
            where: {
                email,
            },
            select: {
                nationality_id: true,
            },
        });
    }
}

export default UserRepository;
