"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Login() {
    const [cpf, setCpf] = useState("")
    const [senha, setSenha] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cpf, senha }),
            })

            if (!response.ok) {
                const data = await response.json()
                setError(data.error || "Erro desconhecido.")
                return
            }

            const data = await response.json()
            // Store the user's role and CPF in localStorage
            localStorage.setItem("userRole", data.usuario.role)
            localStorage.setItem("userCpf", data.usuario.cpf)
            router.push("/home")
        } catch (error) {
            console.error("Erro ao fazer login:", error)
            setError("Erro ao conectar ao servidor.")
        }
    }

    return (
        <body className="flex flex-col min-h-screen bg-slate-50 dark:bg-sky-900 justify-between">
            <header className="bg-sky-950 text-white top-0 z-10 shadow-lg">
                <section className="p-4 flex flex-row items-center gap-x-1.5">
                    <div>
                        <Image className="self-start" src="/logo.svg" width={48} height={48} alt="Logo da escola" />
                    </div>
                    <div>
                        <div className="text-3xl font-medium italic">FlyWeb®</div>
                        <div className="text-1xl font-medium">Escola de aviação</div>
                    </div>
                </section>
            </header>

            <main className="min-h-fit place-content-center my-20">
                <div
                    id="login-container"
                    className="shadow-xl mx-auto w-7/12 bg-sky-200 rounded-lg flex flex-row min-w-80 shadow-lg"
                >
                    <section id="imagem" className="flex shrink-0 w-[500px] hidden xl:block">
                        <Image
                            className="self-start max-w-2xl rounded-l-lg"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: "100%", height: "auto" }}
                            src="/aeroporto.svg"
                            alt="Desenho de aeroporto"
                        />
                    </section>

                    <section id="login" className="flex flex-col px-11 py-4 place-content-center mx-auto shrink-0">
                        <div id="login-text text-gray-600" className="text-3xl">
                            <strong className="text-black">Login</strong>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="cpf" className="block text-gray-600">
                                    CPF
                                </label>
                                <input
                                    type="text"
                                    id="cpf"
                                    name="cpf"
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 text-black bg-white"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="senha" className="block text-gray-600">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    id="senha"
                                    name="senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 text-black bg-white"
                                />
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
                            >
                                Login
                            </button>
                        </form>
                    </section>
                </div>
            </main>

            <footer id="footer" className="shadow-lg flex flex-row bg-sky-950 p-4 text-white text-xl justify-between">
                <div id="footer-one" className="flex flex-row items-center">
                    <div>
                        <Image src="/pin_endereco.svg" height={48} width={48} alt="Pin de endereço" />
                    </div>
                    <address className="flex flex-col">
                        <h2>
                            <strong>FlyWeb®</strong> Escola de Aviação
                        </h2>
                        Avenida do Aeroporto, 175
                        <br />
                        Bairro, São João del-Rei - MG
                        <br />
                    </address>
                </div>
                <div id="footer-two" className="flex flex-col justify-center flex-start">
                    <div>
                        E-mail: <a href="https://www.google.com">secretaria@flyweb.com.br</a>
                        <br />
                    </div>
                    <div>
                        Telefone: <a>(32) 3333-3031</a>
                    </div>
                </div>
            </footer>
        </body>
    )
}


