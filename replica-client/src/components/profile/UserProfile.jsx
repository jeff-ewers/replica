import React, { useState, useEffect } from 'react';
import { getUserById } from '../../services/userService';
import './UserProfile.css';

export const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('replica_user'));
        if (userData && userData.id) {
          const fetchedUser = await getUserById(userData.id);
          setUser(fetchedUser);
        } else {
          setError('User data not found in local storage');
        }
      } catch (err) {
        setError('Error fetching user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return <div className="error">User not found</div>;

  return (
    <div className="user-profile">
      <h1>User Profile</h1>
      <div className="profile-info">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>First Name:</strong> {user.first_name}</p>
        <p><strong>Last Name:</strong> {user.last_name}</p>
        <p><strong>Date Joined:</strong> {new Date(user.date_joined).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

