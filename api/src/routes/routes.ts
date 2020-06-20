import express from 'express';
import ItensController from '../controllers/itens-controller';

const routes = express.Router();
const controller = new ItensController();

routes.get('/itens', controller.get);


export default routes;