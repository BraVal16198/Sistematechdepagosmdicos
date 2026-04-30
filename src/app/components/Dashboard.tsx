import { Users, Calendar, DollarSign, FileText } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { mes: 'Ene', citas: 45, ingresos: 12500 },
  { mes: 'Feb', citas: 52, ingresos: 14300 },
  { mes: 'Mar', citas: 61, ingresos: 16800 },
  { mes: 'Abr', citas: 58, ingresos: 15900 },
];

export function Dashboard() {
  const stats = [
    {
      title: 'Pacientes Registrados',
      value: '1,234',
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Citas del Mes',
      value: '58',
      icon: Calendar,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Ingresos Mensuales',
      value: 'S/ 15,900',
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '+15%'
    },
    {
      title: 'Facturas Emitidas',
      value: '42',
      icon: FileText,
      color: 'bg-purple-500',
      change: '+5%'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-card rounded-lg shadow p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-600 text-sm">{stat.change}</span>
              </div>
              <h3 className="text-muted-foreground text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl text-card-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg shadow p-6 border border-border">
          <h3 className="text-lg mb-4 text-card-foreground">Citas Mensuales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="citas" fill="#0284c7" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg shadow p-6 border border-border">
          <h3 className="text-lg mb-4 text-card-foreground">Ingresos Mensuales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ingresos" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow p-6 border border-border">
        <h3 className="text-lg mb-4 text-card-foreground">Citas Recientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground">Paciente</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Médico</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Fecha</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-3 px-4 text-card-foreground">Juan Pérez</td>
                <td className="py-3 px-4 text-card-foreground">Dr. García</td>
                <td className="py-3 px-4 text-card-foreground">30/04/2026 10:00</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    Completada
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-4 text-card-foreground">María López</td>
                <td className="py-3 px-4 text-card-foreground">Dr. Rodríguez</td>
                <td className="py-3 px-4 text-card-foreground">30/04/2026 14:00</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    Programada
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-4 text-card-foreground">Carlos Sánchez</td>
                <td className="py-3 px-4 text-card-foreground">Dr. García</td>
                <td className="py-3 px-4 text-card-foreground">29/04/2026 16:00</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    Completada
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
