import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const id_aula = Number(req.query.id_aula);

    if (req.method === "DELETE") {
        try {
            const aula = await prisma.aula.findUnique({
                where: { id_aula },
                include: {
                    id_modulo: true,
                    mat_aviao: true,
                    cpf_aluno: true,
                    cpf_inst: true,
                },
            });

            if (!aula) {
                return res.status(404).json({ error: "Aula não encontrada." });
            }

            await prisma.aula.delete({
                where: { id_aula: aula.id_aula },
            });

            res.status(200).json({ message: "Aula excluída com sucesso." });
        } catch (error) {
            console.error("Erro ao excluir aula:", error);
            res.status(500).json({ error: "Erro ao excluir aula no banco de dados." });
        }
    } else if (req.method === "GET") {
        try {
            const aula = await prisma.aula.findUnique({
                where: { id_aula },
                include: {
                    mat_aviao: true,
                    cpf_aluno: true,
                    cpf_inst: true,
                    id_modulo: true,
                },
            });

            if (!aula) {
                return res.status(404).json({ error: "Aula não encontrada." });
            }

            res.status(200).json(aula);
        } catch (error) {
            console.error("Erro ao buscar aula:", error);
            res.status(500).json({ error: "Erro ao buscar aula no banco de dados." });
        }
    } else if (req.method === "PUT") {
        try {
            const {
                dia_aula,
                hora_inicio,
                hora_fim,
                aviao_usado,
                aluno,
                instrutor,
                modulo,
                nota,
                freq_radio,
            } = req.body;

            if (!id_aula) {
                return res.status(400).json({ error: "ID da aula é obrigatório para atualização." });
            }

            const aulaExistente = await prisma.aula.findUnique({
                where: { id_aula },
            });

            if (!aulaExistente) {
                return res.status(404).json({ error: "Aula não encontrada." });
            }

            const hora_inicio_formatado = new Date();
            hora_inicio_formatado.setHours(hora_inicio.split(':')[0], hora_inicio.split(':')[1]);

            const hora_fim_formatado = new Date();
            hora_fim_formatado.setHours(hora_fim.split(':')[0], hora_fim.split(':')[1]);

            const aulaAtualizada = await prisma.aula.update({
                where: { id_aula },
                data: {
                    dia_aula: dia_aula ? new Date(dia_aula) : aulaExistente.dia_aula,
                    hora_inicio: hora_inicio_formatado || aulaExistente.hora_inicio,
                    hora_fim: hora_fim_formatado || aulaExistente.hora_fim,
                    aviao_usado: aviao_usado || aulaExistente.aviao_usado,
                    aluno: aluno || aulaExistente.aluno,
                    instrutor: instrutor || aulaExistente.instrutor,
                    modulo: modulo !== undefined ? parseInt(modulo, 10) : aulaExistente.modulo,
                    nota: nota !== undefined ? parseInt(nota, 10) : aulaExistente.nota,
                    freq_radio: freq_radio !== undefined ? parseFloat(freq_radio) : aulaExistente.freq_radio,
                },
            });

            res.status(200).json(aulaAtualizada);
        } catch (error) {
            console.error("Erro ao atualizar aula:", error);
            res.status(500).json({ error: "Erro ao atualizar aula no banco de dados." });
        }
    } else {
        res.status(405).json({ error: "Método não permitido." });
    }
}

