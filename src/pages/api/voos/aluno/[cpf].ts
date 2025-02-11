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

            const modulos = await prisma.modulo.findMany({
                include: {
                    aulas: {
                        where: {
                            aluno: cpf,
                        },
                        include: {
                            mat_aviao: true,
                        },
                        orderBy: {
                            id_aula: "asc",
                        },
                    },
                },
                orderBy: {
                    id_modulo: "asc",
                },
            })

            const formattedModulos = modulos.map((modulo) => {
                const aulas = modulo.aulas.map((aula, index) => {
                    let status = "indisponivel"
                    if (aula.nota !== null) {
                        status = "feito"
                    } else if (index === 0 || modulo.aulas[index - 1].nota !== null) {
                        status = "disponivel"
                    }

                    return {
                        id: aula.id_aula,
                        data: aula.dia_aula,
                        hora_inicio: aula.hora_inicio,
                        hora_fim: aula.hora_fim,
                        aviao: aula.mat_aviao?.modelo_anv || "Avião não encontrado",
                        status,
                        nota: aula.nota,
                    }
                })

                return {
                    id_modulo: modulo.id_modulo,
                    tipo_modulo: modulo.tipo_modulo,
                    aulas,
                }
            })

            res.status(200).json(formattedModulos)
        } catch (error) {
            console.error("Erro ao buscar voos do aluno:", error)
            res.status(500).json({ error: "Erro ao buscar voos do aluno" })
        }
    } else {
        res.setHeader("Allow", ["GET"])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}


