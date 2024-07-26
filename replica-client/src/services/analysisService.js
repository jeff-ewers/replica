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

export const runAnalysis = () => {
    const headers = getAuthHeaders();

}

export const getGSEALibraries = () => {
    const headers = getAuthHeaders();
    return fetch(`http://localhost:8000/gsea-libraries/`, {
        method: 'GET',
        headers: headers,
      }).then((res) =>
      res.json()
    )
}

export const getAnalysisParameters = (analysis_type) => {
    const headers = getAuthHeaders();
    return fetch(`http://localhost:8000/analysis-parameters?analysis_type=${analysis_type}`, {
        method: 'GET',
        headers: headers,
      }).then((res) =>
      res.json()
    )
}