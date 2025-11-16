import { useState } from "react";
import UserForm from "./components/form/UserForm";
import DashboardCharts from "./components/bi/DashboardCharts";
import clsx from "clsx";

export default function App() {
    const [tab, setTab] = useState("form");

    const [savedData, setSavedData] = useState({
        nome: "",
        sobrenome: "",
        cpf: "",
        email: "",
        cep: "",
        logradouro: "",
        bairro: "",
        cidade: "",
        estado: "",
        coords: {
            lat: null,
            lng: null,
            endereco: "",
        },
    });

    return (
        <div className="min-h-screen flex flex-col">
            {/* NAVBAR DE ABAS */}
            <div className="flex gap-4 p-6 bg-white shadow-md dark:bg-[#071022]">
                <button
                    onClick={() => setTab("form")}
                    className={clsx(
                        "px-4 py-2 rounded-lg shadow-md transition",
                        tab === "form"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-[#081827] dark:text-slate-200"
                    )}
                >
                    Formulário
                </button>

                <button
                    onClick={() => setTab("bi")}
                    className={clsx(
                        "px-4 py-2 rounded-lg shadow-md transition",
                        tab === "bi"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-[#081827] dark:text-slate-200"
                    )}
                >
                    BI & Analytics
                </button>
            </div>

            {/* CONTEÚDO */}
            <div className="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-[#071022] transition-all duration-300">
                {tab === "form" && (
                    <UserForm savedData={savedData} setSavedData={setSavedData} />
                )}
                {tab === "bi" && <DashboardCharts />}
            </div>
        </div>
    );
}
