import express from 'express';
import PointsController from '../controllers/points-controler';
import multer from 'multer';
import multerConfig from '../config/multer';

const upload = multer({ storage: multerConfig });

const routes = express.Router();
const controler = new PointsController();

routes.post('/', upload.single('file'), controler.post);


routes.get('/', controler.index);
routes.get('/:id', controler.getById);

export default routes;