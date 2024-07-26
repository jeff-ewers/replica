import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById } from "../../services/projectService";
import './ProjectDetail.css';
import { AnalysisCreate } from '../analysis/AnalysisCreate';

export const ProjectDetail = () => {
  const [project, setProject] = useState(null);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [showNewAnalysisForm, setShowNewAnalysisForm] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      const fetchedProject = await getProjectById(projectId);
      setProject(fetchedProject);
    };
    fetchProject();
  }, [projectId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };


  if (!project) return <div>Loading...</div>;

  return (
    <div className="project-detail">
      <button className="edit-button" onClick={() => navigate(`/projects/${projectId}/edit`)}>Edit</button>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <p>Created: {formatDate(project.created_at)}</p>

      <section className="analysis-types">
        <h2>Analysis Types</h2>
        <ul>
          {project.project_analysis_types.map(pat => (
            <li key={pat.id}>{pat.analysis_type.name}</li>
          ))}
        </ul>
      </section>

      <section className="analyses">
        <h2>Analyses</h2>
        <button className="btn-new-analysis" onClick={() => setShowNewAnalysisForm(!showNewAnalysisForm)}>New Analysis</button>
        {showNewAnalysisForm && <AnalysisCreate setShowNewAnalysisForm={setShowNewAnalysisForm}/>}
        {project.analyses.map(analysis => (
          <div key={analysis.id} className="analysis-item">
            <p>Type: {project.project_analysis_types.find(pat => pat.analysis_type.id === analysis.analysis_type)?.analysis_type.name || 'Unknown'}</p>
            <p>Status: {analysis.status}</p>
            <p>Created: {formatDate(analysis.created_at)}</p>
          </div>
        ))}
      </section>

      <section className="datafiles">
        <h2>Data Files</h2>
        {project.datafiles.map(file => (
          <div key={file.id} className="datafile-item">
            <p>Name: {file.file_name}</p>
            <p>Type: {file.file_type}</p>
            <p>Uploaded: {formatDate(file.upload_date)}</p>
            <p>Condition: {file.condition.name}</p>
          </div>
        ))}
      </section>

      <section className="visualizations">
        <h2>Visualizations</h2>
        {project.analyses.flatMap(analysis => 
          analysis.results.flatMap(result => 
            result.visualizations ? result.visualizations.map(viz => (
              <div key={viz.id} className="visualization-item">
                <img src={viz.image_path} alt={`Visualization for ${analysis.analysis_type.name}`} />
                <p>Analysis: {analysis.analysis_type.name}</p>
              </div>
            )) : []
          )
        )}
      </section>
    </div>
  );
};