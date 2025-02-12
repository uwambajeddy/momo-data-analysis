const dotenv = require("dotenv");
dotenv.config();

const {
 PRODUCTION_DATABASE,
 DEV_DATABASE,
 DATABASE_USER,
 DATABASE_PASSWORD,
 DATABASE_HOST,
 DATABASE_PORT,
} = process.env;


module.exports = {
 development: {
  username: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DEV_DATABASE,
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  dialect: "postgres",
 },
 production: {
  username: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: PRODUCTION_DATABASE,
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  logging: false,
  protocol: "postgres",
  dialect: "postgres",
  dialectOptions: {
   ssl: {
    require: true,
    rejectUnauthorized: false,
   },
  },
 },
};
