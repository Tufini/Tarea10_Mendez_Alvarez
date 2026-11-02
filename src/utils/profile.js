import { STUDENT } from '../data/account'

let perfil = {
  nombre: STUDENT.name,
  carrera: STUDENT.career,
  rol: '202673012-4',
  cuenta: {
    banco: 'Banco Estado',
    tipo: 'Cuenta RUT',
    ultimos4: '5678',
    titular: STUDENT.name
  }
}

export function getPerfil () {
  return perfil
}

export function actualizarPersonales (datos) {
  perfil = { ...perfil, ...datos }
}

export function actualizarCuenta (cuenta) {
  perfil = { ...perfil, cuenta }
}