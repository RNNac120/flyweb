import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const aulas = await prisma.aula.findMany({
                include: {
                    mat_aviao: true,
                    cpf_aluno: true,
                    cpf_inst: true,
                    id_modulo: true,
                },
            })

            const resposta = aulas.map((aula) => ({
                id_aula: aula.id_aula,
                dia_aula: aula.dia_aula,
                hora_inicio: aula.hora_inicio,
                hora_fim: aula.hora_fim,
                aviao_usado: aula.mat_aviao?.matricula || "Avião não encontrado",
                aluno: aula.cpf_aluno?.nome || "Aluno não encontrado",
                instrutor: aula.cpf_inst?.nome || "Instrutor não informado",
                modulo: aula.id_modulo.tipo_modulo,
                nota: aula.nota,
                freq_radio: aula.freq_radio,
                status: aula.status,
            }))

            res.status(200).json(resposta)
        } catch (error) {
            console.error("Erro ao buscar aulas.", error)
            res.status(500).json({ error: "Erro ao buscar aulas no banco de dados." })
        }
    } else if (req.method === "POST") {
        try {
            if (!req.body || typeof req.body !== "object") {
                return res.status(400).json({ error: "O corpo da requisição está vazio ou inválido." })
            }

            const { dia_aula, hora_inicio, hora_fim, aviao_usado, aluno, instrutor, modulo, nota, freq_radio } = req.body

            console.log(req.body)

            if (!dia_aula || !hora_inicio || !hora_fim || !aviao_usado || !aluno || !modulo) {
                return res.status(400).json({ error: "Campos obrigatórios estão faltando." })
            }

            const hora_inicio_formatado = new Date()
            hora_inicio_formatado.setHours(hora_inicio.split(":")[0], hora_inicio.split(":")[1])

            const hora_fim_formatado = new Date()
            hora_fim_formatado.setHours(hora_fim.split(":")[0], hora_fim.split(":")[1])

            const novaAula = await prisma.aula.create({
                data: {
                    dia_aula: new Date(dia_aula),
                    hora_inicio: hora_inicio_formatado,
                    hora_fim: hora_fim_formatado,
                    aviao_usado,
                    aluno,
                    instrutor: instrutor || null,
                    modulo: Number.parseInt(modulo),
                    nota: Number.parseInt(nota) || 0,
                    freq_radio: Number.parseFloat(freq_radio) || 0.0,
                },
            })

            console.log("Aula criada:", novaAula)
            res.status(201).json(novaAula)
        } catch (error) {
            console.error("Erro ao criar aula:", error)
            res.status(500).json({ error: "Erro ao criar o registro no banco de dados." })
        }
    } else if (req.method === "PUT") {
        try {
            const { id_aula, dia_aula, hora_inicio, hora_fim, nota, freq_radio } = req.body

            if (!id_aula) {
                return res.status(400).json({ error: "ID da aula é obrigatório para atualização." })
            }

            const aulaExistente = await prisma.aula.findUnique({
                where: { id_aula },
            })

            if (!aulaExistente) {
                return res.status(404).json({ error: "Aula não encontrada." })
            }

            const aulaAtualizada = await prisma.aula.update({
                where: { id_aula },
                data: {
                    dia_aula: dia_aula ? new Date(dia_aula) : aulaExistente.dia_aula,
                    hora_inicio: hora_inicio ? new Date(hora_inicio) : aulaExistente.hora_inicio,
                    hora_fim: hora_fim ? new Date(hora_fim) : aulaExistente.hora_fim,
                    nota: nota !== undefined ? Number(nota) : aulaExistente.nota,
                    freq_radio: freq_radio !== undefined ? Number(freq_radio) : aulaExistente.freq_radio,
                },
            })

            console.log("Aula atualizada:", aulaAtualizada)
            res.status(200).json(aulaAtualizada)
        } catch (error) {
            console.error("Erro ao atualizar a aula:", error)
            res.status(500).json({ error: "Erro ao atualizar a aula no banco de dados." })
        }
    } else if (req.method === "DELETE") {
        try {
            const { id_aula } = req.body

            if (!id_aula) {
                return res.status(400).json({ error: "ID da aula é obrigatório para exclusão." })
            }

            const aulaExistente = await prisma.aula.findUnique({
                where: { id_aula },
            })

            if (!aulaExistente) {
                return res.status(404).json({ error: "Aula não encontrada." })
            }

            await prisma.aula.delete({
                where: { id_aula },
            })

            console.log("Aula excluída:", id_aula)
            res.status(200).json({ message: "Aula excluída com sucesso." })
        } catch (error) {
            console.error("Erro ao excluir a aula:", error)
            res.status(500).json({ error: "Erro ao excluir a aula no banco de dados." })
        }
    } else {
        res.status(405).json({ error: "Método não permitido." })
    }
}


