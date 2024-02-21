import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2 className="dashboard h2"> Welcome to the Dashboard</h2>
      <p className="dashboard p">Explore the features and manage your account.</p>
      <ul className="dashboard ul">
        <li className="dashboard li">
          <Link to="/dashboard/invite" className="link-button">
            Invite Users
          </Link>
        </li>
        <li className="dashboard li">
          <Link to="/dashboard/messages" className="link-button">
            Chat Messages
          </Link>
        </li>
        <li className="dashboard li">
          <Link to="/dashboard/users" className="link-button">
            Manage Users
          </Link>
        </li>
        <li className="dashboard li">
          <Link to="/dashboard/groups" className="link-button">
            Manage Groups
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
