import React, { useState } from 'react';
import { Form, Button, Schema, Checkbox, Message } from 'rsuite';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { StringType } = Schema.Types;

const model = Schema.Model({
  email: StringType().isEmail('Please enter a valid email address').isRequired('Email is required'),
  password: StringType().isRequired('Password is required')
});

const Login = ({ onLogin }) => {
  const [formValue, setFormValue] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState({});
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.check()) {
      console.error('Form Error');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/login', formValue);
      setMessage({ type: 'success', content: response.data.message });
      onLogin();
      navigate('/my-account');
    } catch (error) {
      if (error.response) {
        setMessage({ type: 'error', content: error.response.data.message });
      } else {
        setMessage({ type: 'error', content: 'Error submitting form' });
      }
      console.error('Error submitting form', error);
    }
  };

  let form;

  return (
    <div className="login-container">
      <h2>Welcome back!</h2>
      {message && (
        <Message showIcon type={message.type}>
          {message.content}
        </Message>
      )}
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
