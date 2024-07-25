import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjectTypes, getAnalysisTypesByProjectType, createProject } from '../../services/projectService';
import './ProjectCreate.css';

export const ProjectCreate = () => {
  const navigate = useNavigate();
  const [projectTypes, setProjectTypes] = useState([]);
  const [analysisTypes, setAnalysisTypes] = useState([]);
  const [analysisTypeSelects, setAnalysisTypeSelects] = useState([{ id: 1, value: '' }]);
  const [project, setProject] = useState({
    title: '',
    description: '',
    project_type: '',
    analysis_type: '',
    project_path: '',
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

  const handleProjectPathChange = (event) => {
    const { value } = event.target;
    setProject(prev => ({ ...prev, project_path: value }));
  };

  const handleAddDataFile = () => {
    setProject(prev => ({
      ...prev,
      datafiles: [...prev.datafiles, { name: '', file_path: '', file_type: '', condition: '' }]
    }));
  };

  const handleFileSelect = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      setProject(prev => {
        const newDataFiles = [...prev.datafiles];
        newDataFiles[index] = {
          ...newDataFiles[index],
          name: file.name,
          file_path: file.path, // Might not work in all browsers due to security restrictions
          file_type: file.type || file.name.split('.').pop(),
        };
        return { ...prev, datafiles: newDataFiles };
      });
    }
  };

  const handleDataFileChange = (index, event) => {
    const { name, value } = event.target;
    setProject(prev => {
      const newDataFiles = [...prev.datafiles];
      newDataFiles[index] = { ...newDataFiles[index], [name]: value };
      return { ...prev, datafiles: newDataFiles };
    });
  };

  const handleAddAnalysisType = () => {
    setAnalysisTypeSelects(prev => [...prev, { id: Date.now(), value: '' }]);
  };

  const handleAnalysisTypeChange = (id, value) => {
    setAnalysisTypeSelects(prev => prev.map(select => 
      select.id === id ? { ...select, value } : select
    ));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem('replica_user'));
      const projectWithUser = { 
        ...project, 
        user: userData.id,
        analysis_types: analysisTypeSelects.map(select => select.value).filter(Boolean)
      };
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
        <label htmlFor="project_path">Project Data Directory:</label>
        <input
          type="text"
          id="project_path"
          name="project_path"
          value={project.base_directory}
          onChange={handleProjectPathChange}
          placeholder="Enter full path to project directory"
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
        <label htmlFor="analysis_type">Analysis Type(s):</label>
        {analysisTypeSelects.map((select, index) => (
          <div key={select.id} className="analysis-type-select">
            <select
              id={`analysis_type_${select.id}`}
              name={`analysis_type_${select.id}`}
              value={select.value}
              onChange={(e) => handleAnalysisTypeChange(select.id, e.target.value)}
              required={index === 0}
              disabled={!project.project_type}
            >
              <option value="">Select an analysis type</option>
              {analysisTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            {index === analysisTypeSelects.length - 1 && (
              <button type="button" onClick={handleAddAnalysisType} className="btn-add-analysis-type">+</button>
            )}
          </div>
        ))}
      </div>
      <div className="datafiles-section">
        <h2>Data Files</h2>
        <button type="button" onClick={handleAddDataFile} className="btn-add-file">Add Data File</button>
        {project.datafiles.map((file, index) => (
          <div key={index} className="datafile-form">
            <input
              type="file"
              onChange={(e) => handleFileSelect(index, e)}
              required
            />
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