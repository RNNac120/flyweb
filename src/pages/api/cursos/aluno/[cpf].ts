import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const { cpf } = req.query

            // Get student's courses
            const cursos = await prisma.curso.findMany({
                include: {
                    modulos: {
                        include: {
                            aulas: {
                                where: {
                                    aluno: cpf as string,
                                },
                                select: {
                                    id_aula: true,
                                    status: true,
                                    nota: true,
                                    dia_aula: true,
                                    hora_inicio: true,
                                    hora_fim: true,
                                },
                            },
                        },
                    },
                },
            })

            res.status(200).json(cursos)
        } catch (error) {
            console.error("Erro ao buscar cursos:", error)
            res.status(500).json({ error: "Erro ao buscar cursos no banco de dados." })
        }
    } else {
        res.status(405).json({ error: "Método não permitido." })
    }
}


