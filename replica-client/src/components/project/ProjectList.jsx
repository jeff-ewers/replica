import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserById } from "../../services/userService";
import { getProjectById, deleteProject } from "../../services/projectService";
import trashIcon from '../../assets/trash.png';
import './ProjectList.css'

export const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const replicaUser = JSON.parse(localStorage.getItem('replica_user'));
      if (replicaUser && replicaUser.id) {
        const user = await getUserById(replicaUser.id);
        const projectPromises = user.projects.map(project => getProjectById(project.id));
        const fetchedProjects = await Promise.all(projectPromises);
        setProjects(fetchedProjects);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (e, projectId) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    try {
      await deleteProject(projectId);
      // Refetch projects after successful deletion
      const replicaUser = JSON.parse(localStorage.getItem('replica_user'));
      if (replicaUser && replicaUser.id) {
        const user = await getUserById(replicaUser.id);
        const projectPromises = user.projects.map(project => getProjectById(project.id));
        const fetchedProjects = await Promise.all(projectPromises);
        setProjects(fetchedProjects);
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="project-list-container">
        <div className="project-list-spacer"></div>
      <div className="project-list-header">
        <h1>Projects</h1>
        <button className="btn-new-project" onClick={() => navigate('/projects/create')}>
          New Project
        </button>
      </div>
      <div className="project-list" key={projects.length}>
        {projects.map(project => (
          <div key={project.id} className="project-card" onClick={() => navigate(`/projects/${project.id}`)}>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <p>Created: {formatDate(project.created_at)}</p>
            <div className="analysis-types">
              <h3>Analysis Types:</h3>
              <ul>
                {project.project_analysis_types.map(pat => (
                  <li key={pat.id}>{pat.analysis_type.name}</li>
                ))}
              </ul>
            </div>
            <div className="analyses">
              <h3>Analyses:</h3>
              {project.analyses.map(analysis => (
                <div key={analysis.id} className="analysis-item">
                  <p>Type: {project.project_analysis_types.find(pat => pat.analysis_type.id === analysis.analysis_type)?.analysis_type.name || 'Unknown'}</p>
                  <p>Status: {analysis.status}</p>
                  <p>Created: {formatDate(analysis.created_at)}</p>
                </div>
              ))}
            </div>
            <button onClick={(e) => handleDelete(e, project.id)} className="btn-delete">
              <img src={trashIcon} alt="Delete" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};