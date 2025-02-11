import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { aviao, dataInicio, dataFim, descricao, mecanico } = req.body

      if (!aviao || !dataInicio || !descricao) {
        return res.status(400).json({ error: "Campos obrigatórios: avião, data de início e descrição" })
      }

      // Converter as datas para o formato correto
      const inicio_mnt = new Date(dataInicio)
      const fim_mnt = dataFim ? new Date(dataFim) : null

      const novaManutencao = await prisma.manutencao.create({
        data: {
          aviao,
          inicio_mnt,
          fim_mnt,
          descricao,
          mecanico: mecanico || "MECANICO_DEFAULT", // Substitua pelo CPF do mecânico logado
        },
      })

      // Atualizar o status do avião para indisponível
      await prisma.aviao.update({
        where: { matricula: aviao },
        data: { disp_voo: false },
      })

      res.status(201).json(novaManutencao)
    } catch (error) {
      console.error("Erro ao criar manutenção:", error)
      res.status(500).json({ error: "Erro ao criar manutenção" })
    }
  } else if (req.method === "GET") {
    try {
      const manutencoes = await prisma.manutencao.findMany({
        include: {
          mat_aviao: true,
          cpf_mec: true,
        },
      })
      res.status(200).json(manutencoes)
    } catch (error) {
      console.error("Erro ao buscar manutenções:", error)
      res.status(500).json({ error: "Erro ao buscar manutenções" })
    }
  }
}

