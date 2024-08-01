import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper, Divider, List, ListItem, ListItemText } from '@mui/material';
import './MyAccount.css';
import { useAuth } from './AuthContext';

const MyAccount = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <Paper elevation={3} sx={{ width: '350px', backgroundColor: '#2c3e50', color: '#ecf0f1', borderRight: '1px solid white' }}>
        <Typography variant="h5" component="div" sx={{ p: 2, textAlign: 'center', color: '#ecf0f1' }}>
          My Account
        </Typography>
        <List component="nav">
          <ListItem button component={Link} to="/my-account" selected={location.pathname === "/my-account"}>
            <ListItemText primary="Profile" sx={{ color: '#ecf0f1' }} />
          </ListItem>
          <ListItem button component={Link} to="/billing" selected={location.pathname === "/billing"}>
            <ListItemText primary="Billing Information" sx={{ color: '#ecf0f1' }} />
          </ListItem>
          <ListItem button component={Link} to="/invoices" selected={location.pathname === "/invoices"}>
            <ListItemText primary="Invoices" sx={{ color: '#ecf0f1' }} />
          </ListItem>
          <ListItem button component={Link} to="/my-plan" selected={location.pathname === "/my-plan"}>
            <ListItemText primary="Current Plan" sx={{ color: '#ecf0f1' }} />
          </ListItem>
          <ListItem button component={Link} to="/my-team" selected={location.pathname === "/my-team"}>
            <ListItemText primary="Team" sx={{ color: '#ecf0f1' }} />
          </ListItem>
        </List>
      </Paper>
      <Box sx={{ flexGrow: 1, p: 4, backgroundColor: '#808080', overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<AccountOverview />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/my-plan" element={<MyPlan />} />
          <Route path="/my-team" element={<MyTeam />} />
          <Route path="*" element={<Navigate to="/my-account" />} />
        </Routes>
      </Box>
    </Box>
  );
};

const AccountOverview = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organizationName: "",
    dateJoined: "",
    address: "",
    profilePictureUrl: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // Fetch user profile from backend
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://127.0.0.1:5000/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          if (data.profilePictureUrl) {
            setPreview(`http://127.0.0.1:5000/uploads/${data.profilePictureUrl}`);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUser({ ...user, profilePicture: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveChanges = async () => {
    setIsEditing(false);
    console.log('Saved changes:', user);

    // Save the changes to the backend
    const formData = new FormData();
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('email', user.email);
    formData.append('organization', user.organizationName);
    formData.append('address', user.address);
    if (user.profilePicture) {
      formData.append('profilePicture', user.profilePicture);
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://127.0.0.1:5000/update-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Profile updated successfully:', data);
        setUser(prevUser => ({ ...prevUser, profilePictureUrl: data.profilePictureUrl }));
        if (data.profilePictureUrl) {
          setPreview(`http://127.0.0.1:5000/uploads/${data.profilePictureUrl}`);
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to update profile:', errorData);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, backgroundColor: '#1a1d24', color: 'white', borderRadius: 5, boxShadow: 2, maxWidth: 600, mx: 'auto', fontSize: '1.25rem', marginTop: '150px' }}>
      <Typography variant="h4" component="div" gutterBottom>
        Profile
      </Typography>
      <Divider sx={{ mb: 3, borderColor: 'white' }} />
      <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <img src={preview} alt="Profile" style={{ width: '180px', height: '160px', borderRadius: '50%' }} />
          {isEditing && (
            <Button variant="contained" component="label">
              Upload Picture
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          )}
        </Box>
        <TextField
          label="First Name"
          name="firstName"
          value={user.firstName}
          onChange={handleInputChange}
          placeholder="First Name"
          InputProps={{
            readOnly: !isEditing,
            sx: { color: 'white' },
          }}
          InputLabelProps={{
            sx: { color: 'white' },
          }}
          sx={{
            '& .MuiInputBase-root': {
              color: 'white',
              fontSize: '1.15rem'
            },
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
          }}
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={user.lastName}
          onChange={handleInputChange}
          placeholder="Last Name"
          InputProps={{
            readOnly: !isEditing,
            sx: { color: 'white' },
          }}
          InputLabelProps={{
            sx: { color: 'white' },
          }}
          sx={{
            '& .MuiInputBase-root': {
              color: 'white',
              fontSize: '1.15rem'
            },
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
          }}
        />
        <TextField
          label="Email"
          name="email"
          value={user.email}
          onChange={handleInputChange}
          placeholder="Email"
          InputProps={{
            readOnly: !isEditing,
            sx: { color: 'white' },
          }}
          InputLabelProps={{
            sx: { color: 'white' },
          }}
          sx={{
            '& .MuiInputBase-root': {
              color: 'white',
              fontSize: '1.15rem'
            },
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
          }}
        />
        <TextField
          label="Organization Name"
          name="organizationName"
          value={user.organizationName}
          onChange={handleInputChange}
          placeholder="Organization Name"
          InputProps={{
            readOnly: !isEditing,
            sx: { color: 'white' },
          }}
          InputLabelProps={{
            sx: { color: 'white' },
          }}
          sx={{
            '& .MuiInputBase-root': {
              color: 'white',
              fontSize: '1.15rem'
            },
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
          }}
        />
        <TextField
          label="Date Joined"
          name="dateJoined"
          value={user.dateJoined}
          onChange={handleInputChange}
          placeholder="Date Joined"
          InputProps={{
            readOnly: !isEditing,
            sx: { color: 'white' },
          }}
          InputLabelProps={{
            sx: { color: 'white' },
          }}
          sx={{
            '& .MuiInputBase-root': {
              color: 'white',
              fontSize: '1.15rem'
            },
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
          }}
        />
        <TextField
          label="Address"
          name="address"
          value={user.address}
          onChange={handleInputChange}
          placeholder="Address"
          InputProps={{
            readOnly: !isEditing,
            sx: { color: 'white' },
          }}
          InputLabelProps={{
            sx: { color: 'white' },
          }}
          sx={{
            '& .MuiInputBase-root': {
              color: 'white',
              fontSize: '1.15rem'
            },
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsEditing(!isEditing)}
          sx={{ fontSize: '1.15rem' }}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
        {isEditing && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSaveChanges}
            sx={{ fontSize: '1.15rem' }}
          >
            Save changes
          </Button>
        )}
      </Box>
    </Paper>
  );
};

const Billing = () => <div>Billing Information Content</div>;
const Invoices = () => <div>Invoices Content</div>;
const MyPlan = () => <div>Current Plan Content</div>;
const MyTeam = () => <div>Team Content</div>;

export default MyAccount;
