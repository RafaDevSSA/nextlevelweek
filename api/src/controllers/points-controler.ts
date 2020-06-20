import service from '../services/points-service';
import { Request, Response } from 'express';

class PointsController {

    post = async (req: Request, res: Response) => {
        const {
            name, email, whatsapp, latitude, longitude, city, uf, itens
        } = req.body;

        const image = req.file.filename;

        const itensArr = itens.split(',')
            .map((i: string) => Number(i.trim()));

        const result = await service.post({
            image, name, email, whatsapp, latitude, longitude, city, uf
        }, itensArr);

        return res.json(result);
    }

    index = async (req: Request, res: Response) => {
        const { city, uf, itens } = req.query;
        const parsedItens = String(itens).split(',').map(i => Number(i.trim()));

        const points = await service.index(city, uf, parsedItens);

        if (!points || points.length === 0) {
            return res.status(400).send('No Point Found');
        } else {
            res.json(points);
        }
    }

    getById = async (req: Request, res: Response) => {
        const point = await service.getById(Number(req.params.id));
        if (!point) {
            return res.status(400).send('No Point Found');
        } else {
            console.log(point);
            res.json(point);
        }
    }

}

export default PointsController;