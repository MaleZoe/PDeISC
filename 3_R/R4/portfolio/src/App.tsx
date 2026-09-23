import { Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Certificates from './components/Certificates'
import Contact from './components/Contact'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Certificates />
      <Contact />
    </>
  );
}

import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <div style={{ backgroundColor: '#000', color: '#edeadb', fontFamily: 'Figtree, system-ui, sans-serif' }}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  )
}
