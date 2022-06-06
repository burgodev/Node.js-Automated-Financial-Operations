import APIError from '../errors/api-error';
import NotFoundError from '../errors/not-found-error';
import { ICrudRepository, ICrudService } from '../types/crud';
import BaseService from './base.service';

export default class CrudService<ICrud, Repository extends ICrudRepository<ICrud>> extends BaseService<Repository> implements ICrudService<ICrud> {

    public async create(data: ICrud): Promise<Partial<ICrud>> {
        throw new APIError('Not implemented');
    }

    public async list(): Promise<Partial<ICrud>[]> {
        return this.repository.list();
    }

    public async update(id: string, data: Partial<ICrud>): Promise<Partial<ICrud>> {
        let obj = await this.repository.findById(id);

        if (obj) {
            obj = await this.repository.update(id, data);

            return obj;
        } else {
            throw new NotFoundError('User not found');
        }
    }

    public async findById(id: string): Promise<Partial<ICrud>> {
        const obj = await this.repository.findById(id);

        if (obj) {
            return obj;
        } else {
            throw new NotFoundError('User not found');
        }
    }

    public async delete(id: string): Promise<unknown> {
        const obj = await this.repository.findById(id);

        if (obj) {
            return await this.repository.delete(id);
        } else {
            throw new NotFoundError('User not found');
        }

    }
    
}