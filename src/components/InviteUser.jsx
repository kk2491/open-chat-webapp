import React, { useState } from "react";
import Modal from "react-modal";
import Joi from "joi";
import clipboardCopy from "clipboard-copy";
import RandomString from "randomstring";
import "./InviteUser.css";
import { inviteUserService } from "../common/ApiServices";

Modal.setAppElement("#root");

const InviteUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);

  const inviteUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ tlds: false }).required(),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let inviteUserInput = {
      name: name,
      email: email,
    };

    try {
      inviteUserInput = await inviteUserSchema.validateAsync(inviteUserInput);
    } catch (err) {
      console.log("input validation failed : ", err);
      setError("Input error, kindly check the data entered");
      return;
    }

    // generate random password
    let randomPassword = RandomString.generate({ length: 6, charset: "alphabetic" });
    setPassword(randomPassword);

    // call services function to sign in user
    inviteUserInput.password = randomPassword;
    let inviteUserOutput = await inviteUserService(inviteUserInput);

    if (inviteUserOutput.success) {
      setSubmitted(true);
      setPopupOpen(true);
      console.log("invite user is successful");
    } else {
      setError("Something went wrong, please try again");
    }

    return;
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const copyToClipboard = async () => {
    const textToCopy = `Name: ${name}\nEmail: ${email}\nPassword: ${password}`;
    await clipboardCopy(textToCopy);
    alert("Copied to clipboard!");
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
      default:
        break;
    }
  };

  return (
    <div className="signin-container">
      <Modal isOpen={popupOpen} onRequestClose={closePopup} className="invite-user-modal" overlayClassName="invite-user-overlay">
        <div className="invite-user-popup">
          <span className="close" onClick={closePopup}>
            &times;
          </span>
          <h2>Invitation Details</h2>
          <p>Name: {name}</p>
          <p>Email: {email}</p>
          <p>Password: {password}</p>
          <button onClick={copyToClipboard}>Copy to Clipboard</button>
          <button onClick={closePopup}>OK</button>
        </div>
      </Modal>

      <h2>Invite Users</h2>
      <form onSubmit={handleSubmit} className="signin-form">
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
        {error && error !== "" && (
          <div className="error-summary">
            <p> Something went wrong, please try again</p>
          </div>
        )}
        <button type="submit" className="submit-button">
          Invite User
        </button>
      </form>
    </div>
  );
};

export default InviteUser;
