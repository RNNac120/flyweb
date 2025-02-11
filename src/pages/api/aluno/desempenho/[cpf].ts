import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const { cpf } = req.query

            if (typeof cpf !== "string") {
                return res.status(400).json({ error: "CPF inválido" })
            }

            const aulas = await prisma.aula.findMany({
                where: {
                    aluno: cpf,
                },
                include: {
                    id_modulo: true,
                },
            })

            const totalVoos = aulas.length
            const horasVoo = aulas.reduce((acc, aula) => {
                const inicio = new Date(aula.hora_inicio)
                const fim = new Date(aula.hora_fim)
                const horas = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60)
                return acc + horas
            }, 0)

            const notasPorModulo = aulas.reduce(
                (acc, aula) => {
                    const modulo = aula.id_modulo.tipo_modulo
                    if (!acc[modulo]) {
                        acc[modulo] = []
                    }
                    if (aula.nota !== null) {
                        acc[modulo].push(aula.nota)
                    }
                    return acc
                },
                {} as Record<string, number[]>,
            )

            const notas = Object.entries(notasPorModulo).map(([modulo, notas]) => ({
                modulo,
                nota: notas.reduce((a, b) => a + b, 0) / notas.length,
            }))

            res.status(200).json({
                totalVoos,
                horasVoo,
                notas,
            })
        } catch (error) {
            console.error("Erro ao buscar desempenho do aluno:", error)
            res.status(500).json({ error: "Erro ao buscar desempenho do aluno" })
        }
    } else {
        res.setHeader("Allow", ["GET"])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}


