import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectById, getProjectAnalysisTypes } from "../../services/projectService";
import { runAnalysis, getGSEALibraries, getAnalysisById } from '../../services/analysisService';
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
    try {
        const result = await runAnalysis(analysis, project);
        // Start polling for analysis status and results
        const intervalId = setInterval(async () => {
            const updatedAnalysis = await getAnalysisById(result.analysis_id);
            if (updatedAnalysis.status === 'Completed' || updatedAnalysis.status === 'Failed') {
                clearInterval(intervalId);
                setAnalysis(updatedAnalysis);
                if (updatedAnalysis.status === 'Completed' && updatedAnalysis.results.length > 0) {
                    // Fetch the latest result
                    const latestResult = updatedAnalysis.results[updatedAnalysis.results.length - 1];
                    // You can now use latestResult.result to access the analysis results
                    // For example: latestResult.result.pca_plot, latestResult.result.significant_genes, etc.
                }
            }
        }, 5000);  // Check every 5 seconds
    } catch (error) {
        console.error('Failed to run analysis:', error);
    }
};

const getAndSetSelectedAnalysisTypeParameters = (id) => {
    const selectedType = project.project_analysis_types.find(type => type.analysis_type.id === parseInt(id));
    if (selectedType) {
        const parameters = {};
        selectedType.analysis_type.parameters.forEach(param => {
            parameters[param.id] = parseFloat(param.default_value);
        });
        setAnalysis(prev => ({
            ...prev,
            analysis_type_id: parseInt(id),
            parameters: parameters
        }));
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
            className='select-analysis-type'
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
                            value={analysis.parameters[param.id] || ''}
                            onChange={(e) => setAnalysis(prev => ({
                                ...prev,
                                parameters: {
                                    ...prev.parameters,
                                    [param.id]: e.target.value
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
      {analysis.status === 'Completed' && analysis.results && analysis.results.length > 0 && (
    <div className="analysis-results">
        <h3>Analysis Results</h3>
        <img src={`data:image/png;base64,${analysis.results[analysis.results.length - 1].result.pca_plot}`} alt="PCA Plot" />
        <h4>Top Significant Genes</h4>
        <table>
            <thead>
                <tr>
                    <th>Gene</th>
                    <th>Log2 Fold Change</th>
                    <th>P-value</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(analysis.results[analysis.results.length - 1].result.significant_genes).slice(0, 10).map(([gene, data]) => (
                    <tr key={gene}>
                        <td>{gene}</td>
                        <td>{data.log2FoldChange.toFixed(2)}</td>
                        <td>{data.pvalue.toExponential(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
       
    </div>
)}
    </div>
)

}