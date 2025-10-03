import { useUser, useOrganizationList } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  Box,
  MenuItem,
} from '@mui/material';

const CreateOrganizationPage = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { user } = useUser();
  const user_org = user?.organizationMemberships[0]?.organization?.id;
  console.log('>>>>this', user_org);

  const { createOrganization, setActive } = useOrganizationList();
  const [formData, setFormData] = useState({
    org_name: '',
    org_country: '',
    org_email: '',
    org_currency: '',
  });
  const [issaving, setIssaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIssaving(true);
    if (!user) return;
    let organizationId = user?.organizationMemberships[0]?.organization?.id;

    if (!organizationId) {
      const org = await createOrganization({ name: formData.org_name });
      await setActive({ organization: org });
      organizationId = org.id;
    }

		const url = `${baseURL}/public/organizations/`;
    const data = {
    org_name: formData.org_name,
    org_id: organizationId,
    org_created_by: user.id,
    org_country: formData.org_country,
    org_email: formData.org_email,
    org_currency: formData.org_currency,

    user_id: user.id,
    username: user.firstName + ' ' + user.lastName,
    email: user.emailAddresses[0]?.emailAddress,
    user_phone: user.phoneNumbers[0]?.phoneNumber,
    organization_id: organizationId,
    role: 'admin',
    is_organization_admin: true,

   
      ...formData,
      userId: user.id, // Assuming you want to associate the operator with the current user
      organizationId: user.organizationId, // Assuming you want to associate the operator with the current organization
    }
    const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		};
		fetch(url, options)
		.then(response => {
			if (!response.ok) {
				throw new Error('Failed to add Organisation - check email and mandatory fields ');
			}
			console.log('Organisation added successfully');
      window.location.href = "/";
		})
		.catch(error => {
			console.error('Error adding Organisation:', error);
		});
	};
 
  useEffect(() => {
    if (user && user_org && !issaving) {
      window.location.href = "/";
    }
  }, [user, user_org, issaving]);



  return (
    <Box sx={{ backgroundColor: 'var(--secondary-color)', position:'fixed', top:0, left:0 , height: '100vh', width: '100vw', margin:0 }}> 
    <Container maxWidth="sm"  sx={{ backgroundColor: 'var(--main-bg-color)', marginTop:'10vh'}}    >
    <Box mt={4} mb={4}>
      <Typography variant="h5" align="center">Setup your Organization with Sanasana Sustainability</Typography>
    </Box>
    <form onSubmit={handleSubmit}>
    <Grid container spacing={2}>
  {/* Organization Name */}
  <Grid item xs={12}>
    <TextField
      fullWidth
      required
      label="Organization Name"
      name="org_name"
      type="text"
      value={formData.org_name}
      onChange={handleChange}
    />
  </Grid>

  {/* Email */}
  <Grid item xs={12}>
    <TextField
      fullWidth
      required
      label="Email"
      name="org_email"
      type="email"
      value={formData.org_email}
      onChange={handleChange}
    />
  </Grid>

  {/* Country Dropdown */}
  <Grid item xs={12}>
    <TextField
      select
      fullWidth
      required
      label="Country"
      name="org_country"
      value={formData.org_country}
      onChange={handleChange}
    >
      {['Ghana', 'Kenya', 'Ethiopia', 'Nigeria', 'Uganda', 'Tanzania', 'USA', 'Other',
        'South Africa', 'Rwanda', 'Burundi', 'Zambia', 'Zimbabwe', 'Malawi', 'South Sudan'].map((country) => (
        <MenuItem key={country} value={country}>
          {country}
        </MenuItem>
      ))}
    </TextField>
  </Grid>

  {/* Currency Dropdown */}
  <Grid item xs={12}>
    <TextField
      select
      fullWidth
      required
      label="Currency"
      name="org_currency"
      value={formData.org_currency}
      onChange={handleChange}
    >
      {['Cedis', 'Kes', 'Br', 'Naira', 'Ush', 'Tsh', 'USD',
        'Rand', 'Rwf', 'Bif', 'Zambian Kwacha', 'ZWL', 'Malawian Kwacha', 'SSP', 'EUR'].map((currency) => (
        <MenuItem key={currency} value={currency}>
          {currency}
        </MenuItem>
      ))}
    </TextField>
  </Grid>

 

  {/* Submit Button */}
  <Grid item xs={12}>
    <Button type="submit" variant="contained" color="primary" sx={{ backgroundColor:'var(--secondary-color)' }}  fullWidth>
      Create Organization
    </Button> 
  </Grid>
</Grid>
    </form>
    <br/>  <br/>  
<hr/> <br/>  
    <Box><Typography> Not an admin ?
      Kindly request your company admin to invite you  to gain access
       </Typography> </Box>
       <br/> 
  </Container>
  </Box>
  );
}

export default CreateOrganizationPage;