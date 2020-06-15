import knex from '../database/connection';
import {Request, Response} from 'express'; // Adapt for typescript

class PointsController {

    async index(request: Request, response: Response){

        const {city, uf, items} = request.query; //Query params!! Remember --> Request Params: algo na rota obrigatório / Body: Criação e edição de algo / Query: filtros! 

        const parsedItems = String(items).split(',').map(item => Number(item.trim())); // transform in an array of nu,ber

        const points = await knex('points')
                      .join('point_items', 'points.id', '=', '´point_items.id')
                      .whereIn('point_items.item_id', parsedItems)
                      .where('city', String(city))
                      .where('uf',String(uf))
                      .distinct()
                      .select('points.*');

        const serializedPoints = points.map(point => {
            return {
                ...point,        //Automate the image_url IP after        
                image_url: `http://192.168.1.12:3333/uploads/${point.image}`,
            }
        });

        return response.json(serializedPoints);

    }


    async show(request: Request, response: Response){ 

        const {id} = request.params; //destructuring!!

        const point = await knex('points').where('id', id).first(); // Return only one element

        // Error handler
        if(!point) {
            return response.status(400).json({message:'Point not found'});
        }

        const serializedPoint = {
                ...point,        //Automate the image_url IP after >> Check your IP or Expo provided add here        
                image_url: `http://192.168.1.12:3333/uploads/${point.image}`,
        };


        const items = await knex('items').join('point_items', 'items.id', '=', 'point_items.item_id').where('point_items.point_id', id);

        return response.json({point: serializedPoint, items});        
    }

    async create(request: Request, response: Response){ // Adapt for typescript

        const {name, email, whatsapp, lat, lon, city, uf, items} = request.body; //destructuring!

        // Knex transaction controller >> Establish a full roll-back if any insert goes wrong! 
        const trx = await knex.transaction();
    
        const point = {image: request.file.filename, name, email, whatsapp, lat, lon, city, uf};

        // o Knex sempre retorna o Id do que foi inserido
        const insertedIds = await trx('points').insert(point);
    
        const pointItems = items.split(',')
                                .map((item: string) => Number(item.trim()))
                                .map((itemId: number) => {
    
            return {itemId, point_id: insertedIds[0]};
    
        })
    
        await trx('point_items').insert(pointItems);
    
        await trx.commit(); // Finally inserts in the database

        return response.json({
            id: insertedIds[0],
            ...point,
            
        });

    }

}


export default PointsController;