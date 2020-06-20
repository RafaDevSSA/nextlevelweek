import conect from '../database/conection';

class ItensService {
    get = async () => {
        return await conect('itens').select('*');
    }

    getById = async (ids: number[]) => {
        const itens = await conect('itens')
            .whereIn('itens.id', ids)
            .select('itens.title')
        return itens
    }
}

export default new ItensService();