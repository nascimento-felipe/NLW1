// rotas do app

import express from 'express';
import knex from './database/connection';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const itemsController = new ItemsController();
const pointsController = new PointsController();
const routes = express.Router();

routes.get('/items', itemsController.index);

routes.post('/points', pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);


//index (listagem), show (mostrar um registro só), create (criação), update, delete

export default routes;