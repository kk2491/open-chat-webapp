import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Joi from "joi";
import { signUpService } from "../common/ApiServices";
import { saveUserId, saveAccessToken, saveRefreshToken, saveTokenExpirationTimestamp } from "../common/Storage";
import "./SignUp.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signUpSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ tlds: false }).required(),
    password: Joi.string().min(6).required(),
    reenterPassword: Joi.string().min(6).required(),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let signUpInput = {
      name: name,
      email: email,
      password: password,
      reenterPassword: reenterPassword,
    };

    try {
      signUpInput = await signUpSchema.validateAsync(signUpInput);
    } catch (err) {
      console.log("input validation failed : ", err);
      setError("Input error, kindly check the data entered");
      return;
    }

    if (password != reenterPassword) {
      console.log("password does not match, please try again");
      setError("password does not match, please try again");
      return;
    }

    // call services function to create account / create user
    let signUpOutput = await signUpService(signUpInput);

    if (signUpOutput.success) {
      saveUserId(signUpOutput.data.userId);
      saveAccessToken(signUpOutput.data.accessToken);
      saveRefreshToken(signUpOutput.data.refreshToken);
      saveTokenExpirationTimestamp(signUpOutput.data.tokenExpirationTime);
      console.log("successfully signed up");

      navigate("/dashboard");
    } else {
      setError("Something went wrong, please try again");
    }

    return;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "reenterPassword":
        setReenterPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label>
            Name:
            <input type="text" name="name" value={name} onChange={handleChange} />
          </label>
        </div>
        <div className="form-group">
          <label>
            Email:
            <input type="text" name="email" value={email} onChange={handleChange} />
          </label>
        </div>
        <div className="form-group">
          <label>
            Password:
            <input type="text" name="password" value={password} onChange={handleChange} />
          </label>
        </div>
        <div className="form-group">
          <label>
            Reenter Password:
            <input type="text" name="reenterPassword" value={reenterPassword} onChange={handleChange} />
          </label>
        </div>
        {error && error !== "" && (
          <div className="error-summary">
            <p> Something went wrong, please try again</p>
          </div>
        )}
        <button type="submit" className="signup-submit-button">
          Sign Up
        </button>
        <button type="button" className="signup-signin-button" onClick={handleSignIn}>
          Already have an account? Sign in here
        </button>
      </form>
    </div>
  );
};

export default SignUp;
