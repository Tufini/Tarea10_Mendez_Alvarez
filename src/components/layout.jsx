import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import NavBar from './nav_bar'
import HomePage from '../pages/home_page'
import BenefitsPage from '../pages/benefits_page'
import HistoryPage from '../pages/history_page'
import PaymentPage from '../pages/payment_page'
import DataPage from '../pages/data_page'

const Layout = () => {
  return (
    <BrowserRouter>
      <div className='layout'>
        <div className='layout__notice'>
          Prototipo académico (MVP) con datos ficticios · No corresponde al portal oficial
        </div>
        <h1 className='layout__title'>Mi estado de cuenta</h1>
        <NavBar />
        <main className='layout__page'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/beneficios' element={<BenefitsPage />} />
            <Route path='/historial' element={<HistoryPage />} />
            <Route path='/pagar' element={<PaymentPage />} />
            <Route path='/datos' element={<DataPage />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default Layout
