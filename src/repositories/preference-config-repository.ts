// import { IPreferenceConfig } from "../types/preference-config";
import BaseRepository from "./base-repository";

export default class PreferenceConfigRepository extends BaseRepository {

    protected select_arguments = {
        id: true,
        user_id: true,
        language: true,
        theme: true,
        anti_fishing_argument: true,
    };

    constructor() {
        super();
        this.setClient(this.prisma.preferencesConfig);
    }

    public async getLang(user_id: string): Promise<string> {
        const pref = await this.client.findFirst({
            where: {
                user_id: user_id,
            }, 
            select: {
                language: true,
            }
        });

        return pref?.language || 'pt';
    }

}