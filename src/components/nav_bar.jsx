import React from 'react'
import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/beneficios', label: 'Becas y beneficios' },
  { to: '/historial', label: 'Historial por semestre' }
]

export const NavBar = () => {
  const navLinkClass = ({ isActive }) => {
    const classes = ['nav-bar__link']
    if (isActive) classes.push('nav-bar__link--active')
    return classes.join(' ')
  }

  return (
    <nav className='nav-bar' aria-label='Navegación principal'>
      {LINKS.map(({ to, label, end }) => (
        <NavLink key={to} to={to} end={end} className={navLinkClass}>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default NavBar
