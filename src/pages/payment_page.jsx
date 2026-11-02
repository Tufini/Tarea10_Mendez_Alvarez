import React, { useState } from 'react'
import { pendingInstallments } from '../data/account'
import { formatMoney } from '../utils/format'

const MEDIOS = [
  { id: 'tarjeta', label: 'Tarjetas', sublabel: 'Débito, Crédito o Prepago' },
  { id: 'transferencia', label: 'OnePay', sublabel: 'y otras billeteras digitales' }
]

function formatoFecha (iso) {
  const [AAAA, MM, DD] = iso.split('-')
  return `${DD}-${MM}-${AAAA}`
}

// Reparte un monto entre las cuotas, de la más antigua a la más nueva
function coberturaPago (cuotas, monto) {
  let restante = monto
  return cuotas.map(c => {
    const aplicado = Math.min(c.monto, restante)
    restante -= aplicado
    return { ...c, aplicado, pendiente: c.monto - aplicado }
  })
}

// Cuotas ordenadas por fecha de vencimiento (la más antigua primero)
const cuotas = [...pendingInstallments].sort((a, b) => a.vencimiento.localeCompare(b.vencimiento))

export default function PaymentPage () {
  const [modoMonto, setModoMonto] = useState(false)     // ¿"Especificar monto" activado?
  const [seleccionadas, setSeleccionadas] = useState([]) // ids marcados (modo cuotas)
  const [montoTexto, setMontoTexto] = useState('')       // lo que escribe el usuario (modo monto)
  const [medio, setMedio] = useState('')
  const [pagado, setPagado] = useState(false)

  const deudaTotal = cuotas.reduce((suma, c) => suma + c.monto, 0)
  const montoIngresado = Math.max(0, Math.floor(Number(montoTexto) || 0))
  const montoInvalido = montoIngresado > deudaTotal

  let filas
  if (modoMonto) {
    filas = coberturaPago(cuotas, montoInvalido ? 0 : montoIngresado)
  } else {
    filas = cuotas.map(c => {
      const aplicado = seleccionadas.includes(c.id) ? c.monto : 0
      return { ...c, aplicado, pendiente: c.monto - aplicado }
    })
  }

  const total = filas.reduce((suma, f) => suma + f.aplicado, 0)
  const puedePagar = total > 0 && medio !== ''

  // Al cambiar de modo se limpia lo del otro, para no mezclar los dos métodos
  function alternarModoMonto () {
    setModoMonto(!modoMonto)
    setSeleccionadas([])
    setMontoTexto('')
  }

  // Las cuotas se pagan en orden: al desmarcar una, también se desmarcan las siguientes
  function marcarCuota (id) {
    const posicion = cuotas.findIndex(c => c.id === id)
    if (seleccionadas.includes(id)) {
      const siguientes = cuotas.slice(posicion).map(c => c.id)
      setSeleccionadas(seleccionadas.filter(x => !siguientes.includes(x)))
    } else if (posicion === 0 || seleccionadas.includes(cuotas[posicion - 1].id)) {
      setSeleccionadas([...seleccionadas, id])
    }
  }

  function textoEstado (f) {
    if (f.aplicado === 0) return 'Pendiente'
    if (f.pendiente === 0) return 'Seleccionado'
    return `Monto pendiente ${formatMoney(f.pendiente)}`
  }

  function confirmarPago () {
    setPagado(true)
  }

  if (pagado) {
    return (
      <section className='payment-page'>
        <div className='payment-page__receipt' role='status'>
          <h1 className='payment-page__title'>¡Pago realizado con éxito!</h1>
          <p>Total pagado: <strong>{formatMoney(total)}</strong></p>
          <ul className='payment-page__receipt-list'>
            {filas.filter(f => f.aplicado > 0).map(f => (
              <li key={f.id}>{f.descripcion}: {formatMoney(f.aplicado)}</li>
            ))}
          </ul>
        </div>
      </section>
    )
  }

  return (
    <section className='payment-page'>
      <h1 className='payment-page__title'>Pagar</h1>

      <h2 className='payment-page__subtitle'>Seleccione las cuotas o el monto que desee pagar</h2>

      <p className='payment-page__hint'>
        Marque las cuotas que quiere pagar completas o active «Especificar monto»
        para escribir cuánto desea pagar. Lo aplicaremos desde la cuota más antigua.
      </p>

      <div className='payment-page__amount-row'>
        <button
          type='button'
          className={`payment-page__toggle${modoMonto ? ' payment-page__toggle--on' : ''}`}
          aria-pressed={modoMonto}
          onClick={alternarModoMonto}
        >
          {modoMonto ? 'Especificar monto' : 'Especificar monto'}
        </button>

        {modoMonto && (
          <input
            className='payment-page__amount-input'
            type='number'
            min='0'
            step='1000'
            value={montoTexto}
            onChange={e => setMontoTexto(e.target.value)}
            placeholder='Monto a pagar (CLP). Ej: 500000'
            aria-label='Monto a pagar en pesos chilenos'
            autoFocus
          />
        )}
      </div>

      {modoMonto && (
        <>
          <p className='payment-page__hint'>Deuda total: {formatMoney(deudaTotal)}.</p>
          {montoInvalido && (
            <p className='payment-page__error' role='alert'>
              El monto no puede superar tu deuda total ({formatMoney(deudaTotal)}).
            </p>
          )}
        </>
      )}

      <div className='payment-page__table-wrap'>
        <table className='payment-page__table'>
          <thead>
            <tr>
              <th>Fecha de vencimiento</th>
              <th>Monto</th>
              <th>Descripción</th>
              <th>Después del pago</th>
              <th>Pagar</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => (
              <tr key={f.id}>
                <td>{formatoFecha(f.vencimiento)}</td>
                <td>{formatMoney(f.monto)}</td>
                <td>{f.descripcion}</td>
                <td>{textoEstado(f)}</td>
                <td>
                  <input
                    type='checkbox'
                    checked={seleccionadas.includes(f.id)}
                    onChange={() => marcarCuota(f.id)}
                    disabled={modoMonto || (i > 0 && !seleccionadas.includes(filas[i - 1].id))}
                    aria-label={`Seleccionar ${f.descripcion}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!modoMonto && (
        <p className='payment-page__hint'>
          Para pagar una cuota, debe incluir las anteriores.
        </p>
      )}

      <h2 className='payment-page__subtitle'>Seleccione su medio de pago</h2>
      <div className='payment-page__methods'>
        {MEDIOS.map(m => (
          <label key={m.id} className='payment-page__method'>
            <input type='radio' name='medio' checked={medio === m.id} onChange={() => setMedio(m.id)} />
            <span>
              {m.label}
              <small className='payment-page__method-sub'>{m.sublabel}</small>
            </span>
          </label>
        ))}
      </div>

      <div className='payment-page__summary'>
        <span>Total a pagar</span>
        <strong>{formatMoney(total)}</strong>
      </div>

      <button className='payment-page__button' onClick={confirmarPago} disabled={!puedePagar}>
        Pagar
      </button>
    </section>
  )
}