import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "./ManageUsers.css";
import { getUsersService, editUserService, deleteUserService } from "../common/ApiServices";
Modal.setAppElement("#root");

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editUserPopup, setEditUserPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [editedName, setEditedName] = useState("");
  const [editedPhoneNumber, setEditedPhoneNumber] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      let usersOutput = await getUsersService();

      if (usersOutput.success) {
        console.log("here");
        setUsers(usersOutput.users);
      } else {
        setError("Something went wrong");
      }
    };

    fetchUsers();
  }, []);

  const editUser = (user) => {
    setEditUserPopup(true);
    setSelectedUser(user);
    setEditedName(user.name);
    setEditedPhoneNumber(user.phoneNumber);
  };

  const handlePopupModelCancel = () => {
    setEditUserPopup(false);
  };

  const handlePopupModelSave = async () => {
    // call edit user API
    let userId = selectedUser.id;

    let userUpdateData = {
      name: editedName,
      phoneNumber: editedPhoneNumber,
    };

    let updateStatus = await editUserService(userId, userUpdateData);

    if (updateStatus.success) {
      setEditUserPopup(false);
    } else {
      setError("Something went wrong while fetching users post deletion");
    }
  };

  // TODO(Kishor): Need a confirm pop up
  const deleteUser = async (user) => {
    console.log("deleteUser");
    console.log(user);
    let userId = user.id;
    let deleteStatus = await deleteUserService(userId);

    if (deleteStatus == "success") {
      console.log("delete is successful");
      let updatedUsers = await getUsersService();

      if (updatedUsers.success) {
        setUsers(updatedUsers.users);
      } else {
        console.log("Something went wrong while fetching users post deletion");
      }
    } else {
      setError("Something went wrong, please try again");
    }
  };

  return (
    <div className="manage-users-container">
      <h2>Manage Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.email} className="user-item">
            <div className="user-info">
              <div className="info-item">
                <span className="info-label">Name : </span>
                <span className="info-value">{user.name}</span>
              </div>
              <div>
                <span className="info-label">Email : </span>
                <span className="info-value">{user.email}</span>
              </div>
              <div>
                <span className="info-label">Phone Number : </span>
                <span className="info-value">{user.phoneNumber}</span>
              </div>
              <div>
                <span className="info-label">Created on : </span>
                <span className="info-value">{user.createdTimestamp}</span>
              </div>
            </div>
            <div className="user-actions">
              <button onClick={() => editUser(user)}>Edit</button>
              <button onClick={() => deleteUser(user)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <Modal isOpen={editUserPopup} onRequestClose={handlePopupModelCancel} contentLabel="Edit User" className="edit-user-modal">
        <h2>Edit User</h2>
        <label>
          Name:
          <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)}></input>
        </label>
        <label>
          Phone Number:
          <input type="text" value={editedPhoneNumber} onChange={(e) => setEditedPhoneNumber(e.target.value)}></input>
        </label>
        <div className="modal-buttons">
          <button onClick={handlePopupModelSave}>Save</button>
          <button onClick={handlePopupModelCancel}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsers;
