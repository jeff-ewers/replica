import React, { useState, useEffect } from 'react';
import './MLModelList.css';
import { getModels } from '../../services/modelService';
import esm2 from '../../assets/esm2.png';
import prottrans from '../../assets/prottrans.jpg';

export const MLModelList = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const images = [
    esm2,
    esm2,
    prottrans
  ];

  useEffect(() => {
    getModels()
      .then(data => {
        setModels(data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching ML models: ' + error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="ml-model-container">
      <h1 className="ml-model-heading">ML Models</h1>
      <div className="ml-model-card-container">
        {models.map(model => (
          <div key={model.id} className="ml-model-card">
            <img 
              src={images[(model.id-1)]} 
              alt="Model visualization" 
              className="ml-model-image"
            />
            <div className="ml-model-card-body">
              <h2 className="ml-model-card-title">{model.name}</h2>
              <h3 className="ml-model-card-subtitle">Version: {model.version}</h3>
              <p className="ml-model-card-text">{model.description}</p>
              <p className="ml-model-card-text-small">File path: {model.file_path}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

