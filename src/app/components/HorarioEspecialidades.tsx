import { Check, X } from 'lucide-react';

interface HorarioCita {
  hora: string;
  ocupado: boolean;
  paciente?: string;
}

export function HorarioEspecialidades() {
  const especialidades = [
    {
      nombre: 'Medicina General',
      medico: 'Dr. García',
      horarios: [
        { hora: '08:00', ocupado: false },
        { hora: '09:00', ocupado: true, paciente: 'Ana Torres' },
        { hora: '10:00', ocupado: true, paciente: 'Juan Pérez' },
        { hora: '11:00', ocupado: false },
        { hora: '12:00', ocupado: false },
        { hora: '14:00', ocupado: false },
        { hora: '15:00', ocupado: true, paciente: 'María López' },
        { hora: '16:00', ocupado: false },
        { hora: '17:00', ocupado: false },
        { hora: '18:00', ocupado: false },
      ]
    },
    {
      nombre: 'Cardiología',
      medico: 'Dr. Rodríguez',
      horarios: [
        { hora: '08:00', ocupado: false },
        { hora: '09:00', ocupado: false },
        { hora: '10:00', ocupado: true, paciente: 'Carlos Sánchez' },
        { hora: '11:00', ocupado: false },
        { hora: '12:00', ocupado: false },
        { hora: '14:00', ocupado: true, paciente: 'María López' },
        { hora: '15:00', ocupado: false },
        { hora: '16:00', ocupado: false },
        { hora: '17:00', ocupado: true, paciente: 'Pedro Gómez' },
        { hora: '18:00', ocupado: false },
      ]
    },
    {
      nombre: 'Pediatría',
      medico: 'Dra. Martínez',
      horarios: [
        { hora: '08:00', ocupado: true, paciente: 'Sofía Ramírez' },
        { hora: '09:00', ocupado: true, paciente: 'Lucas Torres' },
        { hora: '10:00', ocupado: false },
        { hora: '11:00', ocupado: false },
        { hora: '12:00', ocupado: false },
        { hora: '14:00', ocupado: false },
        { hora: '15:00', ocupado: false },
        { hora: '16:00', ocupado: true, paciente: 'Emma Díaz' },
        { hora: '17:00', ocupado: false },
        { hora: '18:00', ocupado: false },
      ]
    },
    {
      nombre: 'Traumatología',
      medico: 'Dr. Silva',
      horarios: [
        { hora: '08:00', ocupado: false },
        { hora: '09:00', ocupado: false },
        { hora: '10:00', ocupado: false },
        { hora: '11:00', ocupado: true, paciente: 'Roberto Pérez' },
        { hora: '12:00', ocupado: false },
        { hora: '14:00', ocupado: false },
        { hora: '15:00', ocupado: false },
        { hora: '16:00', ocupado: false },
        { hora: '17:00', ocupado: false },
        { hora: '18:00', ocupado: false },
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl text-foreground mb-2">Horarios por Especialidad</h2>
        <p className="text-muted-foreground">Vista de disponibilidad por hora</p>
      </div>

      <div className="space-y-6">
        {especialidades.map((esp, index) => (
          <div key={index} className="bg-card rounded-lg shadow p-6 border border-border">
            <div className="mb-4">
              <h3 className="text-lg text-card-foreground">{esp.nombre}</h3>
              <p className="text-sm text-muted-foreground">{esp.medico}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2">
              {esp.horarios.map((horario, idx) => (
                <div
                  key={idx}
                  className={`relative p-3 rounded-lg border-2 transition-all ${
                    horario.ocupado
                      ? 'bg-red-50 border-red-300'
                      : 'bg-green-50 border-green-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{horario.hora}</span>
                    {horario.ocupado ? (
                      <X className="w-4 h-4 text-red-600" />
                    ) : (
                      <Check className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="text-xs">
                    {horario.ocupado ? (
                      <span className="text-red-700">{horario.paciente}</span>
                    ) : (
                      <span className="text-green-700">Libre</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-50 border-2 border-green-300 rounded"></div>
                <span className="text-muted-foreground">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-50 border-2 border-red-300 rounded"></div>
                <span className="text-muted-foreground">Ocupado</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
