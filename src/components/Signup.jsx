import React, { useState } from 'react';
import { Form, Button, Schema } from 'rsuite';
import './Signup.css';  // Import the CSS file

const { StringType } = Schema.Types;

const model = Schema.Model({
  email: StringType().isEmail('Please enter a valid email address').isRequired('Email is required'),
  firstName: StringType().isRequired('First Name is required'),
  lastName: StringType().isRequired('Last Name is required'),
  organization: StringType(),
  password: StringType().isRequired('Password is required')
});

const Signup = () => {
  const [formValue, setFormValue] = useState({ email: '', firstName: '', lastName: '', organization: '', password: '' });
  const [formError, setFormError] = useState({});

  const handleSubmit = async () => {
    if (!form.check()) {
      console.error('Form Error');
      return;
    }

    console.log('Form Value', formValue);

    // Make a POST request to the backend
    try {
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formValue)
      });

      if (response.ok) {
        console.log('User registered successfully');
      } else {
        console.error('Error registering user');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  let form;

  return (
    <div className="signup-container">
      <h4 className='trial-content'>First 3-Weeks Are On Us!</h4>
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
          <Form.ControlLabel>
            Email:
            {!formValue.email && <span className="required-asterisk">*</span>}
          </Form.ControlLabel>
          <Form.Control name="email" type="email" placeholder="Email" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>
            First Name:
            {!formValue.firstName && <span className="required-asterisk">*</span>}
          </Form.ControlLabel>
          <Form.Control name="firstName" type="text" placeholder="First Name" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>
            Last Name:
            {!formValue.lastName && <span className="required-asterisk">*</span>}
          </Form.ControlLabel>
          <Form.Control name="lastName" type="text" placeholder="Last Name" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>
            Organization Name:
          </Form.ControlLabel>
          <Form.Control name="organization" type="text" placeholder="Organization Name" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>
            Password:
            {!formValue.password && <span className="required-asterisk">*</span>}
          </Form.ControlLabel>
          <Form.Control name="password" type="password" placeholder="Password" />
        </Form.Group>
        <div className="checkbox-and-button">
          <Button appearance="primary" onClick={handleSubmit} className="signup-button">Create Account</Button>
        </div>
      </Form>
    </div>
  );
};

export default Signup;
