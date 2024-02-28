import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Joi from "joi";
import "./ManageGroups.css";
import { getGroups } from "../common/ApiServices";
import { retrieveUserId } from "../common/Storage";

const ManageGroups = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        let currentUserId = retrieveUserId();
        let groupsOutput = await getGroups(currentUserId);

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

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    return;
  };

  return (
    <div className="managegroups-outer-container">
      <h2>Manage your groups</h2>
      <button className="creategroup-button">Create new group</button>
      <div className="managegroups-container">
        <div className="managegroups-groups-layout">
          <h3>Groups</h3>
          <ul className="managegroups-group-list">
            {groups.map((group) => (
              <li
                className={
                  group.id == selectedGroup.id ? "managegroups-group-item managegroups-group-item-selected" : "managegroups-group-item"
                }
                key={group.id}
                onClick={() => handleGroupClick(group)}
              >
                {group.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="managegroups-users-layout">
          <h3>Users</h3>
          <ul className="managegroups-user-list">
            {selectedGroup &&
              selectedGroup.userIds.map((user) => (
                <li className="managegroups-user-item" key={user}>
                  {user}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// YOU NEED A NEW ENDPOINT

export default ManageGroups;

{
  /* <button className="managegroups-button">Create new group</button>
<div className="managegroups-layout-container">
  <div className="managergroup-layouts">
    <div className="managergroup-layout">
      <h2>Groups</h2>
      <ul className="managegroups-grouplist">
        {groups.map((obj) => (
          <li key={obj.id} onClick={() => handleGroupClick(obj)}>
            {obj.name}
          </li>
        ))}
      </ul>
    </div>
  </div>

  <div className="managegroups-users">
    <h2>Users</h2>
    <ul className="managegroups-userlist">{selectedGroup && selectedGroup.userIds.map((obj) => <li key={obj}> {obj}</li>)}</ul>
  </div>
</div> */
}
