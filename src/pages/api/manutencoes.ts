import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { aviao, dataInicio, dataFim, descricao, mecanico } = req.body

            if (!aviao || !dataInicio || !descricao || !mecanico) {
                return res.status(400).json({
                    error: "Campos obrigatórios: avião, data de início, descrição e CPF do mecânico",
                })
            }

            const mecanicoExiste = await prisma.pessoa.findFirst({
                where: {
                    cpf: mecanico,
                    role: "Mecânico",
                },
            })

            if (!mecanicoExiste) {
                return res.status(400).json({ error: "Mecânico não encontrado" })
            }

            const novaManutencao = await prisma.manutencao.create({
                data: {
                    aviao,
                    inicio_mnt: new Date(dataInicio),
                    fim_mnt: dataFim ? new Date(dataFim) : null,
                    descricao,
                    mecanico,
                },
            })

            await prisma.aviao.update({
                where: { matricula: aviao },
                data: { disp_voo: false },
            })

            return res.status(201).json(novaManutencao)
        } catch (error) {
            console.error("Erro ao criar manutenção:", error)
            return res.status(500).json({ error: "Erro ao criar manutenção" })
        }
    }

    if (req.method === "PUT") {
        try {
            const { id_mnt, fim_mnt, aviao } = req.body

            const manutencaoAtualizada = await prisma.manutencao.update({
                where: { id_mnt },
                data: {
                    fim_mnt: new Date(fim_mnt),
                },
            })

            await prisma.aviao.update({
                where: { matricula: aviao },
                data: { disp_voo: true },
            })

            return res.status(200).json(manutencaoAtualizada)
        } catch (error) {
            console.error("Erro ao atualizar manutenção:", error)
            return res.status(500).json({ error: "Erro ao atualizar manutenção" })
        }
    }

    return res.status(405).json({ error: "Método não permitido" })
}


