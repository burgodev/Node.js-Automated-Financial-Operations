import APIError from '../errors/api-error';
import { ICrudRepository } from '../types/crud';
import BaseRepository from './base-repository';

export default class CrudRepository<ICrud> extends BaseRepository implements ICrudRepository<ICrud> {

    public async list(aditional_args = {}): Promise<Partial<ICrud>[]> {
        try {
            const data: Partial<ICrud>[] = await this.client.findMany({
                where: this.where_not_deleted,
                select: { ...this.select_arguments, ...aditional_args }
            });

            return data;
        } catch (err: any) {
            throw new APIError(err.message as string);
        }
    }

    public async update(id: string, data: Partial<ICrud>): Promise<Partial<ICrud>> {
        try {
            const obj = await this.client.update({
                where: {
                    id: id
                },
                data,
                select: this.select_arguments
            })

            return obj;
        } catch (err: any) {
            throw new APIError(err?.message as string);
        }
    }

    public async create(data: Partial<ICrud>): Promise<Partial<ICrud>> {
        try {
            const obj = await this.client.create({
                data: data,
                select: this.select_arguments
            })

            return obj;
        } catch (err: any) {
            throw new APIError(err?.message || 'Um erro' as string);
        }
    }

    public async findById(id: string): Promise<Partial<ICrud> | null> {
        try {
            const obj = await this.client.findFirst({
                where: {
                    id: id,
                    // deleted_at: null
                },
                select: this.select_arguments
            })

            return obj;
        } catch (err: any) {
            throw new APIError(err?.message as string);
        }
    }

    public async delete(id: string): Promise<unknown> {
        try {
            await this.client.update({
                where: {
                    id: id
                },
                data: {
                    deleted_at: new Date()
                }
            });
            return {}
        } catch (err: any) {
            throw new APIError(err?.message as string);
        }
    }
}