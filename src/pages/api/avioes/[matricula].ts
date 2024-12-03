import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { matricula } = req.query; // Pegando a matrícula da URL

    if (typeof matricula !== "string") {
        return res.status(400).json({ error: "Matrícula inválida." });
    }

    if (req.method === "DELETE") {
        try {
            const aviaoExistente = await prisma.aviao.findUnique({
                where: { matricula },
            });

            if (!aviaoExistente) {
                return res.status(404).json({ error: "Avião não encontrado." });
            }

            // Excluindo o avião do banco de dados
            await prisma.aviao.delete({
                where: { matricula },
            });

            console.log("Avião excluído:", matricula);
            res.status(200).json({ message: "Avião excluído com sucesso." });
        } catch (error) {
            console.error("Erro ao excluir o avião:", error);
            res.status(500).json({ error: "Erro ao excluir o avião no banco de dados." });
        }
    } else if (req.method === "GET") {
        try {
            const aviao = await prisma.aviao.findUnique({
                where: { matricula: String(matricula) },
            });
            if (!aviao) {
                return res.status(404).json({ error: "Avião não encontrado." });
            }
            res.status(200).json(aviao);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar avião." });
        }
    } else if (req.method === "PUT") {
        try {
            const { horas_voadas, data_prox_mnt, fabricante, modelo_anv, disp_voo, num_hangar } = req.body;

            if (!matricula) {
                return res.status(400).json({ error: "Matrícula é obrigatória para atualização." });
            }

            const aviaoExistente = await prisma.aviao.findUnique({
                where: { matricula: String(matricula) },
            });

            if (!aviaoExistente) {
                return res.status(404).json({ error: "Avião não encontrado." });
            }

            const aviaoAtualizado = await prisma.aviao.update({
                where: { matricula: String(matricula) },
                data: {
                    horas_voadas: horas_voadas !== undefined ? parseInt(horas_voadas, 10) : aviaoExistente.horas_voadas,
                    data_prox_mnt: data_prox_mnt ? new Date(data_prox_mnt) : aviaoExistente.data_prox_mnt,
                    fabricante: fabricante || aviaoExistente.fabricante,
                    modelo_anv: modelo_anv || aviaoExistente.modelo_anv,
                    disp_voo: disp_voo !== undefined ? disp_voo === true : aviaoExistente.disp_voo,
                    num_hangar: num_hangar !== undefined ? parseInt(num_hangar, 10) : aviaoExistente.num_hangar,
                },
            });

            res.status(200).json(aviaoAtualizado);
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar o avião." });
        }
    } else {
        res.status(405).json({ error: "Método não permitido." });
    }
}

