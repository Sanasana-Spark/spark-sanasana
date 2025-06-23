// hooks/useAuth.js
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
const baseURL = process.env.REACT_APP_BASE_URL

export const useAuth = () => {
    
    const { user } = useUser();
    const [organization, setOrganization] = useState(null);

    const userId = user?.id;
    const user_id = user?.id;
    const userEmail = user?.emailAddresses[0]?.emailAddress; 
    const user_email = user?.emailAddresses[0]?.emailAddress;
    const user_org = user?.organizationMemberships[0]?.organization?.id;

  useEffect(() => {
    const fetchOrganization = async () => {
      if (user_id) {
        try {
          // const response = await fetch(`${baseURL}/organizations/?userId=${userId}`);
          const response = await fetch(`${baseURL}/organizations/user_org/?user_id=${user_id}&user_email=${user_email}`);
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
  }, [user_id, user_email]);


  const org_id = organization?.id;
  const org_name = organization?.org_name;
  const org_currency = organization?.org_currency;

  return { userId,user_id,userEmail,user_email,org_id, org_name, org_currency, user_org };
};
