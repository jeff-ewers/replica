import React, { useState, useEffect } from 'react';
import './AnalysisWorkflows.css';
import { getAnalysisTypes } from '../../services/analysisService';
import deseq2 from '../../assets/pydeseq2.jpeg';
import gsea from '../../assets/gsea.jpg';
import proteinprediction from '../../assets/proteinprediction.jpeg';

export const AnalysisWorkflows = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const images = [
    deseq2,
    gsea,
    proteinprediction
  ];

  useEffect(() => {
    getAnalysisTypes()
      .then(data => {
        setWorkflows(data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching analysis workflows: ' + error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="analysis-type-container">
      <h1 className="analysis-type-heading">Analysis Workflows</h1>
      <div className="analysis-type-card-container">
        {workflows.map(workflow => (
          <div key={workflow.id} className="analysis-type-card">
            <img 
              src={images[(workflow.id-1)]} 
              alt="Workflow visualization" 
              className="analysis-type-image"
            />
            <div className="analysis-type-card-body">
              <h2 className="analysis-type-card-title">{workflow.name}</h2>
              <p className="analysis-type-card-text">{workflow.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

