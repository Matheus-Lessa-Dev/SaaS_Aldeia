import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import "./Calendario.css";

function Calendario() {
    const [selected, setSelected] = useState<Date | undefined>(undefined);

    return (
        <DayPicker
            mode="single"
            locale={ptBR}
            selected={selected}
            onSelect={(date) => setSelected(date)}
        />
    );
}

export default Calendario;