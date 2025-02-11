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

            const proximosVoos = await prisma.aula.findMany({
                where: {
                    instrutor: cpf,
                    dia_aula: {
                        gte: new Date(),
                    },
                },
                include: {
                    cpf_aluno: true,
                    id_modulo: true,
                },
                orderBy: {
                    dia_aula: "asc",
                },
                take: 5,
            })

            const formattedVoos = proximosVoos.map((voo) => ({
                id: voo.id_aula,
                data: voo.dia_aula,
                instrucao: voo.id_modulo.tipo_modulo,
                aluno: voo.cpf_aluno.nome,
            }))

            res.status(200).json(formattedVoos)
        } catch (error) {
            console.error("Erro ao buscar próximos voos:", error)
            res.status(500).json({ error: "Erro ao buscar próximos voos" })
        }
    } else {
        res.setHeader("Allow", ["GET"])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}


