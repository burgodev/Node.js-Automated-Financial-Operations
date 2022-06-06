import i18next from "i18next";
import PreferenceConfigRepository from "../repositories/preference-config-repository";

export const setLang = async (lang: string): Promise<void> => {
    await i18next.changeLanguage(lang);
}

export const translateExists = async (key: string | string[]): Promise<boolean> => {
    return await i18next.exists(key);
}

export const t = (key: string): string => {
    return i18next.t(key);
}

export const setLangFromDB = async (user_id: string): Promise<void> => {
    const lang = await (new PreferenceConfigRepository()).getLang(user_id);
    setLang(lang);
}