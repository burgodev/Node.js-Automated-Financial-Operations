import { Request, Response } from 'express';
import { ICrudService } from '../types/crud';
import BaseController from './base-controller';

class CrudController<I, TService extends ICrudService<I>> extends BaseController<TService> {

    public async list(request: Request, response: Response): Promise<Response> {
        const data = await this.service.list();
    
        return response.json(data);
      }
    
      public async create(request: Request, response: Response): Promise<Response> {
        const obj = request.body;
    
        const objCreate = await this.service.create(obj);
    
        return response.json(objCreate);
      }
    
      public async findById(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
    
        const obj = await this.service.findById(id);
    
        return response.json(obj)
      }
    
      public async update(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
    
        const data = request.body
    
        const obj = await this.service.update(id, data);
    
        return response.json(obj)
      }
    
      public async destroy(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
    
        const obj = await this.service.delete(id);
    
        return response.json(obj)
      }

}

export default CrudController;