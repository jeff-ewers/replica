import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAnalysis, getAnalysisTypes } from '../../services/analysisService';
import './AnalysisDetail.css'

export const AnalysisDetail = () => {
  const { analysisId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [resultData, setResultData] = useState(null);
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
          const cleanedJsonString = data.results[0].result
            .replace(/:\s*NaN/g, ': null')
            .replace(/:\s*Infinity/g, ': null')
            .replace(/:\s*-Infinity/g, ': null');
          
          try {
            const parsedResult = JSON.parse(cleanedJsonString);
            if (data.analysis_type === 1) {
              setResultData(parsedResult.slice(0, 100));
            } else if (data.analysis_type === 2) {
              setResultData({
                significant_genes: parsedResult.significant_genes.slice(0, 100),
                gsea_results: parsedResult.gsea_results.slice(0, 100)
              });
            } else {
              setResultData(parsedResult);
            }
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
    if (!resultData) return null;

    if (analysis.analysis_type === 1) {
      const columns = Object.keys(resultData[0]);
      return (
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
                {columns.map((column, colIndex) => (
                  <td 
                    key={`${index}-${column}`}
                    style={colIndex === 3 ? { color: parseFloat(row[column]) >= 0 ? 'green' : 'red'} : {}}
                  >
                    {row[column]?.toString().substring(0, 15)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (analysis.analysis_type === 2) {
      return (
        <>
          <h4>Significant Genes</h4>
          <table className="result-table">
            <thead>
              <tr>
                {Object.keys(resultData.significant_genes[0]).map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resultData.significant_genes.map((row, index) => (
                <tr key={index}>
                  {Object.entries(row).map(([column, value], colIndex) => (
                    <td 
                      key={`${index}-${column}`}
                      style={column === 'log2FoldChange' ? { color: parseFloat(value) >= 0 ? 'green' : 'red'} : {}}
                    >
                      {value?.toString().substring(0, 15)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <h4>GSEA Results</h4>
          <table className="result-table">
            <thead>
              <tr>
                {Object.keys(resultData.gsea_results[0]).map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resultData.gsea_results.map((row, index) => (
                <tr key={index}>
                  {Object.entries(row).map(([column, value], colIndex) => (
                    <td key={`${index}-${column}`}
                    className={colIndex === 0 ? 'gsea-term-column' : ''}>
                      {colIndex === 0 
                        ? value?.toString().substring(0, 70) 
                        : value?.toString().substring(0, 15)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    } else if (analysis.analysis_type === 3) {
      return (
        resultData.map((result) => (
          <div className="result-card" key={`${result?.file_name}`}>
            <h3>{result?.sequence_id}</h3>
            <img 
              src={`/api/visualizations/${encodeURIComponent(result?.visualization_path)}`}
              alt={`Contact map for ${result.file_name}`}
            />
          </div>
        ))
      );
    }
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
          <p><strong>Analysis Type:</strong> {analysisTypes[analysis.results[0].analysis_type-1]?.description}</p>
          <p><strong>Status:</strong> {analysis.status}</p>
          <p><strong>GSEA Library:</strong> {analysis.gsea_library ? analysis.gsea_library : "N/A"}</p>
        </div>
        <p><strong>Output File Path:</strong> {analysis.results[0].output_file_path}</p>
        <p><strong>Created:</strong> {(new Date(analysis.results[0].created_at)).toLocaleString()}</p>
        <p><strong>Updated:</strong> {(new Date(analysis.updated_at)).toLocaleString()}</p>
      </div>

      <h3>Result Data (Top 100 Rows)</h3>
      <div className="result-table-container" style={{overflowX: 'auto'}}>
        {renderResultTable()}
      </div>
    </div>
  );
};

export default AnalysisDetail;