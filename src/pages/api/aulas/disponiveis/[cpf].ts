import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const { cpf } = req.query

            const aluno = await prisma.pessoa.findUnique({
                where: { cpf: cpf as string },
                include: {
                    aulas_aluno: {
                        include: {
                            id_modulo: true,
                        },
                    },
                },
            })

            if (!aluno) {
                return res.status(404).json({ error: "Aluno não encontrado" })
            }

            const proximaAula = await prisma.aula.findFirst({
                where: {
                    aluno: cpf as string,
                    status: "disponivel",
                },
                include: {
                    id_modulo: true,
                },
                orderBy: {
                    id_aula: "asc",
                },
            })

            if (!proximaAula) {
                const primeiroModulo = await prisma.modulo.findFirst({
                    orderBy: {
                        id_modulo: "asc",
                    },
                })

                if (primeiroModulo) {
                    return res.status(200).json([
                        {
                            id_aula: 1,
                            modulo: primeiroModulo.id_modulo,
                            tipo_modulo: primeiroModulo.tipo_modulo,
                        },
                    ])
                }
            }

            res.status(200).json([proximaAula])
        } catch (error) {
            console.error("Erro ao buscar aulas disponíveis:", error)
            res.status(500).json({ error: "Erro ao buscar aulas disponíveis" })
        }
    }
}


