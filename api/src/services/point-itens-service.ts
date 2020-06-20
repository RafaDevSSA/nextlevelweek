import conect from '../database/conection';

class PointItensService {
    post = async (objs: object[]) => {
        return await conect('point_itens').insert(objs);
    }
}

export default new PointItensService();