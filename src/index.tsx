import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { AuthProvider } from './hooks/useAuth'
import App from './App'

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root'))