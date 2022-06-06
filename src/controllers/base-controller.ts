class BaseController<TService> {

    protected service: TService

    constructor(protected serv: TService) {
        this.service = serv;
    }

}

export default BaseController;