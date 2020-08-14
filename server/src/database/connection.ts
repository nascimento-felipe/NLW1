import knex from 'knex';
import path from 'path';

const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite'),
    },
    useNullAsDefault: true,
});

export default connection;

// Migrations = Histórico do banco de dados

// você na sua máquina: create table points
// seu amigo na máquina dele: create table users
// coloca um comando e bum
// os dois tem as duas tabelas