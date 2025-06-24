import React, { useState, useEffect } from 'react';
import '../../App.css';
import { useAuthContext } from '../onboarding/authProvider';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Button, Box, MenuItem, TextField, InputLabel, Select, FormControl, Typography, TableCell, TableContainer, TableRow, Table, TableHead, TableBody } from '@mui/material';

const UserSettings = () => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { org_id, user_id } = useAuthContext();

	// State for users data
	const [users, setUsers] = useState([]);

	// State for modal form
	const [selectedUser, setSelectedUser] = useState(null);
	const [editedUser, setEditedUser] = useState(null);
	const [invitedUser, setInvitedUser] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		// Fetch users data
		const fetchUsers = async () => {
			try {
				const response = await fetch(`${baseURL}/organizations/users/${org_id}/${user_id}`);
				if (response.ok) {
					const data = await response.json();
					setUsers(data);
				} else {
					console.error('Error fetching users:', response.statusText);
				}
			} catch (error) {
				console.error('Error fetching users:', error);
			}
		};
		if (user_id) fetchUsers();
	}, [baseURL, org_id, user_id]);

	// Handle form input change
	const handleFieldChange = (field, value) => {
		setEditedUser(prev => ({ ...prev, [field]: value }));
	};

	// Save changes
	const handleSave = () => {
		const url = `${baseURL}/organizations/edituser/${org_id}/${user_id}/`;
		const options = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(editedUser),
		};
		fetch(url, options)
			.then(response => {
				if (!response.ok) {
					console.error('Error saving user:', response.statusText);
					throw new Error('Failed to edit user');
				}
				// Update local state
				setUsers(prev => prev.map(user => (user.default_id === editedUser.id ? editedUser : user)));
				setSelectedUser(null);
			})
			.catch(error => {
				console.error('Error saving user:', error);
			});
	};

	// Cancel edits
	const handleCancel = () => {
		setEditedUser(null);
		setSelectedUser(null);
		setInvitedUser(false);
		setIsSaving(false);
	};

	// invite user
	const [userData, setUserData] = useState({
		email: null,
		username: null,
		role: 'Driver',
		phone: null,
	});

	const handleChange = e => {
		const { name, value } = e.target;
		setUserData(prevAsset => ({
			...prevAsset,
			[name]: value,
		}));
	};

	const handleInvite = e => {
		setIsSaving(true);
		// Define the URL for the POST request
		const url = `${baseURL}/organizations/users/${org_id}/${user_id}/`;
		const data = {
			email: userData.email,
			username: userData.username,
			role: userData.role,
			phone: userData.phone,
		};
		const options = {
			method: 'POST', // Specify the HTTP method
			headers: {
				'Content-Type': 'application/json', // Specify the content type of the request body
			},
			body: JSON.stringify(data), // Convert data to JSON string for the request body
		};
		fetch(url, options)
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to invite user confirm user email');
				}
				console.log('user invited successfully');
				setInvitedUser(false);
				setIsSaving(false);
			})
			.catch(error => {
				console.error('Error inviting user:', error);
			});
	};

	return (
		<Box style={{ padding: '0px',  margin: '0 auto' }}>
				<Button
					onClick={() => {
						setInvitedUser(true);
					}}
					style={{
						padding: '10px 15px',
						backgroundColor: '#01947A',
						color: 'White',
						border: 'none',
						borderRadius: '20px',
						fontSize: '10px',
					}}
				>
					Invite User
				</Button>
			

 <TableContainer  sx={{ height: "100%", width: "100%", overflow: "scroll",
	 }} >
	   <Table stickyHeader aria-label="sticky table" >
			 <TableHead >
			   <TableRow backgroundColor='var(--secondary-bg-color)' style={{ backgroundColor: 'var(--secondary-bg-color)' }} >
							<TableCell>
								<strong>Name</strong>
							</TableCell>
							<TableCell>
								<strong>Email</strong>
							</TableCell>
							<TableCell>
								<strong>Role</strong>
							</TableCell>
							<TableCell>
								<strong>Phone</strong>
							</TableCell>
							<TableCell>
								<strong>Status</strong>
							</TableCell>
							<TableCell align='center'>
								<strong>Actions</strong>
							</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{users.map((user, index) => (
							<TableRow key={index} hover>
								<TableCell>{user.username}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.role}</TableCell>
								<TableCell>{user.phone}</TableCell>
								<TableCell>{user.status}</TableCell>
								<TableCell align='center'>
									<IconButton
										onClick={() => {
											setSelectedUser(user);
											setEditedUser({ ...user });
										}}
										sx={{ color: '#047A9A' }}
									>
										<EditIcon />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{selectedUser && (
				<Box
					style={{
						position: 'fixed',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						backgroundColor: 'white',
						boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
						padding: '20px',
						borderRadius: '8px',
						zIndex: 1000,
					}}
				>
					<Typography variant='h6' gutterBottom>
						Edit User
					</Typography>
					<Box sx={{ padding: 2 }}>
						<TextField label='Name' variant='outlined' fullWidth sx={{ marginBottom: 2 }} value={editedUser.username} onChange={e => handleFieldChange('username', e.target.value)} />

						<TextField label='Email' variant='outlined' fullWidth sx={{ marginBottom: 2 }} value={editedUser.email} disabled />

						<FormControl fullWidth sx={{ marginBottom: 2 }}>
							<InputLabel>Role</InputLabel>
							<Select value={editedUser.role} onChange={e => handleFieldChange('role', e.target.value)} label='Role'>
								<MenuItem value='Driver'>Driver</MenuItem>
								<MenuItem value='Manager'>Manager</MenuItem>
								<MenuItem value='Admin'>Admin</MenuItem>
							</Select>
						</FormControl>

						<TextField label='Phone' variant='outlined' fullWidth sx={{ marginBottom: 2 }} value={editedUser.phone} onChange={e => handleFieldChange('phone', e.target.value)} />

						<FormControl fullWidth sx={{ marginBottom: 2 }}>
							<InputLabel>Status</InputLabel>
							<Select value={editedUser.status} onChange={e => handleFieldChange('status', e.target.value)} label='Status'>
								<MenuItem value='Active'>Active</MenuItem>
								<MenuItem value='Off Duty'>Off Duty</MenuItem>
								<MenuItem value='Disabled'>Disabled</MenuItem>
							</Select>
						</FormControl>

						<Box display='flex' justifyContent='space-between' sx={{ marginTop: 2 }}>
							<Button
								variant='contained'
								onClick={handleSave}
								sx={{
									bgcolor: '#047A9A',
									'&:hover': {
										backgroundColor: '#047A9A',
									},
								}}
							>
								Save
							</Button>
							<Button
								variant='contained'
								onClick={handleCancel}
								sx={{
									bgcolor: 'error.main',
									'&:hover': {
										backgroundColor: 'error.main',
									},
								}}
							>
								Cancel
							</Button>
						</Box>
					</Box>
				</Box>
			)}

			{selectedUser && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						zIndex: 999,
					}}
					onClick={handleCancel}
				/>
			)}

			{invitedUser && (
				<Box
					style={{
						position: 'fixed',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						backgroundColor: 'white',
						boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
						padding: '20px',
						borderRadius: '8px',
						zIndex: 1000,
					}}
				>
					<Typography variant='h6' gutterBottom>
						Invite New User
					</Typography>
					<Box>
						<Box sx={{ padding: 2 }}>
							<TextField label='Name' name='username' fullWidth sx={{ marginBottom: 2 }} onChange={handleChange} variant='outlined' />
							<TextField label='Email' name='email' type='email' fullWidth sx={{ marginBottom: 2 }} onChange={handleChange} variant='outlined' />
							<FormControl fullWidth sx={{ marginBottom: 2 }}>
								<InputLabel id='role-label'>Role</InputLabel>
								<Select labelId='role-label' name='role' value={userData.role || ''} label='Role' onChange={handleChange}>
									<MenuItem value='org:operator'>Driver</MenuItem>
									<MenuItem value='org:asset_manager'>Manager</MenuItem>
									<MenuItem value='org:admin'>Admin</MenuItem>
								</Select>
							</FormControl>
							<TextField label='Phone' name='phone' fullWidth onChange={handleChange} variant='outlined' />

							<Box display='flex' justifyContent='space-between' mt={2}>
								<Button
									variant='contained'
									onClick={handleInvite}
									disabled={isSaving}
									sx={{
										bgcolor: 'var(--secondary-color)',
										'&:hover': {
											backgroundColor: 'var(--secondary-hover-color)',
											color: 'black',
										},
									}}
								>
									 {isSaving ? 'Saving...' : 'Save'}
								</Button>
								<Button
									variant='contained'
									sx={{
										bgcolor: 'error.main',
										'&:hover': {
											backgroundColor: 'error.main',
										},
									}}
									onClick={handleCancel}
								>
									Cancel
								</Button>
							</Box>
						</Box>
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default UserSettings;
