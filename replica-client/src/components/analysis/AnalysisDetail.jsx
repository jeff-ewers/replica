import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAnalysis, getAnalysisTypes } from '../../services/analysisService';
import './AnalysisDetail.css'

export const AnalysisDetail = () => {
  const { analysisId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisTypes, setAnalysisTypes] = useState([]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const data = await getAnalysis(analysisId);
        const analysisTypes = await getAnalysisTypes();
        setAnalysis(data);
        setAnalysisTypes(analysisTypes);
        if (data.results[0] && data.results[0].result) {
          // Clean and parse the JSON string
          const cleanedJsonString = data.results[0].result
            .replace(/:\s*NaN/g, ': null')  // Replace NaN with null
            .replace(/:\s*Infinity/g, ': null')  // Replace Infinity with null
            .replace(/:\s*-Infinity/g, ': null');  // Replace -Infinity with null
          
          try {
            const parsedResult = JSON.parse(cleanedJsonString);
            setResultData(parsedResult.slice(0, 100)); // Get first 100 rows
          } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            setError('Error parsing result data');
          }
        }
      } catch (err) {
        setError('Error fetching analysis data');
        console.error("Error fetching analysis data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [analysisId]);


  const renderResultTable = () => {
    if (resultData.length === 0) return null;

    const columns = Object.keys(resultData[0]);

    return (
      <div className="result-table-container" style={{overflowX: 'auto'}}>
        {analysis.results[0].analysis_type <= 2 && (<table className="result-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resultData.map((row, index) => (
              <tr key={index}>
                {columns.map((column, colIndex) => (
                  <td 
                    key={`${index}-${column}`}
                    style={
                      // Adjust index for log2foldchange
                      colIndex == 3
                      ? { color: parseFloat(row[column]) >= 0 ? 'green' : 'red'}
                      : {}
                    }>{row[column]?.toString().substring(0, 15)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>)}
        {analysis.results[0].analysis_type == 3 && (
          resultData.map((result) => (
            <div className="result-card" key={`${result?.file_name}`}>
              <h3>{result?.sequence_id}</h3>
              <img src={result?.visualization_path} alt={`Contact map for ${result.file_name}`}/>
            </div>
          ))
        )}
      </div>
    );
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!analysis) return <div>No analysis data found</div>;

  return (
    <div className="analysis-detail">
      <h2>Analysis Details</h2>

      <h3>Result ID: {analysis.results[0].id}</h3>
      <div className="result-info">
        <div className="result-info-flex">
          <p><strong>Analysis Type:</strong> {analysisTypes[analysis.results[0].analysis_type-1].description}</p>
          <p><strong>Status:</strong> {analysis.status}</p>
          <p><strong>GSEA Library:</strong> {analysis.gsea_library ? analysis.gsea_library : "N/A"}</p>
        </div>
        <p><strong>Output File Path:</strong> {analysis.results[0].output_file_path}</p>
        <p><strong>Created:</strong> {(new Date(analysis.results[0].created_at)).toLocaleString()}</p>
        <p><strong>Updated:</strong> {(new Date(analysis.updated_at)).toLocaleString()}</p>
      </div>

      <h3>Result Data (Truncated)</h3>
      {renderResultTable()}
    </div>
  );
};

export default AnalysisDetail;