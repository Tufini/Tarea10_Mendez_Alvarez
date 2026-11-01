// Datos ficticios pero realistas, basados en el portal autoservicio.usm.cl
// (códigos, descripciones, montos de arancel/matrícula y becas de ayudantía).
// La "fecha de hoy" del prototipo es fija para que los estados sean predecibles.

export const TODAY = '2026-10-31'

export const STUDENT = {
  name: 'Alejandro González',
  firstName: 'Alejandro',
  career: 'Ingeniería Civil Informática',
  profile: 'Pregrado diurno · CAE parcial'
}

export const PERIODS = [
  { id: '202620', label: '2.º semestre 2026', short: '2026-2', current: true },
  { id: '202610', label: '1.er semestre 2026', short: '2026-1', current: false },
  { id: '202520', label: '2.º semestre 2025', short: '2025-2', current: false }
]

export const periodById = (id) => PERIODS.find((p) => p.id === id)

// Semestre "pasado" respecto de TODAY (el que se pregunta en la Tarea 3).
export const LAST_PERIOD_ID = '202610'

const raw = [
  // 2.º semestre 2025
  { periodo: '202520', fecha: '2025-08-12', codigo: '1773', descripcion: 'Arancel pregrado diurno Ing. Civil Informática', tipo: 'cargo', monto: 3140000 },
  { periodo: '202520', fecha: '2025-08-12', codigo: 'MTRD', descripcion: 'Matrícula pregrado diurno', tipo: 'cargo', monto: 130000 },
  { periodo: '202520', fecha: '2025-09-04', codigo: 'MORA', descripcion: 'Interés de mora', tipo: 'cargo', monto: 325 },
  { periodo: '202520', fecha: '2025-09-04', codigo: 'POTC', descripcion: 'Pago tarjeta de crédito', tipo: 'pago', medio: 'Tarjeta de crédito', monto: 3270325, recibo: '790112' },
  // 1.er semestre 2026
  { periodo: '202610', fecha: '2026-01-14', codigo: 'MTRD', descripcion: 'Matrícula pregrado diurno', tipo: 'cargo', monto: 137500 },
  { periodo: '202610', fecha: '2026-01-14', codigo: '1773', descripcion: 'Arancel pregrado diurno Ing. Civil Informática', tipo: 'cargo', monto: 3245000 },
  { periodo: '202610', fecha: '2026-03-20', codigo: 'CAE1', descripcion: 'Abono CAE (Comisión Ingresa)', tipo: 'pago', medio: 'CAE', monto: 1622500, recibo: '806571' },
  { periodo: '202610', fecha: '2026-03-24', codigo: 'POTC', descripcion: 'Pago tarjeta de crédito', tipo: 'pago', medio: 'Tarjeta de crédito', monto: 717956, recibo: '806580' },
  { periodo: '202610', fecha: '2026-04-29', codigo: 'MORA', descripcion: 'Interés de mora', tipo: 'cargo', monto: 504 },
  { periodo: '202610', fecha: '2026-04-29', codigo: 'POTC', descripcion: 'Pago tarjeta de crédito', tipo: 'pago', medio: 'Tarjeta de crédito', monto: 718048, recibo: '815354' },
  { periodo: '202610', fecha: '2026-05-20', codigo: 'POTC', descripcion: 'Pago tarjeta de crédito', tipo: 'pago', medio: 'Tarjeta de crédito', monto: 324500, recibo: '819637' },
  // 2.º semestre 2026 (en curso)
  { periodo: '202620', fecha: '2026-08-14', codigo: '1773', descripcion: 'Arancel pregrado diurno Ing. Civil Informática', tipo: 'cargo', monto: 3245000 },
  { periodo: '202620', fecha: '2026-08-28', codigo: 'CAE1', descripcion: 'Abono CAE (Comisión Ingresa)', tipo: 'pago', medio: 'CAE', monto: 1622500, recibo: '827001' },
  { periodo: '202620', fecha: '2026-09-05', codigo: 'MORA', descripcion: 'Interés de mora', tipo: 'cargo', monto: 1082 },
  { periodo: '202620', fecha: '2026-09-05', codigo: 'POTC', descripcion: 'Pago tarjeta de crédito', tipo: 'pago', medio: 'Tarjeta de crédito', monto: 325582, recibo: '835421' },
  { periodo: '202620', fecha: '2026-09-28', codigo: 'POTC', descripcion: 'Pago tarjeta de crédito', tipo: 'pago', medio: 'Tarjeta de crédito', monto: 324500, recibo: '838102' }
]

