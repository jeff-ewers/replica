const API_URL = `http://localhost:8000`;
const getAuthHeaders = () => {
    const replicaUserString = localStorage.getItem('replica_user');
    if (!replicaUserString) {
      console.error('No user data found in localStorage');
      return { 'Content-Type': 'application/json' };
    }
  
    try {
      const replicaUser = JSON.parse(replicaUserString);
      const token = replicaUser.token;
      
      if (!token) {
        console.error('No token found in user data');
        return { 'Content-Type': 'application/json' };
      }
  
      return {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      };
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return { 'Content-Type': 'application/json' };
    }
  };

  export const runAnalysis = async (analysis, project) => {
    const headers = getAuthHeaders();
    headers['Content-Type'] = 'application/json';

    // convert parameters object to use IDs as keys
    const parameterValues = Object.entries(analysis.parameters).reduce((acc, [key, value]) => {
        acc[parseInt(key)] = parseFloat(value);
        return acc;
    }, {});

    const gsea_library = (analysis.analysis_type_id == 2 ? analysis.gsea_library_id : null )

    const response = await fetch(`${API_URL}/start-analysis/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            analysis: {
                user_id: analysis.user_id,
                analysis_type_id: analysis.analysis_type_id,
                gsea_library_id: gsea_library,
                status: analysis.status,
                parameter_values: parameterValues,
                ml_model_id: analysis.ml_model
            },
            project: {
                ...project,
                id: project.id
            }
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to start analysis: ${JSON.stringify(errorData)}`);
    }
    return response.json();
};

export const getGSEALibraries = () => {
    const headers = getAuthHeaders();
    return fetch(`${API_URL}/gsea-libraries/`, {
        method: 'GET',
        headers: headers,
      }).then((res) =>
      res.json()
    )
}

export const getAnalysis = (analysisId) => {
    const headers = getAuthHeaders();
    return fetch(`${API_URL}/analyses/${analysisId}`, {
        method: 'GET',
        headers: headers,
      }).then((res) =>
      res.json()
    )
}

export const getAnalysisTypes = () => {
    const headers = getAuthHeaders();
    return fetch(`${API_URL}/analysis-types/`, {
        method: 'GET',
        headers: headers,
      }).then((res) =>
      res.json()
    )
}

export const getAnalysisParameters = (analysis_type) => {
    const headers = getAuthHeaders();
    return fetch(`${API_URL}/analysis-parameters?analysis_type=${analysis_type}`, {
        method: 'GET',
        headers: headers,
      }).then((res) =>
      res.json()
    )
}

export const getAnalysisById = async (analysisId) => {
    const headers = getAuthHeaders();
    
    try {
        const response = await fetch(`${API_URL}/analyses/${analysisId}/`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch analysis');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching analysis:', error);
        throw error;
    }
};