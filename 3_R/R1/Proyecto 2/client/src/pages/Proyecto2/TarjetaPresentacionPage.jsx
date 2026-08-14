import React from 'react';
import TarjetaPresentacion from '../../components/TarjetaPresentacion/TarjetaPresentacion';

const TarjetaPresentacionPage = () => {
  const profesionales = [
    {
      id: 1,
      nombre: 'Andrea',
      apellido: 'Rotundo',
      profesion: 'Médica Cirujana',
      imagen: '/images/persona1.jpg',
      objectPosition: 'center bottom'
    },
    {
      id: 2,
      nombre: 'Valeria',
      apellido: 'Méndez',
      profesion: 'Directora General',
      imagen: '/images/persona2.png',
      objectPosition: 'center 15%'
    },
    {
      id: 3,
      nombre: 'David',
      apellido: 'García',
      profesion: 'Arquitecto de Software',
      imagen: '/images/persona3.png',
      objectPosition: 'center 10%'
    },
    {
      id: 4,
      nombre: 'Javier',
      apellido: 'Fernández',
      profesion: 'Director Financiero',
      imagen: '/images/persona4.png',
      objectPosition: 'center 10%'
    }
  ];

  return (
    <div className="container-fluid px-4 px-xl-5 pt-5 pb-4 min-vh-100 d-flex flex-column" style={{ position: 'relative', zIndex: 1 }}>
      {/* Elementos decorativos de fondo (Mesh Gradient estático por simplicidad) */}
      <div 
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1,
          background: 'radial-gradient(at 10% 20%, hsla(253,16%,7%,0.03) 0, transparent 40%), radial-gradient(at 90% 80%, hsla(225,39%,30%,0.03) 0, transparent 40%)'
        }}
        className="theme-mesh"
      ></div>

      <div className="row mb-4 mt-3 text-center">
        <div className="col">
          <div className="mb-2 d-inline-block px-3 py-1 rounded-pill" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.85rem', fontWeight: 600, border: '1px solid var(--border-color)' }}>
            Proyecto 2
          </div>
          <h2 className="display-6 fw-bold mb-1" style={{ color: 'var(--text-color)', letterSpacing: '-1px' }}>
            Equipo Directivo
          </h2>
          <p className="lead text-muted mx-auto mb-2" style={{ maxWidth: '600px', fontSize: '1.05rem' }}>
            Tarjetas de presentación renderizadas dinámicamente usando <strong>Props</strong>.
          </p>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 g-xl-5 justify-content-center">
        {profesionales.map((pro) => (
          <div className="col px-4 px-sm-2 px-lg-0" key={pro.id}>
            <TarjetaPresentacion 
              nombre={pro.nombre}
              apellido={pro.apellido}
              profesion={pro.profesion}
              imagen={pro.imagen}
              objectPosition={pro.objectPosition}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TarjetaPresentacionPage;
