type App = {
    [k: string]: any;
};

const allowed_origins = process.env.ALLOWED_ORIGINS || "";

export const app: App = {
    port: process.env.PORT || 3001,
    env: process.env.STAGE || "hml",
    cors_config: {
        origin:
            allowed_origins == ""
                ? allowed_origins
                : JSON.parse(allowed_origins),
    },
};

export const asaas_url = {
    createCustomer: `${process.env.TOKENAPIASAASDEV}/customers`,
};

export const auth_config = {
    jwt: {
        secret: "c10-923;1231p2931290308ujed9912831ç",
        expiresIn: "1d",
    },
};
