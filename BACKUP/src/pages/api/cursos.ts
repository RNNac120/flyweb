import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const cursos = await prisma.curso.findMany();
            res.status(200).json(cursos);
        } catch (error) {
            console.error("Erro ao buscar cursos:", error);
            res.status(500).json({ error: "Erro ao buscar cursos no banco de dados." });
        }
    }

    else if (req.method === "POST") {
        try {
            if (!req.body || typeof req.body !== "object") {
                console.error("O corpo da requisição está vazio ou inválido.");
                return res.status(400).json({ error: "O corpo da requisição está vazio ou inválido." });
            }

            const {
                id_curso,
                nome_curso
            } = req.body;

            if (
                !nome_curso
            ) {
                return res.status(400).json({ error: "Campos obrigatórios estão faltando." });
            }

            const novoCurso = await prisma.curso.create({
                data: {
                    nome_curso,
                },
            });

            console.log("Curso criado:", novoCurso);

            res.status(201).json(novoCurso);
        } catch (error) {
            console.error("Erro ao criar o curso:", error);
            res.status(500).json({ error: "Erro ao criar o registro no banco de dados." });
        }
    }
    else if (req.method === "PUT") {
        try {
            const { id_curso, nome_curso } = req.body;

            if (!nome_curso) {
                return res.status(400).json({ error: "Nome é obrigatório para atualização." });
            }

            const cursoExistente = await prisma.curso.findUnique({
                where: { id_curso },
            });

            if (!cursoExistente) {
                return res.status(404).json({ error: "Curso não encontrado." });
            }

            const cursoAtualizado = await prisma.curso.update({
                where: { id_curso },
                data: {
                    nome_curso: nome_curso || cursoExistente.nome_curso,
                },
            });

            console.log("Curso atualizado:", cursoAtualizado);
            res.status(200).json(cursoAtualizado);
        } catch (error) {
            console.error("Erro ao atualizar o curso:", error);
            res.status(500).json({ error: "Erro ao atualizar o curso no banco de dados." });
        }
    }
    else if (req.method === "DELETE") {
        try {
            const { id_curso } = req.body;

            if (!id_curso) {
                return res.status(400).json({ error: "Nome é obrigatório para exclusão." });
            }

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
            res.status(200).json({ message: "Curso excluído com sucesso." });
        } catch (error) {
            console.error("Erro ao excluir o curso:", error);
            res.status(500).json({ error: "Erro ao excluir o curso no banco de dados." });
        }
    }
    else {
        res.status(405).json({ error: "Método não permitido." });
    }
}

