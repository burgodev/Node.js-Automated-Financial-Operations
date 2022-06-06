import { Prisma, PrismaClient } from "@prisma/client";
import { countries } from "./seed-data/countries";
import { payment_type } from "./seed-data/payment-type";
import { payment_gateway } from "./seed-data/payment-gateway";
import { trader_robot } from "./seed-data/trader-robots";
import { broker } from "./seed-data/broker";
import { subscription_plan } from "./seed-data/subscription-plan";
import { payment_method } from "./seed-data/payment-method";

const prisma = new PrismaClient();

const createCountries = async () => {
    const data: Prisma.CountryCreateInput[] = countries;

    data.forEach(async (c) => {
        await prisma.country.upsert({
            where: {
                iso_code: c.iso_code,
            },
            create: c,
            update: {},
        });
    });
};

const createPaymentType = async () => {
    const data: Prisma.PaymentTypeCreateInput[] = payment_type;

    data.forEach(async (pt) => {
        await prisma.paymentType.upsert({
            where: {
                id: pt.id,
            },
            create: pt,
            update: {},
        });
    });
};

const createPaymentGateway = async () => {
    const data: Prisma.PaymentGatewayCreateInput[] = payment_gateway;

    data.forEach(async (pg) => {
        await prisma.paymentGateway.upsert({
            where: {
                id: pg.id,
            },
            create: pg,
            update: {},
        });
    });
};

const createTraderRobot = async () => {
    const data: Prisma.TraderRobotCreateInput[] = trader_robot;

    data.forEach(async (tr) => {
        await prisma.traderRobot.upsert({
            where: {
                id: tr.id,
            },
            create: tr,
            update: {},
        });
    });
};

const createBroker = async () => {
    const data: Prisma.BrokerCreateInput[] = broker;

    data.forEach(async (bk) => {
        await prisma.broker.upsert({
            where: {
                id: bk.id,
            },
            create: bk,
            update: {},
        });
    });
};

// const createPaymentMethod = async () => {
//     const data = payment_method;

//     data.forEach(async (pm) => {
//         await prisma.paymentMethod.upsert({
//             where: {
//                 id: pm.id,
//             },
//             create: pm,
//             update: {},
//         });
//     });
// };

const createPaymentMethod = async () => {
    const data = payment_method;
    
    data.forEach(async (pm) => {
        await prisma.paymentMethod.upsert({
            where: {
                id: pm.id
            },
            create: pm,
            update: {}
        })
    })
};

const createSubscriptionPlan = async () => {
    const data = subscription_plan;

    data.forEach(async (sp) => {
        await prisma.subscriptionPlan.upsert({
            where: {
                id: sp.id,
            },
            create: sp,
            update: {},
        });
    });
};

async function main() {
    await createCountries();
    await createPaymentType();
    await createPaymentGateway();
    await createTraderRobot();
    await createBroker();
    setTimeout(async () => {
        await createPaymentMethod();
        await createSubscriptionPlan();
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
