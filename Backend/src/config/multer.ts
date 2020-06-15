import multer from 'multer';
import path from 'path'; // native dependency from Node.js
import crypto from 'crypto';

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'), // where the files will be stored

        // This function will handle the user file. We are implementing to prevent duplicate files
        filename(request, file, callback) { // request >> infos from front end , file >> infos from file uploded, callback function -> to be executed after filename function

            const hash = crypto.randomBytes(6).toString('hex'); // 6 bytes random characters

            const fileName = `${hash}-${file.originalname}`; // final file name = hash + filename

            callback(null, fileName); //if error, and then the return
        }
    })
};