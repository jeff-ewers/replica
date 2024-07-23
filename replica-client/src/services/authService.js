// src/services/authService.js

export const loginUser = async (username, password) => {
    const response = await fetch('http://localhost:8000/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }
  
    const data = await response.json();
    return {
      token: data.token,
      user: {
        id: data.user.id,
        username: data.user.username,
        is_active: data.user.is_active
      }
    };
  };