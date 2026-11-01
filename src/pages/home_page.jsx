import React from 'react'
import { Link } from 'react-router-dom'

import {
  STUDENT,
  TODAY,
  currentBalance,
  pendingInstallments,
  benefits,
  LAST_PERIOD_ID
} from '../data/account'
import { formatMoney, formatDate } from '../utils/format'

export const HomePage = () => {
  const next = pendingInstallments[0]
  const receivedThisMonth = benefits.filter(
    (b) => b.estado === 'recibido' && b.fecha && b.fecha.startsWith(TODAY.slice(0, 7))
  )

  return (
    <div className='home-page'>
      <h2 className='home-page__greeting'>Hola, {STUDENT.firstName}</h2>
      <p className='home-page__subtitle'>
        {STUDENT.career} · {STUDENT.profile}
      </p>

      <section className='home-page__summary' aria-label='Resumen de tu cuenta'>
        <div className='summary-card'>
          <span className='summary-card__label'>Lo que debes hoy</span>
          <strong className='summary-card__value'>{formatMoney(currentBalance)}</strong>
          <span className='summary-card__hint'>
            {pendingInstallments.length} cuotas de arancel pendientes
          </span>
        </div>
        <div className='summary-card summary-card--alert'>
          <span className='summary-card__label'>Próximo vencimiento</span>
          <strong className='summary-card__value'>{formatDate(next.vencimiento)}</strong>
          <span className='summary-card__hint'>
            {next.descripcion}: {formatMoney(next.monto)}
            {next.vencimiento === TODAY ? ' · vence hoy' : ''}
          </span>
        </div>
        <div className='summary-card summary-card--ok'>
          <span className='summary-card__label'>Beneficios este mes</span>
          <strong className='summary-card__value'>
            {receivedThisMonth.length} recibido{receivedThisMonth.length === 1 ? '' : 's'}
          </strong>
          <span className='summary-card__hint'>1 en proceso de confirmación</span>
        </div>
      </section>

      <h3 className='home-page__section-title'>¿Qué quieres revisar?</h3>
      <div className='home-page__goals'>
        <Link className='goal-card' to='/beneficios'>
          <span className='goal-card__title'>¿Llegó mi beca o mi CAE?</span>
          <span className='goal-card__text'>
            Mira en un solo lugar tus becas y beneficios (USM, CAE y Mineduc) y si ya llegaron.
          </span>
          <span className='goal-card__cta'>Ver becas y beneficios →</span>
        </Link>
        <Link className='goal-card' to={`/historial?semestre=${LAST_PERIOD_ID}`}>
          <span className='goal-card__title'>¿Qué pagué el semestre pasado?</span>
          <span className='goal-card__text'>
            Resumen por semestre de lo que te cobraron, lo que pagaste y lo que cubrió el CAE.
          </span>
          <span className='goal-card__cta'>Ver historial →</span>
        </Link>
      </div>
    </div>
  )
}

export default HomePage
