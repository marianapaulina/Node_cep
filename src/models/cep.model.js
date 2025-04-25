import mongoose from "mongoose";

const CepSchema = new mongoose.Schema({
    cep: String,
    status: { type: String, default: 'PENDENTE' },
    data: Object
});

CepSchema.index({ cep: 1 });
CepSchema.index({ cep: 1, status: 1 });

export const Cep = mongoose.model('Cep', CepSchema);