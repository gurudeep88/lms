require('dotenv').config();
import { v2 } from 'cloudinary';
import { app } from './app';
import { PORT } from './config/port.config';
import connectDB from './database/mongo';
import { ErrorMiddleware } from './middleware/ErrorMiddleware';
import { CLOUD_API_KEY, CLOUD_NAME, CLOUD_SECRET_KEY } from './config';

// cloudinary config
v2.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_SECRET_KEY
})

// create server
app.listen(PORT, () => {
    console.log( `Server is connected with port ${PORT}` );
    connectDB();
})

app.use(ErrorMiddleware);