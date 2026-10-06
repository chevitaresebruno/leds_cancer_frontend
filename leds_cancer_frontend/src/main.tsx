import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import './index.css'

import { router } from '@/router'
import { AuthProvider } from '@/contexts/AuthContext'
import { AppThemeProvider } from '@/contexts/ColorModeContext'
import { ExamProvider } from '@/contexts/ExamContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppThemeProvider>
      <AuthProvider>
        <ExamProvider>
          <RouterProvider router={router} />
        </ExamProvider>
      </AuthProvider>
    </AppThemeProvider>
  </React.StrictMode>
)
