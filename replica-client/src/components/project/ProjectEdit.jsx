import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, saveProject, deleteProject } from "../../services/projectService";
import './ProjectEdit.css';

export const ProjectEdit = () => {
  const [project, setProject] = useState(null);
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      const fetchedProject = await getProjectById(projectId);
      setProject(fetchedProject);
    };
    fetchProject();
  }, [projectId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    // Send the entire project object
    await saveProject(projectId, project);
    navigate(`/projects/${projectId}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(projectId);
      navigate('/projects');
    }
  };

  return (
    <div className="project-edit">
      <h1>Edit Project</h1>
      {project && (
        <form onSubmit={handleSave}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={project.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={project.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" className="btn-save">Save</button>
            <button type="button" className="btn-delete" onClick={handleDelete}>Delete Project</button>
          </div>
        </form>
      )}
    </div>
  );
};