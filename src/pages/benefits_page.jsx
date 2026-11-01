import React, { useState } from 'react'

import StatusBadge from '../components/status_badge'
import { BENEFIT_SOURCES, benefits } from '../data/account'
import { formatMoney, formatDate } from '../utils/format'

const REPORT_REASONS = [
  'No ha llegado un pago que esperaba',
  'El monto no coincide con lo que me informaron',
  'Aparece como recibido pero no lo veo en mi cuenta'
]

const ReportDialog = ({ benefit, onClose }) => {
  const [reason, setReason] = useState(REPORT_REASONS[0])
  const [comment, setComment] = useState('')
  const [ticket, setTicket] = useState(null)

  const submit = (event) => {
    event.preventDefault()
    setTicket('SOL-2026-0412')
  }

  return (
    <div className='dialog' role='dialog' aria-modal='true' aria-labelledby='report-title'>
      <div className='dialog__backdrop' onClick={onClose} />
      <div className='dialog__panel'>
        <h3 id='report-title' className='dialog__title'>Reportar una diferencia</h3>
        <p className='dialog__text'>
          Beneficio: <strong>{benefit.concepto}</strong> ({benefit.mes})
        </p>
        {ticket
          ? (
            <>
              <p className='dialog__success' role='status'>
                ✓ Recibimos tu reporte. Tu número de solicitud es <strong>{ticket}</strong>.
                Te responderemos en un plazo de 5 días hábiles.
              </p>
              <div className='dialog__actions'>
                <button type='button' className='button' onClick={onClose}>Cerrar</button>
              </div>
            </>
            )
          : (
            <form onSubmit={submit}>
              <label className='field'>
                <span className='field__label'>¿Qué ocurre?</span>
                <select className='field__input' value={reason} onChange={(e) => setReason(e.target.value)}>
                  {REPORT_REASONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </label>
              <label className='field'>
                <span className='field__label'>Comentario (opcional)</span>
                <textarea
                  className='field__input'
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </label>
              <div className='dialog__actions'>
                <button type='button' className='button button--secondary' onClick={onClose}>Cancelar</button>
                <button type='submit' className='button'>Enviar reporte</button>
              </div>
            </form>
            )}
      </div>
    </div>
  )
}

export const BenefitsPage = () => {
  const [source, setSource] = useState('todos')
  const [openId, setOpenId] = useState(null)
  const [reporting, setReporting] = useState(null)

  const visible = benefits.filter((b) => source === 'todos' || b.fuente === source)
  const october = benefits.filter((b) => b.mes === 'Octubre 2026')
  const caeNow = benefits.find((b) => b.id === 'b-2')

  return (
    <div className='benefits-page'>
      <h2 className='page-title'>Becas y beneficios</h2>
      <p className='page-intro'>
        Aquí ves todo lo que recibes por becas y créditos, venga de la USM, del CAE o del Mineduc.
        Cada beneficio dice con claridad si <strong>ya llegó</strong>, si está <strong>programado</strong> o
        si aún está <strong>en proceso</strong>.
      </p>

      <section aria-label='Estado este mes' className='benefits-page__status'>
        <h3 className='benefits-page__subtitle'>Este mes: octubre 2026</h3>
        <ul className='status-list'>
          {october.map((b) => (
            <li key={b.id} className='status-list__item'>
              <StatusBadge estado={b.estado} />
              <span className='status-list__text'>
                <strong>{b.concepto}</strong>
                {b.estado === 'recibido'
                  ? ` · ${formatMoney(b.monto)} el ${formatDate(b.fecha)}`
                  : ' · aún no informado'}
              </span>
            </li>
          ))}
          <li className='status-list__item'>
            <StatusBadge estado={caeNow.estado} />
            <span className='status-list__text'>
              <strong>CAE del semestre</strong> · {formatMoney(caeNow.monto)} ya reflejado en tu cuenta
              el {formatDate(caeNow.fecha)}
            </span>
          </li>
        </ul>
      </section>

      <div className='chips' role='group' aria-label='Filtrar por origen'>
        {BENEFIT_SOURCES.map((s) => (
          <button
            key={s.id}
            type='button'
            aria-pressed={source === s.id}
            className={`chips__chip${source === s.id ? ' chips__chip--active' : ''}`}
            onClick={() => setSource(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className='table-wrapper'>
        <table className='table'>
          <thead>
            <tr>
              <th>Origen</th>
              <th>Beneficio</th>
              <th>Mes</th>
              <th className='table__num'>Monto</th>
              <th>Fecha de pago</th>
              <th>Estado</th>
              <th><span className='sr-only'>Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((b) => (
              <React.Fragment key={b.id}>
                <tr>
                  <td>{b.fuente === 'Mineduc' ? 'Mineduc / Junaeb' : b.fuente}</td>
                  <td>{b.concepto}</td>
                  <td>{b.mes}</td>
                  <td className='table__num'>{b.monto ? formatMoney(b.monto) : 'Por confirmar'}</td>
                  <td>{b.fecha ? formatDate(b.fecha) : '—'}</td>
                  <td><StatusBadge estado={b.estado} /></td>
                  <td>
                    <button
                      type='button'
                      className='link-button'
                      aria-expanded={openId === b.id}
                      onClick={() => setOpenId(openId === b.id ? null : b.id)}
                    >
                      {openId === b.id ? 'Ocultar detalle' : 'Ver detalle'}
                    </button>
                  </td>
                </tr>
                {openId === b.id && (
                  <tr className='table__detail'>
                    <td colSpan={7}>
                      <p><strong>¿Cómo llega?</strong> {b.via}.</p>
                      <p>{b.detalle}</p>
                      {b.recibo && <p>N.º de recibo: <strong>{b.recibo}</strong></p>}
                      <div className='table__detail-actions'>
                        {b.estado !== 'programado' && (
                          <button type='button' className='button button--secondary' onClick={() => setReporting(b)}>
                            Reportar una diferencia
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {reporting && <ReportDialog benefit={reporting} onClose={() => setReporting(null)} />}
    </div>
  )
}

export default BenefitsPage
