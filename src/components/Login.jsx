// Login.jsx

import React, { useState } from 'react';
import { Form, Button, Schema, Checkbox } from 'rsuite';
import './Login.css';  // Import the CSS file

const { StringType } = Schema.Types;

const model = Schema.Model({
  email: StringType().isEmail('Please enter a valid email address').isRequired('Email is required'),
  password: StringType().isRequired('Password is required')
});

const Login = () => {
  const [formValue, setFormValue] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState({});

  const handleSubmit = () => {
    if (!form.check()) {
      console.error('Form Error');
      return;
    }
    console.log('Form Value', formValue);
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
          <Form.ControlLabel>Username or Email:</Form.ControlLabel>
          <Form.Control name="email" type="email" placeholder="Username" />
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
      <div className="forgot-password">
        <a href="#forgot-password">Forgot your password?</a>
      </div>
    </div>
  );
};

export default Login;
