import express from 'express';
import routes from './routes';
import path from 'path';
import cors from 'cors';


const app = express();

app.use(cors());
app.use(express.json()); // Understands our request as JSON
app.use(routes);
app.use('uploads',express.static(path.resolve(__dirname, '..', 'uploads'))); // Express function for static files like images, pdf, doc etc! When using path each ',' is like a '/'


app.listen(3333);
// Concepts
// Routes: Complete URL from request (Ex: https://localhost:3333/users)
// Resource: Which entity we are accessing from the system (Ex: /users)

// HTTP Methods:
// GET > Collect 1 or more info from server
// POST > Create a new information in the server (normally we send data here)
// PUT > Update a new information in the server
// DELETE > Delete 1 or more information from the server

/* Examples

POST https://localhost:3333/users >>> Create new user 
GET https://localhost:3333/users >>> Get all users
GET https://localhost:3333/users/id=5 >>> Get info about 1 specific user
*/

// Request Params >> Parameters whose are written in the route like the "id" below. They are commonly used when we need to retrieve data from a specific user. Normally they are mandatory
// Query Params >>  Route parameter that are normally they are not mandatory and they are used for filtering data and pagination
// Body Params >> Body of the request. They are parameters for creation and update of some request. Example: Retrieve user information from fill up form


