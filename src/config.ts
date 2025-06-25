import dotenv from 'dotenv';
dotenv.config();

const JWT_PASSWORD = process.env.JWT_PASSWORD;

export {
    JWT_PASSWORD
};