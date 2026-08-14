import React from 'react';
import PropTypes from 'prop-types';

const GameControls = ({ onRestart }) => {
  return (
    <div className="mt-4 text-center">
      <button 
        className="btn btn-warning rounded-pill px-4 fw-bold shadow-sm"
        onClick={onRestart}
      >
        <i className="bi bi-arrow-clockwise me-2"></i>
        Reiniciar partida
      </button>
    </div>
  );
};

GameControls.propTypes = {
  onRestart: PropTypes.func.isRequired
};

export default GameControls;
