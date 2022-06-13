
const { PrismaClient } = require("@prisma/client")

const User = new PrismaClient().users

module.exports = User