import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const manutencoes = await prisma.manutencao.findMany();
            res.status(200).json(manutencoes);
        } catch (error) {
            console.error("!!DEU RUIM!!");
            console.error("Erro ao buscar manutenções:", error);
            res.status(500).json({ error: "Erro ao buscar manutenções no banco de dados." });
        }
    }

    else if (req.method === "POST") {
        try {
            if (!req.body || typeof req.body !== "object") {
                console.error("O corpo da requisição está vazio ou inválido.");
                return res.status(400).json({ error: "O corpo da requisição está vazio ou inválido." });
            }

            const {
                mecanico,
                aviao,
                descricao,
                inicio_mnt,
                fim_mnt
            } = req.body;

            console.log(req.body);

            if (
                !mecanico ||
                !aviao ||
                !descricao ||
                !inicio_mnt
            ) {
                return res.status(400).json({ error: "Campos obrigatórios estão faltando." });
            }

            console.log(fim_mnt);

            const novoManutencao = await prisma.manutencao.create({
                data: {
                    mecanico,
                    aviao,
                    descricao,
                    inicio_mnt: new Date(inicio_mnt),
                    fim_mnt: new Date(fim_mnt) || null
                },
            });

            console.log("Manutenção criada:", novoManutencao);

            res.status(201).json(novoManutencao);
        } catch (error) {
            console.error("Erro ao criar a manutenção:", error);
            res.status(500).json({ error: "Erro ao criar o registro no banco de dados." });
        }
    }
    else if (req.method === "PUT") {
        try {
            const { id_mnt, mecanico, aviao, descricao, inicio_mnt, fim_mnt } = req.body;

            if (!id_mnt) {
                return res.status(400).json({ error: "ID é obrigatório para atualização." });
            }

            const manutencaoExistente = await prisma.manutencao.findUnique({
                where: { id_mnt },
            });

            if (!manutencaoExistente) {
                return res.status(404).json({ error: "Manutenção não encontrada." });
            }

            const manutencaoAtualizado = await prisma.manutencao.update({
                where: { id_mnt },
                data: {
                    aviao: aviao !== undefined ? aviao : manutencaoExistente.aviao,
                    descricao: descricao || manutencaoExistente.descricao,
                    inicio_mnt: inicio_mnt !== undefined ? inicio_mnt : manutencaoExistente.inicio_mnt,
                    fim_mnt: fim_mnt !== undefined ? fim_mnt : manutencaoExistente.fim_mnt,
                    mecanico: mecanico,
                },
            });

            console.log("Manutenção atualizada:", manutencaoAtualizado);
            res.status(200).json(manutencaoAtualizado);
        } catch (error) {
            console.error("Erro ao atualizar a manutenção:", error);
            res.status(500).json({ error: "Erro ao atualizar a manutenção no banco de dados." });
        }
    }
    else if (req.method === "DELETE") {
        try {
            const { id_mnt } = req.body;

            if (!id_mnt) {
                return res.status(400).json({ error: "ID é obrigatório para exclusão." });
            }

            const manutencaoExistente = await prisma.manutencao.findUnique({
                where: { id_mnt },
            });

            if (!manutencaoExistente) {
                return res.status(404).json({ error: "Manutenção não encontrada." });
            }

            await prisma.manutencao.delete({
                where: { id_mnt },
            });

            console.log("Manutenção excluída:", id_mnt);
            res.status(200).json({ message: "Manutenção excluída com sucesso." });
        } catch (error) {
            console.error("Erro ao excluir a manutenção:", error);
            res.status(500).json({ error: "Erro ao excluir a manutenção no banco de dados." });
        }
    }
    else {
        res.status(405).json({ error: "Método não permitido." });
    }
}
