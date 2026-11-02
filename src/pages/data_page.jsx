import React, { useState } from 'react'
import { benefits, BENEFIT_STATES } from '../data/account'
import { getPerfil, actualizarPersonales, actualizarCuenta } from '../utils/profile'

const BANCOS = [
  'Banco Estado', 'Banco de Chile', 'Banco Santander', 'BCI', 'Scotiabank',
  'Banco Itaú', 'Banco Falabella', 'Banco Security', 'Banco BICE'
]
const TIPOS_CUENTA = ['Cuenta RUT', 'Cuenta vista', 'Cuenta corriente', 'Cuenta de ahorro']

function validarPersonales ({ nombre, carrera, rol }) {
  const errores = {}
  if (nombre.trim().length < 3) errores.nombre = 'Ingrese su nombre completo.'
  if (carrera.trim().length < 3) errores.carrera = 'Ingrese el nombre de su carrera.'
  if (!/^\d{9}-[\dkK]$/.test(rol.trim())) {
    errores.rol = 'El rol son 9 dígitos, un guion y un dígito verificador. Ej: 202673012-4'
  }
  return errores
}

function validarCuenta ({ banco, tipo, numero, titular }) {
  const errores = {}
  if (banco === '') errores.banco = 'Seleccione un banco.'
  if (tipo === '') errores.tipo = 'Seleccione el tipo de cuenta.'
  if (!/^\d{8,20}$/.test(numero)) errores.numero = 'El número de cuenta debe tener entre 8 y 20 dígitos.'
  if (titular.trim().length < 3) errores.titular = 'Ingrese el nombre del titular de la cuenta.'
  return errores
}

function resumirBecas (lista) {
  const grupos = []
  lista.forEach(b => {
    const nombre = b.concepto.split(' · ')[0]
    let g = grupos.find(x => x.nombre === nombre)
    if (!g) {
      g = { nombre, fuente: b.fuente, via: b.via, enProceso: false }
      grupos.push(g)
    }
    if (b.estado === 'en_proceso') g.enProceso = true
  })
  return grupos
}

function Campo ({ id, label, error, children }) {
  return (
    <div className='data-page__field'>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <p className='data-page__error' role='alert'>{error}</p>}
    </div>
  )
}

const claseInput = (error) => `data-page__input${error ? ' data-page__input--error' : ''}`

