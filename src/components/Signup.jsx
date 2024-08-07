import React, { useState } from 'react';
import { Form, Button, Schema } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import axios from 'axios';

const { StringType } = Schema.Types;

const model = Schema.Model({
  email: StringType().isEmail('Please enter a valid email address').isRequired('Email is required'),
  firstName: StringType().isRequired('First Name is required'),
  lastName: StringType().isRequired('Last Name is required'),
  organization: StringType().isRequired('Organization Name is required'),
  password: StringType().isRequired('Password is required')
});

const Signup = () => {
  const [formValue, setFormValue] = useState({ email: '', firstName: '', lastName: '', organization: '', password: '' });
  const [formError, setFormError] = useState({});
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.check()) {
      console.error('Form Error');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/register', formValue);
      setMessage('Account was created!');
      setTimeout(() => {
        navigate('/login');
      }, 1000); 
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  let form;

  return (
    <div className="signup-container">
      <h2>Create an account</h2>
      {message && <div className="signup-message">{message}</div>}
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
          <Form.ControlLabel>First Name:</Form.ControlLabel>
          <Form.Control name="firstName" type="text" placeholder="First Name" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Last Name:</Form.ControlLabel>
          <Form.Control name="lastName" type="text" placeholder="Last Name" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Organization Name:</Form.ControlLabel>
          <Form.Control name="organization" type="text" placeholder="Organization Name" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Password:</Form.ControlLabel>
          <Form.Control name="password" type="password" placeholder="Password" />
        </Form.Group>
        <div className="checkbox-and-button">
          <Button appearance="primary" onClick={handleSubmit} className="signup-button">Sign up</Button>
        </div>
      </Form>
    </div>
  );
};

export default Signup;
