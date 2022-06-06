import APIError from '../errors/api-error';
import { ISignInRepository } from '../types/sign-in';
import { IUser } from '../types/user';
import BaseRepository from './base-repository';

class SignInRepository extends BaseRepository implements ISignInRepository {

    constructor() {
        super();
        this.setClient(this.prisma.user);
    }

    public async findByEmail(email: string): Promise<Partial<IUser> | null> {
        try {
            const user = await this.client.findFirst({
                where: {
                    email
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password_hash: true,
                }
            });

            return user
        } catch (err: any) {
            throw new APIError(err.message);
        }
    }
}

export default SignInRepository;