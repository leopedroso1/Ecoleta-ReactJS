import knex from '../database/connection';
import {Request, Response} from 'express'; // Adapt for typescript


class ItemsController {
    
    async index (request :Request, response: Response) {

        const items = await knex('items').select('*');
        
        // Serialização: transformar infos que não estão apresentáveis para um mais apresentável ao front
        const serializedItems = items.map(item => {
            return {id: item.id, title: item.name, image_url: `http://192.168.1.12:3333/uploads/${item.image}`}
        }); 
        return response.json(serializedItems);
    
    }
    
}


export default ItemsController;