import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const voos = await prisma.aula.findMany({
                where: {
                    instrutor: { not: null },
                },
                include: {
                    cpf_aluno: true,
                    mat_aviao: true,
                    id_modulo: true,
                },
                orderBy: {
                    dia_aula: "desc",
                },
            })

            const formattedVoos = voos.map((voo) => ({
                id: voo.id_aula,
                data: voo.dia_aula,
                aluno: voo.cpf_aluno?.nome || "Aluno não encontrado",
                aviao: voo.mat_aviao?.modelo_anv || "Avião não encontrado",
                modulo: voo.id_modulo?.tipo_modulo || "Módulo não encontrado",
                nota: voo.nota,
                status: voo.status,
            }))

            res.status(200).json(formattedVoos)
        } catch (error) {
            console.error("Erro ao buscar voos do instrutor:", error)
            res.status(500).json({ error: "Erro ao buscar voos do instrutor" })
        }
    } else {
        res.setHeader("Allow", ["GET"])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}


