import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {
  POSTGRES_USER = 'postgres',
  POSTGRES_HOST = 'postgres',
  POSTGRES_DB = 'postgres',
  POSTGRES_PASSWORD = 'password',
  POSTGRES_PORT = '5432',
} = process.env;

console.log('\n==============================');
console.log('   📦 Database Configuration   ');
console.log('==============================');
console.log(`  Host    : ${POSTGRES_HOST}`);
console.log(`  Port    : ${POSTGRES_PORT}`);
console.log(`  User    : ${POSTGRES_USER}`);
console.log(`  DB Name : ${POSTGRES_DB}`);
console.log('==============================\n');

const pool = new Pool({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: Number(POSTGRES_PORT),
});

export default pool;
