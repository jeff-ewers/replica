import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAnalysis } from '../../services/analysisService';

export const AnalysisDetail = () => {
  const { analysisId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const data = await getAnalysis(analysisId);
        setAnalysis(data);
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
        <table className="result-table">
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
                {columns.map((column) => (
                  <td key={`${index}-${column}`}>{row[column]?.toString().substring(0, 50)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!analysis) return <div>No analysis data found</div>;

  return (
    <div className="analysis-detail">
      <h2>Analysis Details</h2>
      <div className="analysis-info">
        <p><strong>ID:</strong> {analysis.id}</p>
        <p><strong>User ID:</strong> {analysis.user}</p>
        <p><strong>Project ID:</strong> {analysis.project}</p>
        <p><strong>Analysis Type:</strong> {analysis.analysis_type}</p>
        <p><strong>GSEA Library:</strong> {analysis.gsea_library}</p>
        <p><strong>Status:</strong> {analysis.status}</p>
        <p><strong>Created At:</strong> {analysis.created_at}</p>
        <p><strong>Updated At:</strong> {analysis.updated_at}</p>
      </div>

      <h3>Result</h3>
      <div className="result-info">
        <p><strong>ID:</strong> {analysis.results[0].id}</p>
        <p><strong>Analysis ID:</strong> {analysis.results[0].analysis_id}</p>
        <p><strong>Analysis Type:</strong> {analysis.results[0].analysis_type}</p>
        <p><strong>Output File Path:</strong> {analysis.results[0].output_file_path}</p>
        <p><strong>Created At:</strong> {analysis.results[0].created_at}</p>
      </div>

      <h3>Result Data (First 100 Rows)</h3>
      {renderResultTable()}
    </div>
  );
};

export default AnalysisDetail;