import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const competencias = await prisma.competencia.findMany();
            res.status(200).json(competencias);
        } catch (error) {
            console.error("Erro ao buscar competências:", error);
            res.status(500).json({ error: "Erro ao buscar competências no banco de dados." });
        }
    }

    else if (req.method === "POST") {
        try {
            if (!req.body || typeof req.body !== "object") {
                console.error("O corpo da requisição está vazio ou inválido.");
                return res.status(400).json({ error: "O corpo da requisição está vazio ou inválido." });
            }

            const {
                tipo_comp,
                nota,
                comentarios,
                aula,
            } = req.body;

            if (
                !tipo_comp ||
                !nota ||
                !comentarios ||
                !aula
            ) {
                return res.status(400).json({ error: "Campos obrigatórios estão faltando." });
            }

            const novoCompetencia = await prisma.competencia.create({
                data: {
                    tipo_comp,
                    nota: parseInt(nota, 10),
                    comentarios,
                    aula: parseInt(aula, 10),
                },
            });

            console.log("Competência criado:", novoCompetencia);

            res.status(201).json(novoCompetencia);
        } catch (error) {
            console.error("Erro ao criar a competência:", error);
            res.status(500).json({ error: "Erro ao criar o registro no banco de dados." });
        }
    }
    else if (req.method === "PUT") {
        try {
            const { id_comp, tipo_comp, nota, comentarios, aula } = req.body;

            if (!id_comp) {
                return res.status(400).json({ error: "ID é obrigatório para atualização." });
            }

            const competenciaExistente = await prisma.competencia.findUnique({
                where: { id_comp },
            });

            if (!competenciaExistente) {
                return res.status(404).json({ error: "Competência não encontrada." });
            }

            const competenciaAtualizado = await prisma.competencia.update({
                where: { id_comp },
                data: {
                    nota: nota !== undefined ? parseInt(nota, 10) : competenciaExistente.nota,
                    comentarios: comentarios || competenciaExistente.comentarios,
                    aula: aula !== undefined ? parseInt(aula, 10) : competenciaExistente.aula,
                    tipo_comp: tipo_comp
                },
            });

            console.log("Competência atualizada:", competenciaAtualizado);
            res.status(200).json(competenciaAtualizado);
        } catch (error) {
            console.error("Erro ao atualizar a competência:", error);
            res.status(500).json({ error: "Erro ao atualizar a competência no banco de dados." });
        }
    }
    else if (req.method === "DELETE") {
        try {
            const { id_comp } = req.body;

            if (!id_comp) {
                return res.status(400).json({ error: "ID é obrigatório para exclusão." });
            }

            const competenciaExistente = await prisma.competencia.findUnique({
                where: { id_comp },
            });

            if (!competenciaExistente) {
                return res.status(404).json({ error: "Competência não encontrada." });
            }

            await prisma.competencia.delete({
                where: { id_comp },
            });

            console.log("Competência excluída:", id_comp);
            res.status(200).json({ message: "Competência excluída com sucesso." });
        } catch (error) {
            console.error("Erro ao excluir a competência:", error);
            res.status(500).json({ error: "Erro ao excluir a competência no banco de dados." });
        }
    }
    else {
        res.status(405).json({ error: "Método não permitido." });
    }
}
