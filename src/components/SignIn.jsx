import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Joi from "joi";
import { signInService } from "../common/ApiServices";
import {
  saveUserId,
  saveAccessToken,
  saveRefreshToken,
  saveTokenExpirationTimestamp,
  retrieveTokenExpirationTimestamp,
  retrieveAccessToken,
  retrieveRefreshToken,
  retrieveUserId,
} from "../common/Storage";
import "./SignIn.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signInSchema = Joi.object({
    email: Joi.string().email({ tlds: false }).required(),
    password: Joi.string().min(6).required(),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let signInInput = {
      email: email,
      password: password,
    };

    try {
      signInInput = await signInSchema.validateAsync(signInInput);
    } catch (err) {
      console.log("input validation failed : ", err);
      setError("Input error, kindly check the data entered");
      return;
    }

    // call services function to sign in user
    let signInOutput = await signInService(signInInput);

    if (signInOutput.success) {
      saveUserId(signInOutput.data.userId);
      saveAccessToken(signInOutput.data.accessToken);
      saveRefreshToken(signInOutput.data.refreshToken);
      saveTokenExpirationTimestamp(signInOutput.data.tokenExpirationTime);
      console.log(
        signInOutput.data.userId,
        signInOutput.data.accessToken,
        signInOutput.data.refreshToken,
        signInOutput.data.tokenExpirationTime
      );

      console.log("============");
      let temp1 = retrieveAccessToken();
      console.log("temp1 : ", temp1);
      let temp2 = retrieveRefreshToken();
      console.log("temp2 : ", temp2);
      let temp3 = retrieveUserId();
      console.log("temp3 : ", temp3);
      let temp4 = retrieveTokenExpirationTimestamp();
      console.log("temp2 : ", temp4);

      console.log("successfully signed in");
      navigate("/dashboard");
    } else {
      setError("Something went wrong, please try again");
    }

    return;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} className="signin-form">
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
        {error && error !== "" && (
          <div className="error-summary">
            <p> Something went wrong, please try again</p>
          </div>
        )}
        <button type="submit" className="submit-button">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
