const { PrismaClient } = require("@prisma/client");

let prisma;
prisma = new PrismaClient();

exports.prisma = prisma;
