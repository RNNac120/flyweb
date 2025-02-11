import bcrypt from "bcrypt"
import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const usuarios = await prisma.pessoa.findMany()
      res.status(200).json(usuarios)
    } catch (error) {
      console.error("Erro ao buscar usuários:", error)
      res.status(500).json({ error: "Erro ao buscar usuários no banco de dados." })
    }
  } else if (req.method === "POST") {
    try {
      if (!req.body || typeof req.body !== "object") {
        console.error("O corpo da requisição está vazio ou inválido.")
        return res.status(400).json({ error: "O corpo da requisição está vazio ou inválido." })
      }

      const { cpf, nome, data_nasc, role, carteira_anac, carteira_mec, salario, email, senha } = req.body

      if (!cpf || !nome || !data_nasc || !role || !email || !senha) {
        return res.status(400).json({ error: "Campos obrigatórios estão faltando." })
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(senha, 10)

      const novoUsuario = await prisma.pessoa.create({
        data: {
          nome,
          data_nasc: new Date(data_nasc),
          cpf,
          role,
          carteira_anac: carteira_anac || null,
          carteira_mec: carteira_mec || null,
          salario: salario !== undefined ? Number.parseFloat(salario) : null,
          email,
          senha: hashedPassword, // Salvar a senha hasheada
        },
      })

      console.log("Usuário criado:", novoUsuario)
      res.status(201).json(novoUsuario)
    } catch (error) {
      console.error("Erro ao criar o usuário:", error)
      res.status(500).json({ error: "Erro ao criar o registro no banco de dados." })
    }
  } else if (req.method === "PUT") {
    try {
      const { nome, data_nasc, cpf, role, carteira_anac, carteira_mec, salario, email, senha } = req.body

      if (!cpf) {
        return res.status(400).json({ error: "CPF é obrigatório para atualização." })
      }

      const usuarioExistente = await prisma.pessoa.findUnique({
        where: { cpf },
      })

      if (!usuarioExistente) {
        return res.status(404).json({ error: "Usuário não encontrado." })
      }

      let senhaAtualizada = usuarioExistente.senha

      if (senha) {
        // Hash da nova senha, se fornecida
        senhaAtualizada = await bcrypt.hash(senha, 10)
      }

      const usuarioAtualizado = await prisma.pessoa.update({
        where: { cpf: String(cpf) },
        data: {
          nome: nome || usuarioExistente.nome,
          data_nasc: data_nasc ? new Date(data_nasc) : usuarioExistente.data_nasc,
          role: role || usuarioExistente.role,
          carteira_anac: carteira_anac || usuarioExistente.carteira_anac,
          carteira_mec: carteira_mec || usuarioExistente.carteira_mec,
          salario: salario !== undefined ? Number.parseFloat(salario) : usuarioExistente.salario,
          email: email || usuarioExistente.email,
          senha: senhaAtualizada, // Atualiza apenas se a senha foi fornecida
        },
      })

      console.log("Usuário atualizado:", usuarioAtualizado)
      res.status(200).json(usuarioAtualizado)
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error)
      res.status(500).json({ error: "Erro ao atualizar o usuário no banco de dados." })
    }
  } else if (req.method === "DELETE") {
    try {
      const { cpf } = req.body

      if (!cpf) {
        return res.status(400).json({ error: "CPF é obrigatório para exclusão." })
      }

      const usuarioExistente = await prisma.pessoa.findUnique({
        where: { cpf },
      })

      if (!usuarioExistente) {
        return res.status(404).json({ error: "Usuário não encontrado." })
      }

      await prisma.pessoa.delete({
        where: { cpf },
      })

      console.log("Usuário excluído:", cpf)
      res.status(200).json({ message: "Usuário excluído com sucesso." })
    } catch (error) {
      console.error("Erro ao excluir o usuário:", error)
      res.status(500).json({ error: "Erro ao excluir o usuário no banco de dados." })
    }
  } else {
    res.status(405).json({ error: "Método não permitido." })
  }
}

