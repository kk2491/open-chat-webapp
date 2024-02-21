import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "./ChatMessage.css";
import { getUsersService, editUserService, deleteUserService, getGroups, getMessages, addNewMessage } from "../common/ApiServices";
Modal.setAppElement("#root");

const userId = "65a2b5e4b4662e235e0229ae";

const ChatMessage = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        let groupsOutput = await getGroups();
        console.log(groupsOutput);

        if (groupsOutput.success) {
          setGroups(groupsOutput.groups);
          console.log(groups);

          if (groupsOutput.groups.length) {
            setSelectedGroup(groupsOutput.groups[0]);
          }
        } else {
          setError("Something went wrong, please try again");
        }
      } catch (err) {
        console.log("fetchGroups error : ", err);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log("selected new group, fetch messages");
        if (selectedGroup) {
          const messagesOutput = await getMessages(selectedGroup.id);

          if (messagesOutput.success) {
            setMessages(messagesOutput.messages);
            console.log("messagesOutput.messages => ", messagesOutput.messages);
          } else {
            console.log("something went wrong");
            setError("Something went wrong, please try again");
          }
        }
      } catch (err) {
        console.log("fetchMessages error : ", err);
      }
    };

    fetchMessages();
  }, [selectedGroup]);

  const handleGroupChange = (group) => {
    console.log("Is this clicked???");
    setSelectedGroup(group);
  };

  const handleSendMessage = async () => {
    console.log("send new message");

    if (selectedGroup && newMessage.trim() != "") {
      // send new message
      await addNewMessage(selectedGroup.id, userId, newMessage);
      // should return the updated new messages
      const messagesOutput = await getMessages(selectedGroup.id);

      if (messagesOutput.success) {
        setMessages(messagesOutput.messages);
        console.log("messagesOutput.messages => ", messagesOutput.messages);
      } else {
        console.log("something went wrong");
        setError("Something went wrong, please try again");
      }
      // setMessages()
      setNewMessage("");
    }
  };

  return (
    <div className="chat-messages-container">
      <div className="group-list">
        <h2> Groups </h2>
        <ul>
          {groups.map((group) => (
            <li key={group.id} className={group.id === selectedGroup.id ? "selected-group" : ""} onClick={() => handleGroupChange(group)}>
              {group.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="messages-container">
        <h2>Messages</h2>
        <ul className="message-list">
          {messages.map((message) => (
            <li key={message.id}>
              <strong>{message.sender}</strong> {message.message}{" "}
            </li>
          ))}
        </ul>
      </div>

      {selectedGroup && (
        <div className="new-message-form">
          <textarea
            rows={4}
            placeholder="Type your message...!"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          ></textarea>
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
