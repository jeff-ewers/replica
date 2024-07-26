import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectById, getProjectAnalysisTypes } from "../../services/projectService";
import { runAnalysis, getGSEALibraries } from '../../services/analysisService';
import './AnalysisCreate.css'

export const AnalysisCreate = ({setShowNewAnalysisForm}) => {

const replicaUser = JSON.parse(localStorage.getItem('replica_user'));
const navigate = useNavigate()
const [project, setProject] = useState(null);
const [GSEALibraries, setGSEALibraries] = useState(null);
const [analysisTypeSelection, setAnalysisTypeSelection] = useState(null);
const [parametersForSelectedAnalysisType, setParametersForSelectedAnalysisType] = useState([]);
const { projectId } = useParams();
const [analysis, setAnalysis] = useState({
    user_id: replicaUser.id,
    project_id: parseInt(projectId),
    analysis_type_id: 0,
    gsea_library_id: 0,
    status: 'Not Completed',
    parameters: {}
});


useEffect(() => {
    const fetchProject = async () => {
      const fetchedProject = await getProjectById(projectId);
      setProject(fetchedProject);
    };
    fetchProject();
  }, [projectId]);

useEffect(() => {
    if (project?.project_analysis_types) {
        for (const analysisType of project.project_analysis_types) {
            if (analysisType.analysis_type.id === 2) {
                const fetchLibraries = async () => {
                    const fetchedLibraries = await getGSEALibraries();
                    setGSEALibraries(fetchedLibraries)
                } 
                fetchLibraries()
            }
        }
    }
}, [project])


const handleRun = async (event) => {
    event.preventDefault();
    // Send the entire project object
    await runAnalysis(analysis);
    navigate(`/projects/${project.id}`);
};

const getAndSetSelectedAnalysisTypeParameters = (id) => {
    //find selected analysis type
    const selectedType = project.project_analysis_types.find(type => type.analysis_type.id === parseFloat(id));
    if (selectedType) {
        const parameters = {};
        //set parameters to default values
        selectedType.analysis_type.parameters.forEach(param => {
            parameters[param.name] = parseFloat(param.default_value)
        });
        //add params to analysis
        setAnalysis(prev => ({
            ...prev,
            analysis_type_id: parseInt(id),
            parameters: parameters
        }));
        //set relevant parameters in state
        setParametersForSelectedAnalysisType(selectedType.analysis_type.parameters);
    }
}

const handleDelete = () => {
    //hide form element
    setShowNewAnalysisForm(false)
}

const handleAnalysisTypeChange = (id) => {
    getAndSetSelectedAnalysisTypeParameters(id);
  };

  const handleGSEALibraryChange = (id) => {
    var transientAnalysis = {
        ...analysis,
        gsea_library_id: parseInt(id),
    }
    setAnalysis(transientAnalysis);
  };


return (
    <div className="analysis-edit">
      {project && (
        <form onSubmit={handleRun}>
        <div>
          <label htmlFor="analysis_type">Analysis Type:</label>
          <select
            id="analysis_type"
            name="analysis_type"
            value={analysis.analysis_type_id}
            onChange={(e) => handleAnalysisTypeChange(e.target.value)}
            required
          >
            <option value={0}>Select an analysis workflow</option>
            {project?.project_analysis_types.map(type => (
                <option key={type.analysis_type.id} value={type.analysis_type.id}>{type.analysis_type.name}</option>
              ))}
          </select>
        </div>
        {(analysis.analysis_type_id === 2) && (
            <div>
            <label htmlFor="gsea_library">GSEA Library:</label>
            <select
              id="gsea_library"
              name="gsea_library"
              value={analysis.gsea_library_id}
              onChange={(e) => handleGSEALibraryChange(e.target.value)}
              required
            >
              <option value={0}>Select a GSEA Library</option>
              {GSEALibraries.map(library => (
                  <option key={library.id} value={library.id}>{library.name}</option>
                ))}
            </select>
          </div>
        )}
        {parametersForSelectedAnalysisType.length > 0 && (
            <div className="parameters-container">
                <h3>Analysis Parameters:</h3>
                {parametersForSelectedAnalysisType.map(param => (
                    <div key={param.id}>
                        <label htmlFor={param.name}>{param.name}:</label>
                        <input
                            type="text"
                            id={param.name}
                            value={analysis.parameters[param.name] || ''}
                            onChange={(e) => setAnalysis(prev => ({
                                ...prev,
                                parameters: {
                                    ...prev.parameters,
                                    [param.name]: e.target.value
                                }
                            }))}
                        />
                    </div>
                ))}
            </div>
        )}

          <div className="button-group">
            <button type="submit" className="btn-run">Run Analysis</button>
            <button type="button" className="btn-cancel" onClick={handleDelete}>Cancel Analysis</button>
          </div>
        </form>
      )}
    </div>
)

}