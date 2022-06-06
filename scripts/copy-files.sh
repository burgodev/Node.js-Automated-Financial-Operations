mkdir -p ./dist/src/services/email/templates
cp -r ./src/services/email/templates/. ./dist/src/services/email/templates
mkdir -p ./dist/src/i18n
cp -r ./src/i18n/. ./dist/src/i18n
cp ./prisma/schema.prisma ./dist/prisma/schema.prisma