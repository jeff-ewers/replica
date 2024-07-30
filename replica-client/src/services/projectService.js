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

  export const getAllUserProjects = (userId) => {
    const headers = getAuthHeaders();
    return fetch(`http://localhost:8000/projects?user=${userId}`, {
      method: 'GET',
      headers: headers,
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    }).catch((error) => {
      console.error('Error fetching user projects:', error);
      throw error;
    });
  };

  export const deleteProject = async (projectId) => {
    const headers = getAuthHeaders();
    const response = await fetch(`http://localhost:8000/projects/${projectId}/`, {
      method: 'DELETE',
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return true;
  };

export const getProjectById = (projectId) => {
    const headers = getAuthHeaders();
    return fetch(`http://localhost:8000/projects/${projectId}`, {
        method: 'GET',
        headers: headers,
      }).then((res) =>
      res.json()
    )
  }

  export const saveProject = (projectId, projectData) => {
    const headers = getAuthHeaders();
    const saveOptions = {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(projectData)
    };
    return fetch(`http://localhost:8000/projects/${projectId}/`, saveOptions).then(res => res.json());
  };

  export const getAllProjectTypes = () => {
    const headers = getAuthHeaders();
    return fetch(`http://localhost:8000/project-types/`, {
        method: 'GET',
        headers: headers,
      }).then((res) =>
      res.json()
    )
  }
  
  export const getAnalysisTypesByProjectType = (projectTypeId) => {
    const headers = getAuthHeaders();
    return fetch(`http://localhost:8000/analysis-types/?project_type=${projectTypeId}`, {
        method: 'GET',
        headers: headers,
      }).then(res => res.json());
  };
  
// projectService.js

export const createProject = async (projectData) => {
    const headers = getAuthHeaders();
    const project_root = projectData.project_path;
    
    // Step 1: Create the project
    const projectResponse = await fetch('http://localhost:8000/projects/', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        title: projectData.title,
        description: projectData.description,
        project_type: parseInt(projectData.project_type),
        project_path: projectData.project_path,
        user: projectData.user
      }),
    });
    const createdProject = await projectResponse.json();
  
    // Step 2: Create ProjectAnalysisType entries
    for (const analysisTypeId of projectData.analysis_types) {
      await fetch('http://localhost:8000/project-analysis-types/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          project: createdProject.id,
          analysis_type: parseInt(analysisTypeId),
        }),
      });
    }
  
    // Step 3: Create DataFiles and Conditions
    for (const datafile of projectData.datafiles) {
      // Check if condition exists
      let conditionResponse = await fetch(`http://localhost:8000/conditions/?name=${datafile.condition}`, {
        method: 'GET',
        headers: headers,
      });
      let condition = await conditionResponse.json();
  
      if (condition.length === 0) {
        // Create new condition
        conditionResponse = await fetch('http://localhost:8000/conditions/', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            project: createdProject.id,
            name: datafile.condition,
            description: '', // TODO:  add a description field in form
          }),
        });
        condition = await conditionResponse.json();
      } else {
        condition = condition[0];
      }
  
      // Create datafile
      await fetch('http://localhost:8000/datafiles/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          project: createdProject.id,
          user: projectData.user, 
          file_name: datafile.name,
          file_path: `${project_root}/${datafile.name}`,
          file_type: datafile.file_type,
          condition: condition.id,
        }),
      });
    }
  
    return createdProject;
  };

  export const getProjectAnalysisTypes = async (projectId) => {
    const headers = getAuthHeaders();
    return fetch(`http://localhost:8000/project-analysis-types?project=${projectId}`, {
        method: 'GET',
        headers: headers,
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      }).catch((error) => {
        console.error('Error fetching analysis types:', error);
        throw error;
      });
  }