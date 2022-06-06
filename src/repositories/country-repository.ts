import { PrismaClient } from "@prisma/client";

class CountryRepository {
    private prisma: PrismaClient;
    private select_arguments = {
        iso_code: true,
        name: true,
        ddi: true,
        is_supported_as_location: true,
    };

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async list() {
        const countries = await this.prisma.country.findMany({
            select: this.select_arguments,
            orderBy: {
                name: "asc",
            },
        });

        return countries;
    }

    public async getById(iso_code: string) {
        const country = await this.prisma.country.findFirst({
            where: {
                iso_code,
            },
        });

        return country;
    }
}

export default CountryRepository;
