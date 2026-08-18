/**
 * useTareas.js
 * Hook personalizado para facilitar el acceso al TareasContext.
 */

import { useContext } from 'react';
import { TareasContext } from '../context/TareasContext';

export const useTareas = () => {
  const context = useContext(TareasContext);
  if (!context) {
    throw new Error("useTareas debe usarse dentro de un TareasProvider");
  }
  return context;
};
