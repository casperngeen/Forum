// handles all DB queries with postgreSQL

// pool: a connection pool is a cache of db connections that are reused (everytime the application needs to make a db query, it will request a connection from the pool)
import { Pool } from "pg";

const poolConfig = {
    database:process.env.PGUDATABASE,
    host:process.env.PGHOST,
    user: process.env.PGUSER,
    password:process.env.PGPASSWORD,
    port: 5432,
    connectionTimeoutMillis: 2000 
}

const pool = new Pool(poolConfig);

module.exports = pool;