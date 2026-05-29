import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Header } from './components/Header'
import { Inicio } from './pages/Inicio'
import { Analisis } from './pages/Analisis'
import { Footer } from './components/Footer'
import { Loading } from './pages/Loading'
import { Error } from './pages/Error'
import { Results } from './pages/Results'

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Inicio />}/>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/analisis" element={<Analisis />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/error" element={<Error />} />
          <Route path="/results" element={<Results />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
