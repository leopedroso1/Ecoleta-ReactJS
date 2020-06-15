import express from 'express';
import multer from 'multer'; //upload library
import multerConfig from './config/multer'; // configuration
import PointsController from './Controllers/PointsController';
import ItemsController from './Controllers/ItemsController';

const routes = express.Router(); // Export our routes
const upload = multer(multerConfig); // Upload engine

const pointsController = new PointsController();
const itemsController = new ItemsController();

// Routes
// We are using less coulped routing by using Controllers classes.
// Normally our methods must be called: index, show, create, update, delete
routes.get('/items', itemsController.index);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);


routes.post('/points', upload.single('image'), pointsController.create); // we pass the upload before calling the route and set as a parameter the name of atribute in our route that will receive the image 
// important! the .singe is just one file that can be uploaded!!!
// important 2: JSON do not support uploading. We will need to use form-data for this (multipart option from insomnia)

export default routes;