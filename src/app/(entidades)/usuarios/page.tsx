import BarraLateralEsq from "@/app/ui/barralatesq";
import BarraLateralDir from "@/app/ui/barralatdir";
import Meio from "@/app/ui/meio";

export default function PaginaEntidade({ entidade }: { entidade: any }) {
    return (
        <BarraLateralEsq className={entidade}/>
        <Meio className={entidade}/>
        <BarraLateralDir className={entidade}/>
    );
}
