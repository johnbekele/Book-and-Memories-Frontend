import React, { useState, useContext } from 'react';
import LoginForm from '../Components/LoginForm';
import { emailValidator } from '../helper/emailValidator';
import { passwordValidator } from '../helper/passwordValidator';
import AuthContext from '../Context/AuthContext';

const LoginPage = () => {
  // Get context with error handling
  const context = useContext(AuthContext);

  // Safety check
  if (!context) {
    console.error(
      'AuthContext is undefined. Check if AuthProvider is wrapping your app correctly.'
    );
    return <div>Authentication error. Please refresh the page.</div>;
  }

  const { login, googleLogin } = context;

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate email
    const emailError = emailValidator(formData.identifier);
    if (emailError) {
      newErrors.identifier = emailError;
    }

    // Validate password
    const passwordError = passwordValidator(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = {
      identifier: formData.identifier,
      password: formData.password,
    };
    if (validateForm(loginData)) {
      try {
        const success = await login(loginData);
        if (!success) {
          setErrors({
            ...errors,
            general: 'Login failed. Please check your credentials.',
          });
        }
      } catch (error) {
        setErrors({
          ...errors,
          general: error.message || 'Login failed. Please try again.',
        });
      }
    }
  };

  const handleGoogleLogin = () => {
    googleLogin();
  };

  return (
    <LoginForm
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleGoogleLogin={handleGoogleLogin}
      errors={errors}
    />
  );
};

export default LoginPage;
