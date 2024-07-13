// hooks/useAuth.js
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
const baseURL = process.env.REACT_APP_BASE_URL

export const useAuth = () => {
    
    const { user } = useUser();
    const [organization, setOrganization] = useState(null);

    const userId = user?.id;
    const userEmail = user?.emailAddresses[0]?.emailAddress;

  useEffect(() => {
    const fetchOrganization = async () => {
      if (userId) {
        try {
          const response = await fetch(`${baseURL}/organizations/${userId}`);
          if (response.ok) {
            const data = await response.json();
            setOrganization(data);
          } else {
            console.error('Error fetching organization:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching organization:', error);
        }
      }
    };

    fetchOrganization();
  }, [userId]);

  return { userId, userEmail, organization };
};
