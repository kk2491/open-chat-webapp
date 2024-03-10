import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Joi from "joi";
import "./ManageGroups.css";
import { getGroups, getUsersService, createGroupServices } from "../common/ApiServices";
import { retrieveUserId } from "../common/Storage";

const ManageGroups = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [error, setError] = useState("");
  const [createNewGroupPopup, setCreateNewGroupPopup] = useState(false);
  const [searchUserText, setSearchuserText] = useState("");
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [addedUserIds, setAddedUserIds] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [fetchGroups, setFetchGroups] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        let currentUserId = retrieveUserId();
        let groupsOutput = await getGroups(currentUserId);
        console.log("groupsOutput => ", groupsOutput);

        if (groupsOutput.success) {
          setGroups(groupsOutput.groups);
        } else {
          setError("Something went wrong");
        }
      } catch (err) {
        console.log("fetchGroups error : ", err);
        setError("Something went wrong");
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let usersOutput = await getUsersService();
        console.log("usersOutput => ", usersOutput);

        if (usersOutput.success) {
          setUsers(usersOutput.users);
        } else {
          setError("Something went wrong");
        }
      } catch (err) {
        console.log("fetchUsers error : ", err);
        setError("Something went wrong");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filteredUsers = [];
    if (searchUserText != "") {
      filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchUserText.toLowerCase()));
      console.log("filteredUsers ===> ", filteredUsers);
    }

    // remove already added users from the filtered users
    let updatedFilteredUsers = [];
    console.log("added user ids ===> ", addedUserIds);
    for (let i = 0; i < filteredUsers.length; i++) {
      let filteredUserId = filteredUsers[i].id;

      if (addedUserIds.find((obj) => obj == filteredUserId)) {
        continue;
      } else {
        updatedFilteredUsers.push(filteredUsers[i]);
      }
    }

    setMatchingUsers(updatedFilteredUsers);
    return;
  }, [searchUserText, users, addedUserIds]);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    return;
  };

  const handleNewGroupCreation = () => {
    console.log("handleNewGroupCreation");
    setCreateNewGroupPopup(true);
    return;
  };

  const handlePopupModelCreate = async () => {
    // call the API
    let createGroupInput = {
      name: groupName,
      userIds: addedUserIds,
    };

    let createGroupOutput = await createGroupServices(createGroupInput);

    if (createGroupOutput.success) {
      setCreateNewGroupPopup(false);
      setFetchGroups(true);
    } else {
      console.log("something went wrong..!!!");
    }

    return;
  };

  const handlePopupModelCancel = () => {
    setCreateNewGroupPopup(false);
    return;
  };

  const addUserToGroup = (userId) => {
    setAddedUserIds((prevUserIds) => {
      console.log("prevUserIds => ", prevUserIds);
      return [...prevUserIds, userId];
    });
    return;
  };

  return (
    <div>
      <div className="managegroups-outer-container">
        <h2>Manage your groups</h2>
        <button className="creategroup-button" onClick={handleNewGroupCreation}>
          Create new group
        </button>
        <div className="managegroups-container">
          <div className="managegroups-groups-layout">
            <h3>Groups</h3>
            <ul className="managegroups-group-list">
              {groups.map((group) => (
                <li
                  className={
                    selectedGroup && group.id == selectedGroup.id
                      ? "managegroups-group-item managegroups-group-item-selected"
                      : "managegroups-group-item"
                  }
                  key={group.id}
                  onClick={() => handleGroupClick(group)}
                >
                  {group.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Note: only name is being displayed
            Any user fields can be added as future improvement */}

          <div className="managegroups-users-layout">
            <h3>Users</h3>
            <ul className="managegroups-user-list">
              {selectedGroup &&
                selectedGroup.users.map((user) => (
                  <li className="managegroups-user-item" key={user._id}>
                    {user.name}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      <div>
        <Modal
          isOpen={createNewGroupPopup}
          onRequestClose={handlePopupModelCancel}
          contentLabel="Create New Group"
          className="create-new-group-layout"
        >
          <h3 className="create-new-group-header">Create New Group</h3>

          <div className="add-user-group-container-col">
            <div className="add-user-group-container">
              <input placeholder="group name" onChange={(e) => setGroupName(e.target.value)}></input>
            </div>

            <div className="add-user-group-container">
              <input
                type="text"
                placeholder="search user"
                value={searchUserText}
                onChange={(e) => setSearchuserText(e.target.value)}
              ></input>
              <button>Add</button>
            </div>

            <div>
              {matchingUsers.map((user) => (
                <div key={user.id} onClick={() => addUserToGroup(user.id)}>
                  {user.name}
                </div>
              ))}
            </div>
          </div>

          <div className="create-group-buttons-container">
            <button className="create-group-buttons" onClick={handlePopupModelCreate}>
              Create Group
            </button>
            <button className="create-group-buttons" onClick={handlePopupModelCancel}>
              Cancel
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ManageGroups;
