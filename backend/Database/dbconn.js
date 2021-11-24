const { Pool } = require("pg");
require("dotenv").config({path:'../.env'});

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "engage",
  password: "shruti",
  port: 5432,
  //max: process.env.POOL_CONNECTION,
  idleTimeoutMillis: 1,
  connectionTimeoutMillis: 0,
});
// console.log(pool);
module.exports = pool;
