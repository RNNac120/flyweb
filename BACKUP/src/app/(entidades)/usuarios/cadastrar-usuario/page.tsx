"use client"

import { useState } from "react";
import BarraLatEsq from "../../../ui/barralatesq";
import BarraLatDir from "../../../ui/barralatdir";

export default function Template() {
    const [formData, setFormData] = useState({
        nome: "",
        data_nasc: "",
        cpf: "",
        role: "",
        carteira_anac: "",
        carteira_mec: "",
        salario: "",
        email: "",
        senha: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: formData.nome,
                    data_nasc: new Date(formData.data_nasc),
                    cpf: formData.cpf,
                    role: formData.role,
                    carteira_anac: formData.carteira_anac,
                    carteira_mec: formData.carteira_mec,
                    salario: parseFloat(formData.salario),
                    email: formData.email,
                    senha: formData.senha,
                }),
            });

            if (response.ok) {
                alert("Usuário cadastrado com sucesso!");
                setFormData({
                    nome: "",
                    data_nasc: "",
                    cpf: "",
                    role: "",
                    carteira_anac: "",
                    carteira_mec: "",
                    salario: "",
                    email: "",
                    senha: "",
                });
            } else {
                alert("Erro ao cadastrar o usuário!");
            }
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
            alert("Erro ao cadastrar o usuário!");
        }
    };

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200 justify-center overflow-scroll">
                <h1 className="mt-12 text-lg font-bold">Cadastrar Usuário</h1>
                <form onSubmit={handleSubmit} className="w-full">
                    {[
                        { name: "nome", label: "Nome" },
                        { name: "data_nasc", label: "Data de nascimento", type: "date" },
                        { name: "cpf", label: "CPF", type: "string" },
                        { name: "role", label: "Cargo no Aeroclube", type: "select" },
                        { name: "carteira_anac", label: "Carteira ANAC" },
                        { name: "carteira_mec", label: "Carteira de Mecânico" },
                        { name: "salario", label: "Salário", type: "number" },
                        { name: "email", label: "E-mail" },
                        { name: "senha", label: "Senha", type: "password" },
                    ].map((field) => (
                        <div key={field.name} className="mb-4">
                            <label htmlFor={field.name} className="block text-gray-600">
                                {field.label}
                            </label>
                            {field.type === "select" ? (
                                <select
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Aluno">Aluno</option>
                                    <option value="Instrutor">Instrutor</option>
                                    <option value="Mecânico">Mecânico</option>
                                </select>
                            ) : (
                                <input
                                    type={field.type || "text"}
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                />
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                        Cadastrar
                    </button>
                </form>
            </div>
            <BarraLatDir />
        </main>
    );
}

