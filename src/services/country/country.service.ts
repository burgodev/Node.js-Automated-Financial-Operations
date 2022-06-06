import CountryRepository from "../../repositories/country-repository";

class CountryService {
    private countryRepository: CountryRepository;

    constructor(countryRepository: CountryRepository) {
        this.countryRepository = countryRepository;
    }

    public async list() {
        const countries = await this.countryRepository.list();

        return countries;
    }

    public async getById(iso_code: string) {
        const country = await this.countryRepository.getById(iso_code);
        return country;
    }
}

export default CountryService;
