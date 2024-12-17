import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {
        try {
            const modulos = await prisma.modulo.findMany();
            res.status(200).json(modulos);
        } catch (error) {
            console.error("Erro ao buscar módulos.", error);
            res.status(500).json({ error: "Erro ao buscar módulos no banco de dados." });
        }
    }

    else if (req.method === "POST") {
        try {
            if (!req.body || typeof req.body !== "object") {
                console.error("O corpo da requisição está vazio ou inválido.");
                return res.status(400).json({ error: "O corpo da requisição está vazio ou inválido." });
            }

            const {
                id_modulo,
                id_curso,
                tipo_modulo,
            } = req.body;

            if (
                !id_modulo ||
                !id_curso ||
                !tipo_modulo
            ) {
                return res.status(400).json({ error: "Campos obrigatórios estão faltando." });
            }

            const novoModulo = await prisma.modulo.create({
                data: {
                    id_modulo: parseInt(id_modulo, 10),
                    id_curso: parseInt(id_modulo, 10),
                    tipo_modulo,
                },
            });

            console.log("Módulo criado.", novoModulo);

            res.status(201).json(novoModulo);
        } catch (error) {
            console.error("Erro ao criar o modulo:", error);
            res.status(500).json({ error: "Erro ao criar o registro no banco de dados." });
        }
    }

    else if (req.method === "PUT") {
        try {
            const { id_modulo, tipo_modulo } = req.body;

            if (!id_modulo) {
                return res.status(400).json({ error: "Matrícula é obrigatória para atualização." });
            }

            const moduloExistente = await prisma.modulo.findUnique({
                where: { id_modulo },
            });

            if (!moduloExistente) {
                return res.status(404).json({ error: "Módulo não encontrado." });
            }

            const moduloAtualizado = await prisma.modulo.update({
                where: { id_modulo },
                data: {
                    tipo_modulo: tipo_modulo || moduloExistente.tipo_modulo,
                },
            });

            console.log("Módulo atualizado:", moduloAtualizado);
            res.status(200).json(moduloAtualizado);
        } catch (error) {
            console.error("Erro ao atualizar o módulo:", error);
            res.status(500).json({ error: "Erro ao atualizar o módulo no banco de dados." });
        }
    }

    else if (req.method === "DELETE") {
        try {
            const { id_modulo } = req.body;

            if (!id_modulo) {
                return res.status(400).json({ error: "Matrícula é obrigatória para exclusão." });
            }

            const moduloExistente = await prisma.modulo.findUnique({
                where: { id_modulo },
            });

            if (!moduloExistente) {
                return res.status(404).json({ error: "Módulo não encontrado." });
            }

            await prisma.modulo.delete({
                where: { id_modulo },
            });

            console.log("Módulo excluído:", id_modulo);
            res.status(200).json({ message: "Módulo excluído com sucesso." });
        } catch (error) {
            console.error("Erro ao excluir o módulo:", error);
            res.status(500).json({ error: "Erro ao excluir o módulo no banco de dados." });
        }
    }
    else {
        res.status(405).json({ error: "Método não permitido." });
    }
}