export default function DataPage () {
  const perfil = getPerfil()
  const [datos, setDatos] = useState({ nombre: perfil.nombre, carrera: perfil.carrera, rol: perfil.rol })
  const [cuenta, setCuenta] = useState(perfil.cuenta)

  const [editPers, setEditPers] = useState(false)
  const [borradorPers, setBorradorPers] = useState(datos)
  const [errPers, setErrPers] = useState({})
  const [msgPers, setMsgPers] = useState('')

  const [editCta, setEditCta] = useState(false)
  const [borradorCta, setBorradorCta] = useState({ banco: '', tipo: '', numero: '', titular: '' })
  const [errCta, setErrCta] = useState({})
  const [msgCta, setMsgCta] = useState('')

  const misBecas = resumirBecas(benefits)

  function abrirPersonales () {
    setBorradorPers(datos)
    setErrPers({})
    setMsgPers('')
    setEditPers(true)
  }

  function guardarPersonales (e) {
    e.preventDefault()
    const errores = validarPersonales(borradorPers)
    if (Object.keys(errores).length > 0) {
      setErrPers(errores)
      return
    }
    const nuevos = {
      nombre: borradorPers.nombre.trim(),
      carrera: borradorPers.carrera.trim(),
      rol: borradorPers.rol.trim().toUpperCase()
    }
    actualizarPersonales(nuevos)
    setDatos(nuevos)
    setEditPers(false)
    setMsgPers('Datos personales actualizados.')
  }

  function abrirCuenta () {
    setBorradorCta({ banco: cuenta.banco, tipo: cuenta.tipo, numero: '', titular: cuenta.titular })
    setErrCta({})
    setMsgCta('')
    setEditCta(true)
  }

  function guardarCuenta (e) {
    e.preventDefault()
    const errores = validarCuenta(borradorCta)
    if (Object.keys(errores).length > 0) {
      setErrCta(errores)
      return
    }

    const nueva = {
      banco: borradorCta.banco,
      tipo: borradorCta.tipo,
      ultimos4: borradorCta.numero.slice(-4),
      titular: borradorCta.titular.trim()
    }
    actualizarCuenta(nueva)
    setCuenta(nueva)
    setEditCta(false)
    setMsgCta(`Cuenta actualizada: ${nueva.banco}, ${nueva.tipo.toLowerCase()}, terminada en ${nueva.ultimos4}.`)
  }

  return (
    <section className='data-page'>
      <h1 className='data-page__title'>Mis datos</h1>

      <div className='data-page__section-head'>
        <h2 className='data-page__subtitle'>Datos personales</h2>
        {!editPers && (
          <button type='button' className='data-page__button data-page__button--ghost' onClick={abrirPersonales}>
            Editar
          </button>
        )}
      </div>

      {msgPers && <p className='data-page__success' role='status'>{msgPers}</p>}

      {!editPers && (
        <dl className='data-page__list'>
          <div className='data-page__row'><dt>Nombre</dt><dd>{datos.nombre}</dd></div>
          <div className='data-page__row'><dt>Carrera</dt><dd>{datos.carrera}</dd></div>
          <div className='data-page__row'><dt>Rol</dt><dd>{datos.rol}</dd></div>
        </dl>
      )}

      {editPers && (
        <form className='data-page__form' onSubmit={guardarPersonales} noValidate>
          <Campo id='p-nombre' label='Nombre' error={errPers.nombre}>
            <input
              id='p-nombre'
              className={claseInput(errPers.nombre)}
              value={borradorPers.nombre}
              onChange={e => setBorradorPers({ ...borradorPers, nombre: e.target.value })}
            />
          </Campo>
          <Campo id='p-carrera' label='Carrera' error={errPers.carrera}>
            <input
              id='p-carrera'
              className={claseInput(errPers.carrera)}
              value={borradorPers.carrera}
              onChange={e => setBorradorPers({ ...borradorPers, carrera: e.target.value })}
            />
          </Campo>
          <Campo id='p-rol' label='Rol' error={errPers.rol}>
            <input
              id='p-rol'
              className={claseInput(errPers.rol)}
              value={borradorPers.rol}
              onChange={e => setBorradorPers({ ...borradorPers, rol: e.target.value })}
              placeholder='202673012-4'
            />
          </Campo>
          <div className='data-page__actions'>
            <button type='submit' className='data-page__button'>Guardar cambios</button>
            <button type='button' className='data-page__button data-page__button--ghost' onClick={() => setEditPers(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className='data-page__section-head'>
        <h2 className='data-page__subtitle'>Cuenta donde recibes tus becas</h2>
        {!editCta && (
          <button type='button' className='data-page__button data-page__button--ghost' onClick={abrirCuenta}>
            Editar
          </button>
        )}
      </div>
      <p className='data-page__note'>Tu beca de ayudantía se deposita en esta cuenta bancaria.</p>

      {msgCta && <p className='data-page__success' role='status'>{msgCta}</p>}

      {!editCta && (
        <dl className='data-page__list'>
          <div className='data-page__row'><dt>Banco</dt><dd>{cuenta.banco}</dd></div>
          <div className='data-page__row'><dt>Tipo de cuenta</dt><dd>{cuenta.tipo}</dd></div>
          <div className='data-page__row'><dt>N.º de cuenta</dt><dd>•••• {cuenta.ultimos4}</dd></div>
          <div className='data-page__row'><dt>Titular</dt><dd>{cuenta.titular}</dd></div>
        </dl>
      )}

      {editCta && (
        <form className='data-page__form' onSubmit={guardarCuenta} noValidate>
          <Campo id='c-banco' label='Banco' error={errCta.banco}>
            <select
              id='c-banco'
              className={claseInput(errCta.banco)}
              value={borradorCta.banco}
              onChange={e => setBorradorCta({ ...borradorCta, banco: e.target.value })}
            >
              <option value=''>Seleccione un banco</option>
              {BANCOS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </Campo>
          <Campo id='c-tipo' label='Tipo de cuenta' error={errCta.tipo}>
            <select
              id='c-tipo'
              className={claseInput(errCta.tipo)}
              value={borradorCta.tipo}
              onChange={e => setBorradorCta({ ...borradorCta, tipo: e.target.value })}
            >
              <option value=''>Seleccione el tipo</option>
              {TIPOS_CUENTA.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Campo>
          <Campo id='c-numero' label='Número de cuenta' error={errCta.numero}>
            <input
              id='c-numero'
              className={claseInput(errCta.numero)}
              value={borradorCta.numero}
              onChange={e => setBorradorCta({ ...borradorCta, numero: e.target.value.replace(/\D/g, '').slice(0, 20) })}
              inputMode='numeric'
              placeholder='Ej: 12345678'
              autoComplete='off'
            />
          </Campo>
          <Campo id='c-titular' label='Titular de la cuenta' error={errCta.titular}>
            <input
              id='c-titular'
              className={claseInput(errCta.titular)}
              value={borradorCta.titular}
              onChange={e => setBorradorCta({ ...borradorCta, titular: e.target.value })}
            />
          </Campo>
          <p className='data-page__note'>
            Ingrese el número completo. Por seguridad solo mostramos los últimos 4 dígitos.
          </p>
          <div className='data-page__actions'>
            <button type='submit' className='data-page__button'>Guardar cuenta</button>
            <button type='button' className='data-page__button data-page__button--ghost' onClick={() => setEditCta(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <h2 className='data-page__subtitle'>Becas y beneficios que tienes</h2>
      <ul className='data-page__benefits'>
        {misBecas.map(b => {
          const estado = b.enProceso ? BENEFIT_STATES.en_proceso : { label: 'Activa', tone: 'ok' }
          return (
            <li key={b.nombre} className='data-page__benefit'>
              <div className='data-page__benefit-head'>
                <strong>{b.nombre}</strong>
                <span className={`data-page__badge data-page__badge--${estado.tone}`}>{estado.label}</span>
              </div>
              <p className='data-page__benefit-line'>{b.fuente} · {b.via}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}