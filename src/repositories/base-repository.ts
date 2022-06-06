import { PrismaClient } from '@prisma/client';

export default class BaseRepository {
    protected prisma;
    protected client: any;

    protected select_arguments = {};
    protected where_not_deleted = {
        // deleted_at: null
    };

    constructor() {
        this.prisma = new PrismaClient();
    }

    protected setClient(client: unknown): void {
        this.client = client;
    }

}