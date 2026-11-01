import React from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  PERIODS,
  LAST_PERIOD_ID,
  movements,
  pendingInstallments,
  periodById
} from '../data/account'
import { formatMoney, formatDate, sum } from '../utils/format'

export const HistoryPage = () => {
  const [params, setParams] = useSearchParams()
  const requested = params.get('semestre')
  const periodId = periodById(requested) ? requested : LAST_PERIOD_ID
  const period = periodById(periodId)

  const rows = movements.filter((m) => m.periodo === periodId)
  const charged = sum(rows.filter((m) => m.tipo === 'cargo'), (m) => m.monto)
  const ownPayments = rows.filter((m) => m.tipo === 'pago' && m.medio !== 'CAE')
  const caePayments = rows.filter((m) => m.medio === 'CAE')
  const paidByYou = sum(ownPayments, (m) => m.monto)
  const paidByCae = sum(caePayments, (m) => m.monto)
  const closing = rows.length ? rows[rows.length - 1].saldo : 0

  return (
    <div className='history-page'>
      <h2 className='page-title'>Historial por semestre</h2>
      <p className='page-intro'>
        Un resumen de cada semestre: cuánto te cobraron, cuánto pagaste tú y cuánto cubrió el CAE.
      </p>

      <div className='tabs' role='tablist' aria-label='Semestre'>
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type='button'
            role='tab'
            aria-selected={p.id === periodId}
            className={`tabs__tab${p.id === periodId ? ' tabs__tab--active' : ''}`}
            onClick={() => setParams({ semestre: p.id })}
          >
            {p.label}
            {p.id === LAST_PERIOD_ID && <span className='tabs__tag'>Semestre pasado</span>}
            {p.current && <span className='tabs__tag tabs__tag--current'>En curso</span>}
          </button>
        ))}
      </div>

      <section className='answer' aria-live='polite'>
        <h3 className='answer__title'>
          {periodId === LAST_PERIOD_ID ? 'Lo que pagaste el semestre pasado' : `Resumen del ${period.label}`}
        </h3>
        <p className='answer__text'>
          En el {period.label} pagaste <strong>{formatMoney(paidByYou)}</strong> con tarjeta de crédito
          {ownPayments.length ? ` en ${ownPayments.length} pago${ownPayments.length === 1 ? '' : 's'}` : ''}
          {paidByCae ? <> y el CAE aportó <strong>{formatMoney(paidByCae)}</strong></> : null}.
        </p>
      </section>

      <div className='summary-grid'>
        <div className='summary-card'>
          <span className='summary-card__label'>Te cobraron</span>
          <strong className='summary-card__value'>{formatMoney(charged)}</strong>
          <span className='summary-card__hint'>Arancel, matrícula e intereses</span>
        </div>
        <div className='summary-card summary-card--ok'>
          <span className='summary-card__label'>Pagaste tú</span>
          <strong className='summary-card__value'>{formatMoney(paidByYou)}</strong>
          <span className='summary-card__hint'>Con tarjeta de crédito</span>
        </div>
        <div className='summary-card summary-card--ok'>
          <span className='summary-card__label'>Cubrió el CAE</span>
          <strong className='summary-card__value'>{formatMoney(paidByCae)}</strong>
          <span className='summary-card__hint'>Abono directo al arancel</span>
        </div>
        <div className='summary-card'>
          <span className='summary-card__label'>Deuda al cierre</span>
          <strong className='summary-card__value'>{formatMoney(closing)}</strong>
          <span className='summary-card__hint'>{closing === 0 ? 'Semestre al día' : 'Quedan cuotas por pagar'}</span>
        </div>
      </div>

      <h3 className='page-subtitle'>Tus pagos de este semestre</h3>
      {ownPayments.length === 0
        ? <p className='callout'>No registras pagos propios en este semestre.</p>
        : (
          <div className='table-wrapper'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Medio de pago</th>
                  <th className='table__num'>Monto</th>
                  <th>N.º de recibo</th>
                </tr>
              </thead>
              <tbody>
                {ownPayments.map((m) => (
                  <tr key={m.id}>
                    <td>{formatDate(m.fecha)}</td>
                    <td>{m.medio}</td>
                    <td className='table__num'>{formatMoney(m.monto)}</td>
                    <td>{m.recibo}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}>Total pagado por ti</td>
                  <td className='table__num'>{formatMoney(paidByYou)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          )}

      {period.current && (
        <>
          <h3 className='page-subtitle'>Cuotas que aún debes pagar</h3>
          <ul className='installments'>
            {pendingInstallments.map((c) => (
              <li key={c.id} className='installments__item'>
                <span>{c.descripcion}</span>
                <span>Vence {formatDate(c.vencimiento)}</span>
                <strong>{formatMoney(c.monto)}</strong>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default HistoryPage
