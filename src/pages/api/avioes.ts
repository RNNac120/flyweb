import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const avioes = await prisma.aviao.findMany();
            res.status(200).json(avioes);
        } catch (error) {
            console.error("Erro ao buscar aviões:", error);
            res.status(500).json({ error: "Erro ao buscar aviões no banco de dados." });
        }
    }

    else if (req.method === "POST") {
        try {
            if (!req.body || typeof req.body !== "object") {
                console.error("O corpo da requisição está vazio ou inválido.");
                return res.status(400).json({ error: "O corpo da requisição está vazio ou inválido." });
            }

            const {
                matricula,
                horas_voadas,
                data_prox_mnt,
                fabricante,
                modelo_anv,
                disp_voo,
                num_hangar,
            } = req.body;

            if (
                !matricula ||
                !horas_voadas ||
                !data_prox_mnt ||
                !fabricante ||
                !modelo_anv ||
                disp_voo === undefined ||
                !num_hangar
            ) {
                return res.status(400).json({ error: "Campos obrigatórios estão faltando." });
            }

            const novoAviao = await prisma.aviao.create({
                data: {
                    matricula,
                    horas_voadas: parseInt(horas_voadas, 10),
                    data_prox_mnt: new Date(data_prox_mnt),
                    fabricante,
                    modelo_anv,
                    disp_voo: disp_voo === true,
                    num_hangar: parseInt(num_hangar, 10),
                },
            });

            console.log("Avião criado:", novoAviao);

            res.status(201).json(novoAviao);
        } catch (error) {
            console.error("Erro ao criar o avião:", error);
            res.status(500).json({ error: "Erro ao criar o registro no banco de dados." });
        }
    }
    else if (req.method === "PUT") {
        try {
            const { matricula, horas_voadas, data_prox_mnt, fabricante, modelo_anv, disp_voo, num_hangar } = req.body;

            if (!matricula) {
                return res.status(400).json({ error: "Matrícula é obrigatória para atualização." });
            }

            const aviaoExistente = await prisma.aviao.findUnique({
                where: { matricula },
            });

            if (!aviaoExistente) {
                return res.status(404).json({ error: "Avião não encontrado." });
            }

            const aviaoAtualizado = await prisma.aviao.update({
                where: { matricula },
                data: {
                    horas_voadas: horas_voadas !== undefined ? parseInt(horas_voadas, 10) : aviaoExistente.horas_voadas,
                    data_prox_mnt: data_prox_mnt ? new Date(data_prox_mnt) : aviaoExistente.data_prox_mnt,
                    fabricante: fabricante || aviaoExistente.fabricante,
                    modelo_anv: modelo_anv || aviaoExistente.modelo_anv,
                    disp_voo: disp_voo !== undefined ? disp_voo === true : aviaoExistente.disp_voo,
                    num_hangar: num_hangar !== undefined ? parseInt(num_hangar, 10) : aviaoExistente.num_hangar,
                },
            });

            console.log("Avião atualizado:", aviaoAtualizado);
            res.status(200).json(aviaoAtualizado);
        } catch (error) {
            console.error("Erro ao atualizar o avião:", error);
            res.status(500).json({ error: "Erro ao atualizar o avião no banco de dados." });
        }
    }
    else if (req.method === "DELETE") {
        try {
            const { matricula } = req.body;

            if (!matricula) {
                return res.status(400).json({ error: "Matrícula é obrigatória para exclusão." });
            }

            const aviaoExistente = await prisma.aviao.findUnique({
                where: { matricula },
            });

            if (!aviaoExistente) {
                return res.status(404).json({ error: "Avião não encontrado." });
            }

            await prisma.aviao.delete({
                where: { matricula },
            });

            console.log("Avião excluído:", matricula);
            res.status(200).json({ message: "Avião excluído com sucesso." });
        } catch (error) {
            console.error("Erro ao excluir o avião:", error);
            res.status(500).json({ error: "Erro ao excluir o avião no banco de dados." });
        }
    }
    else {
        res.status(405).json({ error: "Método não permitido." });
    }
}
