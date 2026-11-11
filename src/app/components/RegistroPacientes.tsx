import { useState } from 'react';
import { Save, UserPlus, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Paciente {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  email: string;
  direccion: string;
  grupoSanguineo: string;
  alergias: string;
}

export function RegistroPacientes() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    genero: 'masculino',
    telefono: '',
    email: '',
    direccion: '',
    grupoSanguineo: 'O+',
    alergias: ''
  });

  const [pacientes, setPacientes] = useState<Paciente[]>([
    {
      id: 1,
      dni: '12345678',
      nombres: 'Juan Carlos',
      apellidos: 'Pérez García',
      fechaNacimiento: '1985-05-15',
      genero: 'masculino',
      telefono: '987654321',
      email: 'juan.perez@email.com',
      direccion: 'Av. Principal 123',
      grupoSanguineo: 'O+',
      alergias: 'Penicilina'
    },
    {
      id: 2,
      dni: '87654321',
      nombres: 'María Elena',
      apellidos: 'López Rodríguez',
      fechaNacimiento: '1990-08-22',
      genero: 'femenino',
      telefono: '912345678',
      email: 'maria.lopez@email.com',
      direccion: 'Jr. Comercio 456',
      grupoSanguineo: 'A+',
      alergias: 'Ninguna'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoPaciente: Paciente = {
      id: pacientes.length + 1,
      ...formData
    };
    setPacientes([...pacientes, nuevoPaciente]);
    toast.success('Paciente registrado');
    setFormData({
      dni: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: '',
      genero: 'masculino',
      telefono: '',
      email: '',
      direccion: '',
      grupoSanguineo: 'O+',
      alergias: '',
    });
    setMostrarFormulario(false);
  };

  const pacientesFiltrados = pacientes.filter(p =>
    p.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.dni.includes(busqueda)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-foreground mb-2">Registro de Pacientes</h2>
          <p className="text-muted-foreground">Gestión de información de pacientes</p>
        </div>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <UserPlus className="w-5 h-5" />
          Nuevo Paciente
        </button>
      </div>

      {mostrarFormulario && (
        <div className="bg-card rounded-lg shadow p-6 border border-border">
          <h3 className="text-lg mb-4 text-card-foreground">Nuevo Paciente</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-card-foreground">DNI</label>
              <input
                type="text"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-card-foreground">Nombres</label>
              <input
                type="text"
                value={formData.nombres}
                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-card-foreground">Apellidos</label>
              <input
                type="text"
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-card-foreground">Fecha de Nacimiento</label>
              <input
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-card-foreground">Género</label>
              <select
                value={formData.genero}
                onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 text-card-foreground">Teléfono</label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-card-foreground">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-card-foreground">Grupo Sanguíneo</label>
              <select
                value={formData.grupoSanguineo}
                onChange={(e) => setFormData({ ...formData, grupoSanguineo: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-card-foreground">Dirección</label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-card-foreground">Alergias</label>
              <textarea
                value={formData.alergias}
                onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
              />
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Save className="w-5 h-5" />
                Guardar Paciente
              </button>
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                className="px-6 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card rounded-lg shadow p-6 border border-border">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, apellido o DNI..."
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground">DNI</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Nombre Completo</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Teléfono</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Email</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Grupo Sanguíneo</th>
              </tr>
            </thead>
            <tbody>
              {pacientesFiltrados.map((paciente) => (
                <tr key={paciente.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4 text-card-foreground">{paciente.dni}</td>
                  <td className="py-3 px-4 text-card-foreground">
                    {paciente.nombres} {paciente.apellidos}
                  </td>
                  <td className="py-3 px-4 text-card-foreground">{paciente.telefono}</td>
                  <td className="py-3 px-4 text-card-foreground">{paciente.email}</td>
                  <td className="py-3 px-4 text-card-foreground">{paciente.grupoSanguineo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
