import { Language, Theme } from "@prisma/client";

export interface IPreferenceConfig {
    id: string,
    user_id: string,
    language: Language,
    theme: Theme,
    anti_fishing_argument: string,
}