import service from '../services/itens-service';
import { Request, Response } from 'express';

export default class ItensController {
    get = async (req: Request, res: Response) => {
        const itens = await service.get();
        const serialized = itens.map(i => {
            i.image = `http://localhost:3333/uploads/${i.image}`
            return i;
        });
        res.json(serialized);
    }
}