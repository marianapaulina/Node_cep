import { Cep } from "../models/cep.model.js";
import { sqsClient, queueUrl } from "../config/sqs.js";
import { SendMessageCommand } from "@aws-sdk/client-sqs";

export const storeCepAndAddToQueue = async (req, res) => {
    try {
        const { cep } = req.body;
        if (!cep) {
            return res.status(400).json({ message: 'CEP é obrigatório' });
        }

        const cepModel = new Cep({ cep });
        await cepModel.save();

        const params = {
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify({ id: cepModel._id.toString() })
        };

        await sqsClient.send(new SendMessageCommand(params))

        res.json({ message: "Sucesso, consulta de cep adicionado à fila.", id: cepModel._id.toString() })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export const fetchCepById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'ID é obrigatório' });
        }

        const data = await Cep.findOne({ _id: id, status: "PROCESSADO" });

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}