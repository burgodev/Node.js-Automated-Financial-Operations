import { Request, Response } from "express";

export default class GatewayController {
    // public async webhook(request: Request, response: Response): Promise<Response> {
    //     let service = null;
    //     switch(request.params.gateway) {
    //         case 'assas': service = new AssasService();
    //             break;
    //         default:
    //             throw new Error('Gateway not supported yet.');
    //     }
    //     service.webhook(request.body);
    //     return response.status(200).json({gateway: request.params.gateway});
    // }
}
