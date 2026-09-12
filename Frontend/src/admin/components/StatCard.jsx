import React from 'react';
import '../components/StatCard.css';

const StatCard = ({ titulo, valor, icono, tendencia, color }) => {
  return (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="stat-info">
        <span className="stat-title">{titulo}</span>
        <h2 className="stat-value">{valor}</h2>
        
        {tendencia && (
          <div className={`stat-trend ${tendencia > 0 ? 'up' : 'down'}`}>
            <i className={`fa-solid fa-arrow-${tendencia > 0 ? 'up' : 'down'}`}></i>
            <span>{Math.abs(tendencia)}% vs mes pasado</span>
          </div>
        )}
      </div>
      
      <div className="stat-icon-wrapper" style={{ backgroundColor: `${color}15`, color: color }}>
        <i className={icono}></i>
      </div>
    </div>
  );
};

export default StatCard;