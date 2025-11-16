import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

export default function BIGraphs() {
    const nomesData = [
        { nome: "João", buscas: 42 },
        { nome: "Maria", buscas: 38 },
        { nome: "Carlos", buscas: 33 },
        { nome: "Ana", buscas: 27 }
    ];

    const cepData = [
        { cep: "01310-000", buscas: 120 },
        { cep: "02045-001", buscas: 89 },
        { cep: "11035-200", buscas: 77 }
    ];

    const COLORS = ["#2563eb", "#3b82f6", "#60a5fa"]; // azul

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BARRAS */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Nomes mais buscados</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={nomesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nome" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                            dataKey="buscas"
                            fill="#2563eb"
                            label={{ position: 'top', fill: '#111', fontSize: 12 }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* PIZZA */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">CEPs mais buscados</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={cepData}
                            dataKey="buscas"
                            nameKey="cep"
                            outerRadius={90}
                            label={({ name, value }) => `${name}: ${value}`}
                        >
                            {cepData.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
