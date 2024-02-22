import React from "react";
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import MyComponent from "./components/MyComponent";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import InviteUser from "./components/InviteUser";
import ManageUsers from "./components/ManageUsers";
import ChatMessage from "./components/ChatMessage";
import logo from "./logo.svg";
import "./App.css";

// function App() {
//   return (
//     <div className="app-container">
//       <h1 className="App-header">User Management</h1>
//       <InviteUser />
//     </div>
//   );
// }

// export default App;

function App() {
  return (
    <div className="app-container">
      <h1 className="App-header">Open Chat</h1>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/dashboard/invite" element={<InviteUser />} />
          <Route path="/dashboard/messages" element={<ChatMessage />} />
          <Route path="/dashboard/users" element={<ManageUsers />} />
          <Route path="/" element={<SignIn />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

// function App() {
//   return (
//     <div className="app-container">
//       <h1 className="App-header">User Management</h1>
//       <Router>
//         <Routes>
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;
