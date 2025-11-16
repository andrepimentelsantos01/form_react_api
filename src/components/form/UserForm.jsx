import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema } from "../../validation/UserSchema";

const MapView = lazy(() => import("../map/MapView"));

export default function UserForm({ savedData = {}, setSavedData }) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            nome: savedData.nome || "",
            sobrenome: savedData.sobrenome || "",
            cpf: savedData.cpf || "",
            email: savedData.email || "",
            cep: savedData.cep || "",
            logradouro: savedData.logradouro || "",
            bairro: savedData.bairro || "",
            cidade: savedData.cidade || "",
            estado: savedData.estado || "",
        },
    });

    const [coords, setCoords] = useState({
        lat: savedData.coords?.lat || null,
        lng: savedData.coords?.lng || null,
        endereco: savedData.coords?.endereco || "",
    });

    const cpfValue = watch("cpf") || "";
    const cepValue = watch("cep") || "";

    const stripNonDigits = (v = "") => v.replace(/\D/g, "");

    const formatCPF = (value) => {
        const digits = stripNonDigits(value).slice(0, 11);
        if (!digits) return "";
        const p1 = digits.slice(0, 3);
        const p2 = digits.slice(3, 6);
        const p3 = digits.slice(6, 9);
        const p4 = digits.slice(9, 11);
        if (digits.length <= 3) return p1;
        if (digits.length <= 6) return `${p1}.${p2}`;
        if (digits.length <= 9) return `${p1}.${p2}.${p3}`;
        return `${p1}.${p2}.${p3}-${p4}`;
    };

    const formatCEP = (value) => {
        const digits = stripNonDigits(value).slice(0, 8);
        if (!digits) return "";
        const p1 = digits.slice(0, 5);
        const p2 = digits.slice(5, 8);
        return digits.length <= 5 ? p1 : `${p1}-${p2}`;
    };

    const handleCPFChange = useCallback(
        (e) => setValue("cpf", formatCPF(e.target.value), { shouldValidate: true, shouldDirty: true }),
        [setValue]
    );

    const handleCEPChange = useCallback(
        (e) => setValue("cep", formatCEP(e.target.value), { shouldValidate: true, shouldDirty: true }),
        [setValue]
    );

    const buscarCoordenadas = useCallback(async (enderecoCompleto) => {
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.length > 0) {
                setCoords({
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                    endereco: enderecoCompleto,
                });
            } else {
                setCoords({ lat: null, lng: null, endereco: "" });
            }
        } catch (err) {
            console.error("Erro ao buscar coordenadas:", err);
            setCoords({ lat: null, lng: null, endereco: "" });
        }
    }, []);

    useEffect(() => {
        const rawCep = stripNonDigits(cepValue);
        if (rawCep.length === 8) {
            fetch(`https://viacep.com.br/ws/${rawCep}/json/`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.erro) {
                        setValue("logradouro", "");
                        setValue("bairro", "");
                        setValue("cidade", "");
                        setValue("estado", "");
                        setCoords({ lat: null, lng: null, endereco: "" });
                        return;
                    }
                    setValue("logradouro", data.logradouro || "");
                    setValue("bairro", data.bairro || "");
                    setValue("cidade", data.localidade || "");
                    setValue("estado", data.uf || "");

                    const enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                    buscarCoordenadas(enderecoCompleto);
                })
                .catch(() => setCoords({ lat: null, lng: null, endereco: "" }));
        }
    }, [cepValue, setValue, buscarCoordenadas]);

    const onSubmit = useCallback(
        (data) => {
            const onlyDigits = (v) => (v ? v.replace(/\D/g, "") : "");
            setSavedData((prev) => ({
                ...prev,
                ...data,
                cpf: onlyDigits(data.cpf),
                cep: onlyDigits(data.cep),
                coords,
            }));
            console.log("Dados validados:", data);
        },
        [coords, setSavedData]
    );

    return (
        <div className="max-w-5xl mx-auto p-4 flex flex-col lg:grid lg:grid-cols-2 gap-6 justify-center items-start">
            <div
                className={`flex-1 transition-transform transition-opacity ease-in-out duration-[5000ms] 
                    ${coords.lat ? "" : "mx-auto lg:col-span-2"} animate-fadeSlide appear`}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 grid gap-4 bg-white rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Formulário de Dados do Usuário</h2>

                    <div>
                        <label className="block font-medium mb-1">Nome</label>
                        <input {...register("nome")} className="w-full p-2 border rounded-md" placeholder="Digite seu nome" />
                        {errors.nome && <p className="text-red-600 text-sm mt-1">{errors.nome.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Sobrenome</label>
                        <input {...register("sobrenome")} className="w-full p-2 border rounded-md" placeholder="Digite seu sobrenome" />
                        {errors.sobrenome && <p className="text-red-600 text-sm mt-1">{errors.sobrenome.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">CPF</label>
                        <input {...register("cpf")} value={cpfValue} onChange={handleCPFChange} inputMode="numeric" className="w-full p-2 border rounded-md" placeholder="000.000.000-00" />
                        {errors.cpf && <p className="text-red-600 text-sm mt-1">{errors.cpf.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Email</label>
                        <input {...register("email")} className="w-full p-2 border rounded-md" placeholder="email@exemplo.com" />
                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">CEP</label>
                        <input {...register("cep")} value={cepValue} onChange={handleCEPChange} inputMode="numeric" className="w-full p-2 border rounded-md" placeholder="00000-000" />
                        {errors.cep && <p className="text-red-600 text-sm mt-1">{errors.cep.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Logradouro</label>
                        <input {...register("logradouro")} className="w-full p-2 border rounded-md bg-gray-100" readOnly />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Bairro</label>
                        <input {...register("bairro")} className="w-full p-2 border rounded-md bg-gray-100" readOnly />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Cidade</label>
                        <input {...register("cidade")} className="w-full p-2 border rounded-md bg-gray-100" readOnly />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Estado</label>
                        <input {...register("estado")} className="w-full p-2 border rounded-md bg-gray-100" readOnly />
                    </div>

                    <button type="submit" className="mt-4 w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition">
                        Enviar
                    </button>
                </form>
            </div>

            <div className={`flex-1 transition-transform transition-opacity ease-in-out duration-[5000ms] ${coords.lat ? "" : "mx-auto lg:col-span-2"} animate-fadeSlide appear`}>
                <Suspense fallback={<div className="p-6">Carregando mapa...</div>}>
                    {coords.lat && coords.lng && <MapView lat={coords.lat} lng={coords.lng} endereco={coords.endereco} />}
                </Suspense>
            </div>
        </div>
    );
}
