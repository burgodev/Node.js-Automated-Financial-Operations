import axios from "axios";

export const asaasApi = axios.create({
    baseURL: "https://sandbox.asaas.com/api/v3/",
    headers: {
        access_token:
            "b1d09488e8670f4cc5e8dbefefe295d8dcfb3b3b4cafea5152c5f7dd8d4627cc",
        "Content-Type": "application/json",
    },
});

// * Next gateways api below
