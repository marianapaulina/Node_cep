import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import express from 'express';
// import mongoose from 'mongoose';
// import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { createDatabaseConnection } from "./src/config/mongodb.js";
import { router } from "./src/routes.js";

createDatabaseConnection();
console.log(process.env)

const app = express();
app.use(express.json());
app.use(router)

app.listen(process.env.PORT || 3000, () => {
    console.log(`Produtor rodando na porta 3000`);
});