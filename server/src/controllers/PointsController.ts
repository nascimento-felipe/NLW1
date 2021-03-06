import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {

    async index(request: Request, response: Response) {
        //filtro de cidade, uf, items
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));

        const points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*');

        return response.json(points);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({ message: 'Point not found.' })
        }

        /*
            SELECT * FROM items
            JOIN point_items ON items.id = point_items.item_id
            WHERE point_items.point_id = {id}
        */

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({ point, items })
    }

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body

        const trx = await knex.transaction(); //variável que faz o cancelamento do processo de inserção no bdd se algum dos inserts der errado, já que os egundo precisa do primeiro para funcionar.

        const point = {
            image: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];

        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id,
            };
        })

        await trx('point_items').insert(pointItems);

        await trx.commit(); //faz o insert se tudo tiver ido certo :)

        return response.json({
            id: point_id,
            ...point,
        });
    }

}

export default PointsController;