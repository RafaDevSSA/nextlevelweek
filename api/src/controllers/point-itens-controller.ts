import service from '../services/point-itens-service';

class PointItensController {
    post = async (objs: object[]) => {
        return await service.post(objs)
    }
}