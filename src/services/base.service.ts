export default class BaseService<Repository> {

    protected repository: Repository;

    constructor(private repo: Repository) {
        this.repository = repo;
    }

}