-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT', 'SUPPORT');

-- CreateEnum
CREATE TYPE "theme" AS ENUM ('STANDARD');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('PORTUGUESE', 'ENGLISH');

-- CreateEnum
CREATE TYPE "OperationAccountType" AS ENUM ('REAL', 'DEMO');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('FIXED', 'VARIABLE', 'PROFIT', 'BALANCE', 'DEMO');

-- CreateEnum
CREATE TYPE "financial_situacion" AS ENUM ('REGULAR', 'IRREGULAR');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('DESKTOP', 'MOBILE', 'TABLET');

-- CreateEnum
CREATE TYPE "action_type" AS ENUM ('LOGIN', 'LOGOFF', 'ACCOUNT_REGISTRATION', 'PASSWORD_RECOVERY', 'EMAIL_SENT');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "birthday" TEXT,
    "phone" TEXT,
    "ddi" TEXT,
    "document" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deactivated_at" TIMESTAMP(3),
    "nationality_id" UUID,
    "location_id" UUID,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL,
    "cep" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country_id" UUID NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "is_main_address" BOOLEAN NOT NULL DEFAULT false,
    "complement" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "user_id" UUID NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "ddi" TEXT,
    "is_supported_as_location" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_roles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "users_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preferences_configs" (
    "id" UUID NOT NULL,
    "language" "Language" NOT NULL DEFAULT E'PORTUGUESE',
    "theme" "theme" NOT NULL DEFAULT E'STANDARD',
    "anti_fishing_argument" TEXT,
    "user_id" UUID NOT NULL,

    CONSTRAINT "preferences_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "subject_key" TEXT NOT NULL,
    "subject_args" JSONB NOT NULL,
    "text_key" TEXT NOT NULL,
    "text_args" JSONB NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" UUID NOT NULL,
    "html" TEXT NOT NULL DEFAULT E'',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "activation_starts_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activation_ends_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements_roles" (
    "id" UUID NOT NULL,
    "announcement_id" UUID NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "announcements_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements_users" (
    "id" UUID NOT NULL,
    "is_checked" BOOLEAN NOT NULL DEFAULT false,
    "datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "announcement_id" UUID NOT NULL,

    CONSTRAINT "announcements_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acceptance_terms_history" (
    "id" UUID NOT NULL,
    "is_accepted" BOOLEAN NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "acceptance_term_id" UUID NOT NULL,

    CONSTRAINT "acceptance_terms_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acceptance_terms" (
    "id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expiry_date" TIMESTAMP(3),
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT NOT NULL,
    "deactivated_at" TIMESTAMP(3),

    CONSTRAINT "acceptance_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brokers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "brokers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "broker_accounts" (
    "id" UUID NOT NULL,
    "balance" DECIMAL(65,30),
    "external_broker_account_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "user_id" UUID NOT NULL,
    "broker_id" UUID NOT NULL,

    CONSTRAINT "broker_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "broker_operation_accounts" (
    "id" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "OperationAccountType" NOT NULL DEFAULT E'DEMO',
    "balance_total" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "broker_account_id" UUID NOT NULL,
    "subscription_id" UUID,

    CONSTRAINT "broker_operation_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operations_history" (
    "id" UUID NOT NULL,
    "broker_operation_account_id" UUID NOT NULL,

    CONSTRAINT "operations_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "start_date" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "is_active" BOOLEAN,
    "is_simulation" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "payment_config_id" UUID,
    "subscription_plan_id" UUID NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_costs_history" (
    "id" UUID NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "paid_at" TIMESTAMP(3),
    "start_validity" TIMESTAMP(3),
    "end_validity" TIMESTAMP(3),
    "subscription_id" UUID NOT NULL,
    "charge_id" UUID NOT NULL,

    CONSTRAINT "subscription_costs_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charges_history" (
    "id" UUID NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "paid_at" TIMESTAMP(3),
    "gateway_charge_id" TEXT,
    "error_code" TEXT,
    "user_id" UUID NOT NULL,
    "payment_config_id" UUID NOT NULL,

    CONSTRAINT "charges_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_payments_configs" (
    "id" UUID NOT NULL,
    "payment_external_reference" TEXT NOT NULL,
    "payment_card_id" UUID,
    "customer_gateway_id" UUID NOT NULL,

    CONSTRAINT "subscription_payments_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trader_robots" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "trader_robots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SubscriptionType" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "validity_start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validity_end" TIMESTAMP(3),
    "price" DOUBLE PRECISION NOT NULL,
    "minimum_months_of_subscription" INTEGER,
    "maximum_months_of_advance_payment" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "trader_robot_id" UUID NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_cards" (
    "id" UUID NOT NULL,
    "cardholder" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "expiry_month" TEXT NOT NULL,
    "expiry_year" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "address_id" UUID NOT NULL,

    CONSTRAINT "payment_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_gateways" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "payment_gateways_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_gateway_infos" (
    "id" UUID NOT NULL,
    "customer_id" TEXT NOT NULL,
    "payment_gateway_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "customer_gateway_infos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_types" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "payment_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" UUID NOT NULL,
    "recurrent_on_gateway" BOOLEAN NOT NULL DEFAULT true,
    "payment_type_id" UUID NOT NULL,
    "payment_gateway_id" UUID NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" UUID NOT NULL,
    "mac_address" TEXT NOT NULL,
    "type" "DeviceType" NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actions_logs" (
    "id" UUID NOT NULL,
    "ip" TEXT NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "action" "action_type" NOT NULL,
    "device_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "actions_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_recoveries" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_valid" BOOLEAN NOT NULL DEFAULT true,
    "token" TEXT NOT NULL,

    CONSTRAINT "password_recoveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "preferences_configs_user_id_key" ON "preferences_configs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "brokers_name_key" ON "brokers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "broker_accounts_external_broker_account_id_key" ON "broker_accounts"("external_broker_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "broker_operation_accounts_number_key" ON "broker_operation_accounts"("number");

-- CreateIndex
CREATE UNIQUE INDEX "broker_operation_accounts_subscription_id_key" ON "broker_operation_accounts"("subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_payment_config_id_key" ON "subscriptions"("payment_config_id");

-- CreateIndex
CREATE UNIQUE INDEX "charges_history_gateway_charge_id_key" ON "charges_history"("gateway_charge_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_types_name_key" ON "payment_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "password_recoveries_token_key" ON "password_recoveries"("token");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_nationality_id_fkey" FOREIGN KEY ("nationality_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preferences_configs" ADD CONSTRAINT "preferences_configs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements_roles" ADD CONSTRAINT "announcements_roles_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements_users" ADD CONSTRAINT "announcements_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements_users" ADD CONSTRAINT "announcements_users_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acceptance_terms_history" ADD CONSTRAINT "acceptance_terms_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acceptance_terms_history" ADD CONSTRAINT "acceptance_terms_history_acceptance_term_id_fkey" FOREIGN KEY ("acceptance_term_id") REFERENCES "acceptance_terms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broker_accounts" ADD CONSTRAINT "broker_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broker_accounts" ADD CONSTRAINT "broker_accounts_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "brokers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broker_operation_accounts" ADD CONSTRAINT "broker_operation_accounts_broker_account_id_fkey" FOREIGN KEY ("broker_account_id") REFERENCES "broker_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broker_operation_accounts" ADD CONSTRAINT "broker_operation_accounts_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations_history" ADD CONSTRAINT "operations_history_broker_operation_account_id_fkey" FOREIGN KEY ("broker_operation_account_id") REFERENCES "broker_operation_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_payment_config_id_fkey" FOREIGN KEY ("payment_config_id") REFERENCES "subscription_payments_configs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_subscription_plan_id_fkey" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_costs_history" ADD CONSTRAINT "subscription_costs_history_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_costs_history" ADD CONSTRAINT "subscription_costs_history_charge_id_fkey" FOREIGN KEY ("charge_id") REFERENCES "charges_history"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charges_history" ADD CONSTRAINT "charges_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charges_history" ADD CONSTRAINT "charges_history_payment_config_id_fkey" FOREIGN KEY ("payment_config_id") REFERENCES "subscription_payments_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_payments_configs" ADD CONSTRAINT "subscription_payments_configs_payment_card_id_fkey" FOREIGN KEY ("payment_card_id") REFERENCES "payment_cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_payments_configs" ADD CONSTRAINT "subscription_payments_configs_customer_gateway_id_fkey" FOREIGN KEY ("customer_gateway_id") REFERENCES "customer_gateway_infos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_plans" ADD CONSTRAINT "subscription_plans_trader_robot_id_fkey" FOREIGN KEY ("trader_robot_id") REFERENCES "trader_robots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_cards" ADD CONSTRAINT "payment_cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_cards" ADD CONSTRAINT "payment_cards_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_gateway_infos" ADD CONSTRAINT "customer_gateway_infos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_gateway_infos" ADD CONSTRAINT "customer_gateway_infos_payment_gateway_id_fkey" FOREIGN KEY ("payment_gateway_id") REFERENCES "payment_gateways"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_payment_gateway_id_fkey" FOREIGN KEY ("payment_gateway_id") REFERENCES "payment_gateways"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_payment_type_id_fkey" FOREIGN KEY ("payment_type_id") REFERENCES "payment_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions_logs" ADD CONSTRAINT "actions_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions_logs" ADD CONSTRAINT "actions_logs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_recoveries" ADD CONSTRAINT "password_recoveries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
