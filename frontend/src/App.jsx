import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/AuthProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Header } from './components/Header'
import { Inicio } from './pages/Inicio'
import { Analisis } from './pages/Analisis'
import { Footer } from './components/Footer'
import { Loading } from './pages/Loading'
import { Error } from './pages/Error'
import { Results } from './pages/Results'
import { Login } from './pages/Login'
import { Registro } from './pages/Registro'
import { Perfil } from './pages/Perfil'

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            {/* Públicas */}
            <Route path="/" element={<Inicio />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/error" element={<Error />} />

            {/* Requieren sesión */}
            <Route
              path="/analisis"
              element={
                <ProtectedRoute>
                  <Analisis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loading"
              element={
                <ProtectedRoute>
                  <Loading />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
