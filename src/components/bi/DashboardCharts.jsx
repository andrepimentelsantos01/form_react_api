import React, { useState, useMemo } from "react";
import clsx from "clsx";
import {
    LineChart, Line, BarChart, Bar,
    PieChart, Pie, Cell, CartesianGrid,
    XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";

export default function DashboardCharts() {
    const rootBg = "bg-gray-100 text-gray-900";
    const cardBg = "bg-white border border-gray-200";
    const COLORS = ["#60a5fa", "#7c3aed", "#e879f9", "#06b6d4", "#facc15", "#f87171"];

    // MOCK de usuários
    const usersMock = [
        { nome: "Alice", cidade: "São Paulo", estado: "SP", ativo: true, mesCadastro: "Jan" },
        { nome: "Bob", cidade: "Rio de Janeiro", estado: "RJ", ativo: false, mesCadastro: "Jan" },
        { nome: "Carol", cidade: "Belo Horizonte", estado: "MG", ativo: true, mesCadastro: "Fev" },
        { nome: "David", cidade: "São Paulo", estado: "SP", ativo: true, mesCadastro: "Mar" },
        { nome: "Eve", cidade: "Curitiba", estado: "PR", ativo: false, mesCadastro: "Abr" },
        { nome: "Frank", cidade: "Porto Alegre", estado: "RS", ativo: true, mesCadastro: "Mai" },
        { nome: "Grace", cidade: "Rio de Janeiro", estado: "RJ", ativo: true, mesCadastro: "Jun" },
        { nome: "Hugo", cidade: "Salvador", estado: "BA", ativo: false, mesCadastro: "Jun" },
        { nome: "Ivy", cidade: "Fortaleza", estado: "CE", ativo: true, mesCadastro: "Jul" },
        { nome: "Jack", cidade: "Recife", estado: "PE", ativo: true, mesCadastro: "Jul" },
    ];

    const [filtroCidade, setFiltroCidade] = useState("Todas");
    const [filtroStatus, setFiltroStatus] = useState("Todos");
    const [filtroMes, setFiltroMes] = useState("Todos");

    // Filtragem dinâmica
    const usuariosFiltrados = useMemo(() => {
        return usersMock.filter(u =>
            (filtroCidade === "Todas" || u.cidade === filtroCidade) &&
            (filtroStatus === "Todos" || (filtroStatus === "Ativos" ? u.ativo : !u.ativo)) &&
            (filtroMes === "Todos" || u.mesCadastro === filtroMes)
        );
    }, [filtroCidade, filtroStatus, filtroMes]);

    const totalUsuarios = usuariosFiltrados.length;
    const usuariosAtivos = usuariosFiltrados.filter(u => u.ativo).length;
    const usuariosInativos = totalUsuarios - usuariosAtivos;

    const usersByCity = useMemo(() => {
        const map = {};
        usuariosFiltrados.forEach(u => map[u.cidade] = (map[u.cidade] || 0) + 1);
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [usuariosFiltrados]);

    const usersByState = useMemo(() => {
        const map = {};
        usuariosFiltrados.forEach(u => map[u.estado] = (map[u.estado] || 0) + 1);
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [usuariosFiltrados]);

    const usersByMonth = useMemo(() => {
        const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul"];
        return months.map(m => ({
            month: m,
            users: usuariosFiltrados.filter(u => u.mesCadastro === m).length
        }));
    }, [usuariosFiltrados]);

    // Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    // Filtros únicos para selects
    const cidades = ["Todas", ...new Set(usersMock.map(u => u.cidade))];
    const statusOptions = ["Todos", "Ativos", "Inativos"];
    const meses = ["Todos", "Jan","Fev","Mar","Abr","Mai","Jun","Jul"];

    return (
        <div className={clsx("min-h-screen p-6", rootBg)}>
            <h1 className="text-2xl font-bold mb-4">Dashboard de Usuários</h1>

            {/* FILTROS */}
            <div className="flex flex-wrap gap-4 mb-6">
                <select className="p-2 border rounded" value={filtroCidade} onChange={e => setFiltroCidade(e.target.value)}>
                    {cidades.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="p-2 border rounded" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="p-2 border rounded" value={filtroMes} onChange={e => setFiltroMes(e.target.value)}>
                    {meses.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>

            {/* CARDS */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" variants={containerVariants} initial="hidden" animate="show">
                {[
                    { title: "Total de Usuários", value: totalUsuarios, color: "bg-blue-500" },
                    { title: "Usuários Ativos", value: usuariosAtivos, color: "bg-green-500" },
                    { title: "Usuários Inativos", value: usuariosInativos, color: "bg-red-500" },
                    { title: "Cidades Representadas", value: usersByCity.length, color: "bg-purple-500" },
                ].map((c, i) => (
                    <motion.div key={i} variants={cardVariants} className={clsx(cardBg, "rounded-xl p-4 shadow-md")}>
                        <p className="text-sm mb-1">{c.title}</p>
                        <p className="text-2xl font-bold">{c.value}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* GRÁFICOS */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants} initial="hidden" animate="show">
                {/* Bar Chart por Cidade */}
                <motion.div variants={cardVariants} className={clsx(cardBg, "p-4 rounded-xl shadow-sm")}>
                    <h3 className="text-sm font-medium mb-2">Usuários por Cidade</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={usersByCity}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip />
                            <Bar dataKey="value" fill="#60a5fa" label={{ position: "top" }} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Pie Chart por Estado */}
                <motion.div variants={cardVariants} className={clsx(cardBg, "p-4 rounded-xl shadow-sm")}>
                    <h3 className="text-sm font-medium mb-2">Usuários por Estado</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={usersByState} dataKey="value" nameKey="name" outerRadius={80} innerRadius={30} label>
                                {usersByState.map((entry, idx) => (
                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Line Chart de Crescimento */}
                <motion.div variants={cardVariants} className={clsx(cardBg, "p-4 rounded-xl shadow-sm md:col-span-2")}>
                    <h3 className="text-sm font-medium mb-2">Crescimento Mensal de Usuários</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={usersByMonth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="month" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="users" stroke="#06b6d4" strokeWidth={2} dot label />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </motion.div>
        </div>
    );
}
