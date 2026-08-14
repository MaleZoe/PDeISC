import React from 'react';
import PropTypes from 'prop-types';
import styles from './TarjetaPresentacion.module.css';

const TarjetaPresentacion = ({ 
  nombre = 'Nombre', 
  apellido = 'Apellido', 
  profesion = 'Profesión no especificada', 
  imagen 
}) => {
  // Fallback image logic if imagen is not provided or is empty
  const defaultImage = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(nombre + ' ' + apellido) + '&background=random&color=fff&size=150';
  const imgSource = imagen ? imagen : defaultImage;

  return (
    <div className={`card ${styles.tarjetaPresentacion} h-100 border-0 shadow-sm`}>
      <div className={styles.imagenContenedor}>
        <img 
          src={imgSource} 
          className={`card-img-top ${styles.tarjetaImagen}`} 
          alt={`Foto de perfil de ${nombre} ${apellido}`} 
          onError={(e) => { e.target.src = defaultImage; }} // Fallback if image fails to load
        />
      </div>
      <div className="card-body text-center d-flex flex-column justify-content-center">
        <h3 className={`card-title ${styles.tarjetaNombre} mb-1`}>
          {nombre} {apellido}
        </h3>
        <p className={`card-text ${styles.tarjetaProfesion} text-muted`}>
          {profesion}
        </p>
      </div>
    </div>
  );
};

TarjetaPresentacion.propTypes = {
  nombre: PropTypes.string,
  apellido: PropTypes.string,
  profesion: PropTypes.string,
  imagen: PropTypes.string
};

export default TarjetaPresentacion;
