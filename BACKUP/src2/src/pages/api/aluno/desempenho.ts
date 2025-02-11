import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Aqui você deve pegar o CPF do aluno da sessão ou query
      const cpfAluno = req.query.cpf as string

      // Buscar todas as aulas do aluno
      const aulas = await prisma.aula.findMany({
        where: {
          aluno: cpfAluno,
        },
        include: {
          id_modulo: true,
        },
      })

      // Calcular estatísticas
      const totalVoos = aulas.length
      const horasVoo = aulas.reduce((acc, aula) => {
        const inicio = new Date(aula.hora_inicio)
        const fim = new Date(aula.hora_fim)
        const horas = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60)
        return acc + horas
      }, 0)

      // Agrupar notas por módulo
      const notasPorModulo = aulas.reduce(
        (acc, aula) => {
          const modulo = aula.id_modulo.tipo_modulo
          if (!acc[modulo]) {
            acc[modulo] = []
          }
          if (aula.nota) {
            acc[modulo].push(aula.nota)
          }
          return acc
        },
        {} as Record<string, number[]>,
      )

      // Calcular média por módulo
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
      console.error("Erro ao buscar desempenho:", error)
      res.status(500).json({ error: "Erro ao buscar dados de desempenho" })
    }
  }
}

