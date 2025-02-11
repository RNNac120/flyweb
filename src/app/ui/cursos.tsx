import ModuloAulas from "./row_modulos";

export default function CursoPage({ curso }) {
    return (
        <div className="p-8 bg-sky-200 min-h-screen flex flex-col items-start">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{curso.nome_curso}</h1>

            <div className="space-y-6 w-full">
                {curso.modulos.length > 0 ? (
                    curso.modulos.map((modulo) => (
                        <div key={modulo.id_modulo} className="w-full">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                                Módulo {modulo.id_modulo}: {modulo.tipo_modulo}
                            </h2>
                            <ModuloAulas modulo={modulo} />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-700 text-lg">Nenhum módulo disponível</p>
                )}
            </div>
        </div>
    );
}

