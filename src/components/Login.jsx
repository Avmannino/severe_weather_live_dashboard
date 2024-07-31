import React, { useState } from 'react';
import { Form, Button, Schema, Checkbox } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import './Login.css'; 

const { StringType } = Schema.Types;

const model = Schema.Model({
  email: StringType().isEmail('Please enter a valid email address').isRequired('Email is required'),
  password: StringType().isRequired('Password is required')
});

const Login = () => {
  const [formValue, setFormValue] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState({});
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async () => {
    if (!form.check()) {
      console.error('Form Error');
      return;
    }

    console.log('Form Value', formValue);

    // POST request to backend
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formValue)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        setLoginError('');  
        // Storing the token
        localStorage.setItem('token', data.access_token);
        login();  // Updating the authentication state
        // Redirect to /my-account
        navigate('/my-account');
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        setLoginError('Invalid email or password.');
      }
    } catch (error) {
      console.error('Network error:', error);
      setLoginError('Network error. Please try again.');
    }
  };

  let form;

  return (
    <div className="login-container">
      <h2>Welcome back!</h2>
      <Form
        fluid
        ref={ref => (form = ref)}
        onChange={formValue => {
          setFormValue(formValue);
        }}
        onCheck={formError => {
          setFormError(formError);
        }}
        formValue={formValue}
        model={model}
      >
        <Form.Group>
          <Form.ControlLabel>Email:</Form.ControlLabel>
          <Form.Control name="email" type="email" placeholder="Email" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Password:</Form.ControlLabel>
          <Form.Control name="password" type="password" placeholder="Password" />
        </Form.Group>
        <div className="checkbox-and-button">
          <Button appearance="primary" onClick={handleSubmit} className="login-button">Login</Button>
          <Checkbox className="rs-checkbox">Remember Me</Checkbox>
        </div>
      </Form>
      {loginError && <p className="login-error">{loginError}</p>}
      <div className="forgot-password">
        <a href="#forgot-password">Forgot your password?</a>
      </div>
      <div className="signup-card">
        <span>Don't have an account?</span>
        <a href="/sign-up" className="signup-link">Create one here</a>
      </div>
    </div>
  );
};

export default Login;
