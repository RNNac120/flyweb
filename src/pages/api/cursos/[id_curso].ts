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

            const modulos = await prisma.modulo.findMany({
                where: { id_curso },
                select: { id_modulo: true },
            });

            const idsModulos = modulos.map((modulo) => modulo.id_modulo);

            if (idsModulos.length > 0) {
                await prisma.aula.deleteMany({
                    where: {
                        modulo: { in: idsModulos },
                    },
                });
            }

            await prisma.modulo.deleteMany({
                where: { id_curso },
            });

            await prisma.curso.delete({
                where: { id_curso },
            });

            console.log(`Curso ${id_curso} e seus módulos/aulas foram excluídos.`);
            return res.status(200).json({ message: "Curso excluído com sucesso, incluindo módulos e aulas associadas." });
        }

        else if (req.method === "GET") {
            const curso = await prisma.curso.findUnique({
                where: { id_curso },
            });

            if (!curso) {
                return res.status(404).json({ error: "Curso não encontrado." });
            }

            return res.status(200).json(curso);
        }

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

        else {
            return res.status(405).json({ error: "Método não permitido." });
        }
    } catch (error) {
        console.error("Erro na API de cursos:", error);
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
}

