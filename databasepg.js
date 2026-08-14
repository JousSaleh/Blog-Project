
const { Pool } = require('pg');

const pool =new Pool({
host:"localhost",
user:"postgres",
port: 5432,
password: "Joud12341234",
database: "Blog"


})

module.exports= pool;