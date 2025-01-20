"use client";

import { useState, useEffect } from "react";
import BarraLatEsq from "../../../ui/barralatesq";
import BarraLatDir from "../../../ui/barralatdir";
import { useRouter } from "next/navigation";

export default function CadastrarManutencao() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        mecanico: "",
        aviao: "",
        inicio_mnt: "",
        fim_mnt: "",
        descricao: "",
    });

    const [mecanicos, setMecanicos] = useState([]);
    const [avioes, setAvioes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mecanicosResponse] = await Promise.all([
                    fetch("/api/usuarios"),
                ]);

                const [avioesResponse] = await Promise.all([
                    fetch("/api/avioes"),
                ]);

                if (mecanicosResponse.ok) {
                    const mecanicosData = await mecanicosResponse.json();
                    setMecanicos(mecanicosData);
                } else {
                    console.error("Erro ao buscar mecânicos");
                }

                if (avioesResponse.ok) {
                    const avioesData = await avioesResponse.json();
                    setAvioes(avioesData);
                } else {
                    console.error("Erro ao buscar aviões");
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/manutencoes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mecanico: formData.mecanico,
                    aviao: formData.aviao,
                    descricao: formData.descricao,
                    inicio_mnt: formData.inicio_mnt,
                    fim_mnt: formData.fim_mnt || null,
                }),
            });

            console.log(response);

            if (response.ok) {
                alert("Manutenção cadastrada com sucesso!");
                router.push("/manutencao");
            } else {
                alert("Erro ao cadastrar manutenção!");
            }
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
            alert("Erro ao cadastrar manutenção!");
        }
    };

    const mecanicos_mnt = mecanicos.filter((mecanico: any) => mecanico.role === "Mecânico");

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq />
            <div className="flex flex-col gap-4 p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center overflow-scroll">
                <h1 className="self-start mb-4 text-lg font-bold">Cadastrar Manutenção</h1>
                {loading ? (
                    <p>Carregando dados...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="mb-4">
                            <label htmlFor="mecanico" className="block text-gray-600">Mecânico</label>
                            <select
                                id="mecanico"
                                name="mecanico"
                                value={formData.mecanico}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                required
                            >
                                <option value="">Selecione um mecânico</option>
                                {mecanicos_mnt.map((mecanico: any) => (
                                    <option key={mecanico.cpf} value={mecanico.cpf}>
                                        {mecanico.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="aviao" className="block text-gray-600">Avião</label>
                            <select
                                id="aviao"
                                name="aviao"
                                value={formData.aviao}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                required
                            >
                                <option value="">Selecione um avião</option>
                                {avioes.map((aviao: any) => (
                                    <option key={aviao.matricula} value={aviao.matricula}>
                                        {aviao.matricula}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="inicio_mnt" className="block text-gray-600">Início da Manutenção</label>
                            <input
                                id="inicio_mnt"
                                type="date"
                                name="inicio_mnt"
                                value={formData.inicio_mnt}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="fim_mnt" className="block text-gray-600">Fim da Manutenção</label>
                            <input
                                id="fim_mnt"
                                type="date"
                                name="fim_mnt"
                                value={formData.fim_mnt}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="descricao" className="block text-gray-600">Descrição do Problema</label>
                            <input
                                id="descricao"
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none"
                        >
                            Cadastrar
                        </button>
                    </form>
                )}
            </div>
            <BarraLatDir />
        </main>
    );
}

