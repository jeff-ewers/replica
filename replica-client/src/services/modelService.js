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

  export const getModels = () => {
    const headers = getAuthHeaders();
    return fetch(`${API_URL}/ml-models/`, {
        method: 'GET',
        headers: headers,
      }).then((res) =>
      res.json()
    )
}