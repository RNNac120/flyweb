import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const id_curso = Number(req.query.id_curso);
    console.log("ID do curso enviado:", id_curso);


    if (isNaN(id_curso)) {
        return res.status(400).json({ error: "ID inválido." });
    }

    try {
        if (req.method === "DELETE") {
            const cursoExistente = await prisma.curso.findUnique({
                where: { id_curso },
            });

            if (!cursoExistente) {
                return res.status(404).json({ error: "Curso não encontrado." });
            }

            await prisma.curso.delete({
                where: { id_curso },
            });

            console.log("Curso excluído:", id_curso);
            return res.status(200).json({ message: "Curso excluído com sucesso." });
        }

        // Método GET: Buscar um curso pelo ID
        else if (req.method === "GET") {
            const curso = await prisma.curso.findUnique({
                where: { id_curso },
            });

            if (!curso) {
                return res.status(404).json({ error: "Curso não encontrado." });
            }

            return res.status(200).json(curso);
        }

        // Método PUT: Atualizar um curso pelo ID
        else if (req.method === "PUT") {
            const { nome_curso } = req.body;

            if (!nome_curso) {
                return res.status(400).json({ error: "O campo 'nome_curso' é obrigatório para atualização." });
            }

            const cursoExistente = await prisma.curso.findUnique({
                where: { id_curso },
            });

            if (!cursoExistente) {
                return res.status(404).json({ error: "Curso não encontrado." });
            }

            const cursoAtualizado = await prisma.curso.update({
                where: { id_curso },
                data: { nome_curso },
            });

            console.log("Curso atualizado:", cursoAtualizado);
            return res.status(200).json(cursoAtualizado);
        }

        // Resposta para métodos não suportados
        else {
            return res.status(405).json({ error: "Método não permitido." });
        }
    } catch (error) {
        console.error("Erro na API de cursos:", error);
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
}
