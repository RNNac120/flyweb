import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const voosPendentes = await prisma.aula.findMany({
                where: {
                    nota: null,
                    status: "realizado",
                },
                include: {
                    cpf_aluno: true,
                    id_modulo: true,
                },
                orderBy: {
                    dia_aula: "asc",
                },
            })

            const formattedVoos = voosPendentes.map((voo) => ({
                id: voo.id_aula,
                data: voo.dia_aula.toISOString(),
                aluno: voo.cpf_aluno?.nome || "Aluno não encontrado",
                modulo: voo.id_modulo?.tipo_modulo || "Módulo não encontrado",
            }))

            res.status(200).json(formattedVoos)
        } catch (error) {
            console.error("Erro ao buscar voos pendentes:", error)
            res.status(500).json({ error: "Erro ao buscar voos pendentes" })
        }
    } else {
        res.setHeader("Allow", ["GET"])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
