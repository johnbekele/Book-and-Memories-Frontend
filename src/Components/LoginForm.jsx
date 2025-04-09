import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../Context/ThemeContext'; // Adjust the import path as needed

const LoginForm = ({
  formData,
  handleChange,
  handleSubmit,
  handleGoogleLogin,
  errors,
}) => {
  const { theme, colors } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <StyledWrapper isDark={isDarkMode} colors={colors}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form className="form" onSubmit={handleSubmit}>
          <motion.h1
            className="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome Back
          </motion.h1>
          <motion.p
            className="subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Sign in to continue your journey
          </motion.p>

          <div className="input-group">
            <label htmlFor="identifier">Email</label>
            <div className="input-container">
              <svg
                height={20}
                viewBox="0 0 32 32"
                width={20}
                xmlns="http://www.w3.org/2000/svg"
                className="input-icon"
              >
                <g id="Layer_3" data-name="Layer 3">
                  <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
                </g>
              </svg>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                id="identifier"
                name="identifier"
                className="input"
                placeholder="Enter your email"
                value={formData.identifier}
                onChange={handleChange}
              />
            </div>
            {errors?.identifier && (
              <div className="error">{errors.identifier}</div>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <svg
                height={20}
                viewBox="-64 0 512 512"
                width={20}
                xmlns="http://www.w3.org/2000/svg"
                className="input-icon"
              >
                <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
              </svg>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="password"
                id="password"
                name="password"
                className="input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {errors?.password && <div className="error">{errors.password}</div>}
          </div>

          <div className="flex-row">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <motion.span
              className="forgot-password"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Forgot password?
            </motion.span>
          </div>

          <motion.button
            type="submit"
            className="button-submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign In
          </motion.button>

          <p className="signup-text">
            Don't have an account?{' '}
            <motion.span whileHover={{ scale: 1.05 }} className="signup-link">
              Sign Up
            </motion.span>
          </p>

          <div className="divider">
            <span>Or continue with</span>
          </div>

          <div className="social-buttons">
            <motion.button
              type="button"
              className="social-button google"
              onClick={handleGoogleLogin}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg
                version="1.1"
                width={20}
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 512 512"
                style={{ enableBackground: 'new 0 0 512 512' }}
                xmlSpace="preserve"
              >
                <path
                  style={{ fill: '#FBBB00' }}
                  d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
                  c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
                  C103.821,274.792,107.225,292.797,113.47,309.408z"
                />
                <path
                  style={{ fill: '#518EF8' }}
                  d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
                  c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
                  c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"
                />
                <path
                  style={{ fill: '#28B446' }}
                  d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
                  c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
                  c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
                />
                <path
                  style={{ fill: '#F14336' }}
                  d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
                  c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
                  C318.115,0,375.068,22.126,419.404,58.936z"
                />
              </svg>
              <span>Google</span>
            </motion.button>
            <motion.button
              type="button"
              className="social-button apple"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg
                version="1.1"
                height={20}
                width={20}
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 22.773 22.773"
                style={{ enableBackground: 'new 0 0 22.773 22.773' }}
                xmlSpace="preserve"
                className="apple-icon"
              >
                <g>
                  <g>
                    <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z" />
                    <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0 c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019 c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464 c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648 c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z" />
                  </g>
                </g>
              </svg>
              <span>Apple</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 20px;
  background-color: ${(props) => props.colors.backgroundColor};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    sans-serif;
  transition: background-color 0.3s ease;

  .form {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 450px;
    padding: 2.5rem;
    border-radius: 16px;
    background-color: ${(props) => (props.isDark ? '#1f1f1f' : '#ffffff')};
    box-shadow: ${(props) =>
      props.isDark
        ? '0 10px 25px rgba(0, 0, 0, 0.3)'
        : '0 10px 25px rgba(0, 0, 0, 0.05)'};
    transition: all 0.3s ease;
  }

  .title {
    color: ${(props) => props.colors.textColor};
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
    text-align: center;
  }

  .subtitle {
    color: ${(props) => (props.isDark ? '#a0a0a0' : '#666')};
    font-size: 16px;
    text-align: center;
    margin-bottom: 30px;
  }

  .input-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    color: ${(props) => props.colors.textColor};
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .input-container {
    position: relative;
    display: flex;
    align-items: center;
    background-color: ${(props) => (props.isDark ? '#2b2b2b' : '#f5f7fa')};
    border-radius: 12px;
    border: 1.5px solid ${(props) => props.colors.borderColor};
    height: 54px;
    padding: 0 16px;
    transition: all 0.2s ease;
  }

  .input-container:focus-within {
    border-color: ${(props) => props.colors.buttonText};
    box-shadow: ${(props) =>
      props.isDark
        ? `0 0 0 2px rgba(${props.colors.buttonText}, 0.2)`
        : `0 0 0 3px rgba(${props.colors.buttonText}, 0.1)`};
  }

  .input-icon {
    fill: ${(props) => props.colors.buttonText};
  }

  .input {
    flex: 1;
    background: transparent;
    border: none;
    height: 100%;
    color: ${(props) => props.colors.textColor};
    font-size: 16px;
    padding: 0 12px;
  }

  .input:focus {
    outline: none;
  }

  .input::placeholder {
    color: ${(props) => (props.isDark ? '#777' : '#aaa')};
  }

  .error {
    color: #ff5555;
    font-size: 13px;
    margin-top: 6px;
    font-weight: 500;
  }

  .flex-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0 25px;
  }

  .remember-me {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .remember-me input[type='checkbox'] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid ${(props) => (props.isDark ? '#444' : '#d1d1d1')};
    border-radius: 4px;
    background-color: ${(props) => (props.isDark ? '#2b2b2b' : '#fff')};
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
  }

  .remember-me input[type='checkbox']:checked {
    background-color: ${(props) => props.colors.buttonText};
    border-color: ${(props) => props.colors.buttonText};
  }

  .remember-me input[type='checkbox']:checked::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 2px;
    width: 5px;
    height: 9px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .remember-me label {
    margin-bottom: 0;
    color: ${(props) => props.colors.textColor};
    font-size: 14px;
    cursor: pointer;
  }

  .forgot-password {
    color: ${(props) => props.colors.buttonText};
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .forgot-password:hover {
    text-decoration: underline;
  }

  .button-submit {
    height: 54px;
    border: none;
    border-radius: 12px;
    background-color: ${(props) => props.colors.buttonBackground};
    color: ${(props) => props.colors.btntextcolor};
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    margin: 10px 0;
  }

  .button-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  .signup-text {
    text-align: center;
    color: ${(props) => props.colors.textColor};
    font-size: 14px;
    margin: 20px 0;
  }

  .signup-link {
    color: ${(props) => props.colors.buttonText};
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .signup-link:hover {
    text-decoration: underline;
  }

  .divider {
    position: relative;
    text-align: center;
    margin: 15px 0 25px;
  }

  .divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: ${(props) => props.colors.borderColor};
  }

  .divider span {
    position: relative;
    background-color: ${(props) => (props.isDark ? '#1f1f1f' : '#ffffff')};
    padding: 0 15px;
    color: ${(props) => (props.isDark ? '#888' : '#999')};
    font-size: 14px;
  }

  .social-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .social-button {
    height: 50px;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 15px;
    border: 1.5px solid ${(props) => props.colors.borderColor};
    background-color: ${(props) => (props.isDark ? '#2b2b2b' : '#f8f9fa')};
    color: ${(props) => props.colors.textColor};
  }

  .social-button:hover {
    transform: translateY(-2px);
  }

  .google:hover {
    border-color: #f14336;
    box-shadow: 0 3px 10px rgba(241, 67, 54, 0.2);
  }

  .apple-icon {
    fill: ${(props) => props.colors.textColor};
  }

  .apple:hover {
    border-color: ${(props) => props.colors.textColor};
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 480px) {
    .form {
      padding: 1.5rem;
    }

    .social-buttons {
      grid-template-columns: 1fr;
    }

    .title {
      font-size: 24px;
    }
  }
`;

export default LoginForm;
