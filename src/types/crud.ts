export interface ICrud {
    id?: string;
}

export interface ICrudService<T> {
    create(data: T): Promise<Partial<T>>;
    findById(id: string): Promise<Partial<T> | null>;
    update(id: string, data: Partial<T>): Promise<Partial<T>>;
    delete(id: string): Promise<unknown>;
    list(): Promise<Partial<T>[]>;
}

export interface ICrudRepository<T> {
    list(): Promise<Partial<T>[]>;
    update(id: string, data: Partial<T>): Promise<Partial<T>>;
    create(data: T): Promise<Partial<T>>;
    findById(id: string): Promise<Partial<T> | null>;
    delete(id: string): Promise<unknown>;
}