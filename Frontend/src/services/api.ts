// This folder will route our Frontend with Backend
// Axios is a library that will help us. Alternatively, we can use the "fetch" API given the JSON stream.

import axios from 'axios';


const api = axios.create({

    baseURL:'http://localhost:3333' //Base route! We just need to add the routes like a string append
});

export default api;