// El saldo de cada fila es la deuda total acumulada después de ese movimiento.
let running = 0
export const movements = raw.map((m, index) => {
  running += m.tipo === 'cargo' ? m.monto : -m.monto
  return { ...m, id: `mov-${index + 1}`, saldo: running }
})

export const currentBalance = running

// Cuotas del arancel 2026-2 que aún no se pagan (suman exactamente el saldo).
export const pendingInstallments = [
  { id: 'cuota-oct', descripcion: 'Cuota arancel 2026-2 (3 de 5)', vencimiento: '2026-10-31', monto: 324500 },
  { id: 'cuota-nov', descripcion: 'Cuota arancel 2026-2 (4 de 5)', vencimiento: '2026-11-30', monto: 324500 },
  { id: 'cuota-dic', descripcion: 'Cuota arancel 2026-2 (5 de 5)', vencimiento: '2026-12-31', monto: 324500 }
]

// Becas y beneficios (H1)
export const BENEFIT_SOURCES = [
  { id: 'todos', label: 'Todos' },
  { id: 'USM', label: 'USM' },
  { id: 'CAE', label: 'CAE' },
  { id: 'Mineduc', label: 'Mineduc / Junaeb' }
]

export const benefits = [
  { id: 'b-1', fuente: 'USM', concepto: 'Beca de Ayudantía', mes: 'Octubre 2026', monto: 95250, fecha: '2026-10-28', estado: 'recibido', via: 'Depósito directo a tu cuenta bancaria', detalle: 'Pago mensual por tu ayudantía. Llegó a la cuenta bancaria que tienes registrada.' },
  { id: 'b-2', fuente: 'CAE', concepto: 'CAE · 2.º semestre 2026', mes: 'Agosto 2026', monto: 1622500, fecha: '2026-08-28', estado: 'recibido', via: 'Abono directo al arancel', detalle: 'La Comisión Ingresa pagó una parte de tu arancel. No llega a tu bolsillo: se descuenta de tu deuda.', recibo: '827001', periodo: '202620' },
  { id: 'b-3', fuente: 'Mineduc', concepto: 'Beca de Mantención (Junaeb)', mes: 'Octubre 2026', monto: null, fecha: null, estado: 'en_proceso', via: 'Transferencia Junaeb', detalle: 'Junaeb todavía no informa el pago de este mes a la universidad. Última revisión: 20-oct-2026. Si pasan 10 días hábiles más, puedes reportar una diferencia.' },
  { id: 'b-4', fuente: 'USM', concepto: 'Beca de Ayudantía', mes: 'Septiembre 2026', monto: 95250, fecha: '2026-09-25', estado: 'recibido', via: 'Depósito directo a tu cuenta bancaria', detalle: 'Pago mensual por tu ayudantía.' },
  { id: 'b-5', fuente: 'USM', concepto: 'Beca de Ayudantía', mes: 'Agosto 2026', monto: 95250, fecha: '2026-08-26', estado: 'recibido', via: 'Depósito directo a tu cuenta bancaria', detalle: 'Pago mensual por tu ayudantía.' },
  { id: 'b-6', fuente: 'USM', concepto: 'Beca de Ayudantía', mes: 'Noviembre 2026', monto: 95250, fecha: '2026-11-26', estado: 'programado', via: 'Depósito directo a tu cuenta bancaria', detalle: 'Fecha estimada de depósito. Si no llega ese día, te avisaremos aquí.' },
  { id: 'b-7', fuente: 'USM', concepto: 'Beca de Ayudantía', mes: 'Junio 2026', monto: 95250, fecha: '2026-06-25', estado: 'recibido', via: 'Depósito directo a tu cuenta bancaria', detalle: 'Pago mensual por tu ayudantía.' },
  { id: 'b-8', fuente: 'USM', concepto: 'Beca de Ayudantía', mes: 'Mayo 2026', monto: 95250, fecha: '2026-05-27', estado: 'recibido', via: 'Depósito directo a tu cuenta bancaria', detalle: 'Pago mensual por tu ayudantía.' },
  { id: 'b-9', fuente: 'CAE', concepto: 'CAE · 1.er semestre 2026', mes: 'Marzo 2026', monto: 1622500, fecha: '2026-03-20', estado: 'recibido', via: 'Abono directo al arancel', detalle: 'La Comisión Ingresa pagó una parte de tu arancel. Se descontó de tu deuda.', recibo: '806571', periodo: '202610' }
]

export const BENEFIT_STATES = {
  recibido: { label: 'Recibido', tone: 'ok' },
  programado: { label: 'Programado', tone: 'info' },
  en_proceso: { label: 'En proceso', tone: 'warn' }
}
