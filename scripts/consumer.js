import dotenv from 'dotenv';
import axios from 'axios';
import { ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { createDatabaseConnection } from '../src/config/mongodb.js';
import { sqsClient, queueUrl } from '../src/config/sqs.js';
import { Cep } from '../src/models/cep.model.js';

dotenv.config({ path: './.env' });

createDatabaseConnection();

const processMessages = async () => {
    try {
        const params = {
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 20
        };

        const command = new ReceiveMessageCommand(params);
        const response = await sqsClient.send(command);

        if (!response.Messages || response.Messages.length === 0) {
            return;
        }

        for (const message of response.Messages) {
            const { id } = JSON.parse(message.Body);

            try {
                console.log(`Processando mensagem com ID: ${id}`);

                const cepData = await Cep.findOne({ _id: id });

                const response = await axios.get(`https://viacep.com.br/ws/${cepData.cep}/json/`);

                const cepResponse = response.data;

                await Cep.findByIdAndUpdate(id, { status: 'PROCESSADO', data: cepResponse });

                const deleteParams = {
                    QueueUrl: queueUrl,
                    ReceiptHandle: message.ReceiptHandle
                };
                const deleteCommand = new DeleteMessageCommand(deleteParams);
                await sqsClient.send(deleteCommand);

                console.log(`Mensagem com ID ${id} processada e excluída da fila.`);
            } catch (err) {
                await Cep.findByIdAndUpdate(id, { status: 'REJEITADO' });
            }
        }
    } catch (err) {
        console.error('Erro ao receber mensagens da fila:', err);
    }
};

setInterval(processMessages, 2000);
