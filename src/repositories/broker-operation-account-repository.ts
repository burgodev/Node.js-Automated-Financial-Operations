import { PrismaClient } from "@prisma/client";

class brokerOperatonAccountRepository {
  private prisma;
  private client;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.client = prisma.brokerOperationAccount;
  }

  public async getByBrokerNumber(broker_number: number) {
    const result = await this.client.findFirst({
      where: {
        number: broker_number,
      },
      select: {
        id: true,
      },
    });

    return result;
  }

  public async updateSubscriptionId(
    broker_account_id: string,
    subscription_id: string
  ) {
    const result = await this.client.update({
      where: {
        id: broker_account_id,
      },
      data: {
        subscription_id,
      },
    });
    return result;
  }
}

export default brokerOperatonAccountRepository;
