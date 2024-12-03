import clsx from "clsx";
import Image from "next/image";

export default function BarraLatDir({ entidade }: { entidade: any }) {
    return (
        <div key="bld" className="w-1/6 h-full rounded-lg flex flex-col bg-sky-950">
            <div key="voando" className={clsx(
                {
                    "flex flex-col bg-sky-700": entidade === 'aluno' && entidade === 'instrutor' && entidade === 'mecanico',
                    "flex flex-col bg-sky-900": entidade === 'secretaria'
                }
            )}>

            </div>
            <div key="proximos" className="">

            </div>
            <div key="avioes_hangar" className="">

            </div>
        </div>
    );
}
