import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjectTypes, getAnalysisTypesByProjectType, createProject } from '../../services/projectService';
import './ProjectCreate.css';

export const ProjectCreate = () => {
  const navigate = useNavigate();
  const [projectTypes, setProjectTypes] = useState([]);
  const [analysisTypes, setAnalysisTypes] = useState([]);
  const [project, setProject] = useState({
    title: '',
    description: '',
    project_type: '',
    analysis_type: '',
    datafiles: []
  });

  useEffect(() => {
    getAllProjectTypes().then(setProjectTypes);
  }, []);

  useEffect(() => {
    if (project.project_type) {
      getAnalysisTypesByProjectType(project.project_type).then(setAnalysisTypes);
    }
  }, [project.project_type]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectTypeChange = (event) => {
    const { value } = event.target;
    setProject(prev => ({ ...prev, project_type: value, analysis_type: '' }));
  };

  const handleAddDataFile = () => {
    setProject(prev => ({
      ...prev,
      datafiles: [...prev.datafiles, { name: '', file_path: '', file_type: '', condition: '' }]
    }));
  };

  const handleDataFileChange = (index, event) => {
    const { name, value } = event.target;
    setProject(prev => {
      const newDataFiles = [...prev.datafiles];
      newDataFiles[index] = { ...newDataFiles[index], [name]: value };
      return { ...prev, datafiles: newDataFiles };
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem('replica_user'));
      const projectWithUser = { ...project, user: userData.id };
      await createProject(projectWithUser);
      navigate('/projects');
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <div className="project-create">
      <div className="header">
        <h1>Create New Project</h1>
        <div className="button-group">
          <button onClick={() => navigate('/projects')} className="btn-cancel">Cancel</button>
          <button onClick={handleSave} className="btn-save">Save</button>
        </div>
      </div>
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
        <div>
          <label htmlFor="project_type">Project Type:</label>
          <select
            id="project_type"
            name="project_type"
            value={project.project_type}
            onChange={handleProjectTypeChange}
            required
          >
            <option value="">Select a project type</option>
            {projectTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="analysis_type">Analysis Type:</label>
          <select
            id="analysis_type"
            name="analysis_type"
            value={project.analysis_type}
            onChange={handleInputChange}
            required
            disabled={!project.project_type}
          >
            <option value="">Select an analysis type</option>
            {analysisTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
        <div className="datafiles-section">
          <h2>Data Files</h2>
          <button type="button" onClick={handleAddDataFile} className="btn-add-file">Add Data File</button>
          {project.datafiles.map((file, index) => (
            <div key={index} className="datafile-form">
              <input
                type="text"
                name="name"
                value={file.name}
                onChange={(e) => handleDataFileChange(index, e)}
                placeholder="File Name"
                required
              />
              <input
                type="text"
                name="file_path"
                value={file.file_path}
                onChange={(e) => handleDataFileChange(index, e)}
                placeholder="File Path"
                required
              />
              <input
                type="text"
                name="file_type"
                value={file.file_type}
                onChange={(e) => handleDataFileChange(index, e)}
                placeholder="File Type"
                required
              />
              <input
                type="text"
                name="condition"
                value={file.condition}
                onChange={(e) => handleDataFileChange(index, e)}
                placeholder="Condition"
                required
              />
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};