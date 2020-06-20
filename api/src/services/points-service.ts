import conect from '../database/conection';

class PointsService {
    post = async (point: any, itens: []) => {
        const trx = await conect.transaction();
        try {
            const insertedId = await trx('points').insert(point);
            console.log(insertedId);
            if (insertedId) {
                const objitens = itens.map((i: any) => {
                    return {
                        point_id: insertedId[0],
                        item_id: i
                    }
                })
                await trx('point_itens').insert(objitens);
                trx.commit();
            }
            return {
                status: true, result: {
                    id: insertedId[0],
                    ...point
                }
            };
        } catch (error) {
            trx.rollback();
            console.log(error);
            return { status: false, err: error };
        }

    }

    index = async (city: any, uf: any, itens: number[]) => {
        console.log(city, uf, itens);
        const points = await conect('points')
            .join('point_itens', 'point_itens.point_id', '=', 'points.id')
            .whereIn('point_itens.item_id', itens)
            .where('points.city', city)
            .where('points.uf', uf).select('points.*').distinct();

        const pointsSerializeds = points.map(p => {
            return {
                ...p,
                image: `http://192.168.1.82:3333/uploads/${p.image}`
            }
        });
        return pointsSerializeds
    }

    getById = async (id: number) => {
        let point = await conect('points').select('*').where('id', id).first();
        const itens = await conect('itens').join('point_itens', 'point_itens.item_id', '=', 'itens.id').where('point_itens.point_id', id);
        point.image = `http://192.168.1.82:3333/uploads/${point.image}`;
        return { point, itens };
    }

}

export default new PointsService();