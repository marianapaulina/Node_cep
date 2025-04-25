import mongoose from "mongoose";

export const createDatabaseConnection = () => {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'Erro de conexão com MongoDB:'));
    db.once('open', () => console.log('Produtor conectado ao MongoDB'));

    return db;
}