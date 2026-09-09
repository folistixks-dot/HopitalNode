require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mariadb = require("mariadb");

const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("../generated/prisma/client");

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  connectionLimit: 10,

  ssl: {
    ca: fs.readFileSync(path.join(__dirname, "../certs/ca.pem")),
    rejectUnauthorized: true,
  },
});

const adapter = new PrismaMariaDb(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
