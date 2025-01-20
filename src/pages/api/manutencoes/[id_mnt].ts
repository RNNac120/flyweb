import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const id_mnt = Number(req.query.id_mnt);

    if (req.method === "DELETE") {
        try {
            const manutencao = await prisma.manutencao.findUnique({
                where: { id_mnt },
            });

            if (!manutencao) {
                return res.status(404).json({ error: "Manutenção não encontrada." });
            }

            await prisma.manutencao.delete({
                where: { id_mnt },
            });

            res.status(200).json({ message: "Manutenção excluída com sucesso." });
        } catch (error) {
            console.error("Erro ao excluir manutenção:", error);
            res.status(500).json({ error: "Erro ao excluir manutenção no banco de dados." });
        }
    } else if (req.method === "GET") {
        try {
            const manutencao = await prisma.manutencao.findUnique({
                where: { id_mnt },
            });
            if (!manutencao) {
                return res.status(404).json({ error: "Manutenção não encontrada." });
            }
            res.status(200).json(manutencao);
        } catch (error) {
            console.error("!!!!!!DEU RUIM!!!!!!");
            console.error("Erro ao buscar manutenção:", error);
            res.status(500).json({ error: "Erro ao buscar manutenção no banco de dados." });
        }
    } else if (req.method === "PUT") {
        try {
            const {
                inicio_mnt,
                fim_mnt,
                descricao,
                aviao,
                mecanico
            } = req.body;

            if (!id_mnt) {
                return res.status(400).json({ error: "ID da manutencao é obrigatório para atualização." });
            }

            const manutencaoExistente = await prisma.manutencao.findUnique({
                where: { id_mnt },
            });

            if (!manutencaoExistente) {
                return res.status(404).json({ error: "Manutenção não encontrada." });
            }

            const manutencaoAtualizada = await prisma.manutencao.update({
                where: { id_mnt },
                data: {
                    inicio_mnt: inicio_mnt !== undefined ? new Date(inicio_mnt) : manutencaoExistente.inicio_mnt,
                    fim_mnt: fim_mnt !== undefined ? new Date(fim_mnt) : manutencaoExistente.fim_mnt,
                    descricao: descricao !== undefined ? descricao : manutencaoExistente.descricao,
                    aviao: aviao !== undefined ? aviao : manutencaoExistente.aviao,
                    mecanico: mecanico !== undefined ? mecanico : manutencaoExistente.mecanico,
                },
            });

            res.status(200).json(manutencaoAtualizada);
        } catch (error) {
            console.error("Erro ao atualizar manutenção:", error);
            res.status(500).json({ error: "Erro ao atualizar manutenção no banco de dados." });
        }
    } else {
        res.status(405).json({ error: "Método não permitido." });
    }
}

