import React from 'react'
import { BENEFIT_STATES } from '../data/account'

export const StatusBadge = ({ estado }) => {
  const { label, tone } = BENEFIT_STATES[estado]
  const icon = tone === 'ok' ? '✓' : tone === 'warn' ? '…' : '○'
  return (
    <span className={`status-badge status-badge--${tone}`}>
      <span aria-hidden='true'>{icon}</span> {label}
    </span>
  )
}

export default StatusBadge
