"use strict";

import axios from "axios";
import {
  retrieveUserId,
  retrieveAccessToken,
  retrieveRefreshToken,
  retrieveTokenExpirationTimestamp,
  saveAccessToken,
  saveRefreshToken,
  saveTokenExpirationTimestamp,
} from "./Storage";

// const apiUrl = "http://162.18.0.2:4001/v1/";
const apiUrl = "https://open-chat-server-l44x.onrender.com/v1/";
// let accessToken =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWEyYjVlNGI0NjYyZTIzNWUwMjI5YWUiLCJ1c2VyRW1haWwiOiJ0ZXN0NkB0ZXN0LmNvbSIsImFjY291bnRJZCI6IjY1YTJiNWU0YjQ2NjJlMjM1ZTAyMjlhYyIsImlhdCI6MTcwNjA3OTAzNCwiZXhwIjoxNzA2MDgyNjM0fQ.t6r5VyO4pweE-jHlJ8RPj8iOguj2opVhE28RFylFjIk";

export const signUpService = async (signUpInput) => {
  try {
    let userSignUpOutput = null;
    let userSignUpEndpoint = apiUrl + "/users/signup";

    try {
      let userSignUpResponse = await axios.post(userSignUpEndpoint, signUpInput);
      userSignUpOutput = {
        success: true,
        data: userSignUpResponse.data,
      };
    } catch (err) {
      console.log("signUpService axios error : ", err);
      userSignUpOutput = {
        success: false,
      };
    }

    return userSignUpOutput;
  } catch (err) {
    console.log("signUpService error : ", err);
  }
};

export const signInService = async (signInInput) => {
  try {
    let userSignInOutput = null;
    let userSignInEndpoint = apiUrl + "/users/signin";

    try {
      let userSignInResponse = await axios.post(userSignInEndpoint, signInInput);
      userSignInOutput = {
        success: true,
        data: userSignInResponse.data,
      };
    } catch (err) {
      console.log("signInService axios error : ", err);
      userSignInOutput = {
        success: false,
      };
    }

    return userSignInOutput;
  } catch (err) {
    console.log("signInService error : ", err);
  }
};

export const generateNewToken = async (refreshToken) => {
  try {
    let tokenEndpoint = apiUrl + "users/token";
    let tokenInput = {
      refreshToken: refreshToken,
    };
    let tokenOutput = null;

    try {
      let tokenResponse = await axios.post(tokenEndpoint, tokenInput);
      tokenOutput = tokenResponse.data;
    } catch (err) {
      console.log("=================================================");
      console.log("generateNewToken axios error : ", err.response.data);
    }

    return tokenOutput;
  } catch (err) {
    console.log("generateNewToken error : ", err);
  }
};

export const generateNewTokenIfExpired = async () => {
  try {
    let tokenExpirationTimestamp = retrieveTokenExpirationTimestamp();
    console.log("tokenExpirationTimestamp => ", tokenExpirationTimestamp);
    let accessToken = retrieveAccessToken();
    let refreshToken = retrieveRefreshToken();
    let currentTimestamp = new Date();
    console.log("currentTimestamp => ", currentTimestamp);
    let tokenTimestamp = new Date(Date.now() + tokenExpirationTimestamp * 1000);
    console.log("tokenTimestamp   => ", tokenTimestamp);

    if (currentTimestamp < tokenTimestamp) {
      console.log("token is not expired, hence return");
      return;
    }

    let newTokens = await generateNewToken(refreshToken);

    if (!newTokens) {
      console.log("something went wrong");
      return;
    }

    saveAccessToken(newTokens.accessToken);
    saveRefreshToken(newTokens.refreshToken);
    saveTokenExpirationTimestamp(newTokens.tokenExpirationTime);

    return;
  } catch (err) {
    console.log("generateNewTokenIfExpired error : ", err);
  }
};

export const inviteUserService = async (inviteUserInput) => {
  try {
    await generateNewTokenIfExpired();
    let accessToken = retrieveAccessToken("accessToken");

    let inviteUserOutput = null;
    let inviteUserEndpoint = apiUrl + "/users/invite";
    let config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    try {
      let inviteUserResponse = await axios.post(inviteUserEndpoint, inviteUserInput, config);
      inviteUserOutput = {
        success: true,
        data: inviteUserResponse.data,
      };
    } catch (err) {
      console.log("inviteUserService axios error : ", err);
      inviteUserOutput = {
        success: false,
      };
    }

    return inviteUserOutput;
  } catch (err) {
    console.log("inviteUserService error : ", err);
  }
};

export const getUsersService = async () => {
  try {
    if (false) {
      return {
        success: true,
        users: [
          {
            name: "chongesh",
            phoneNumber: "+91444441111",
            email: "chongesh@123.com",
          },
          {
            name: "mangesh",
            phoneNumber: "+91444441112",
            email: "mangesh@123.com",
          },
        ],
      };
    }

    await generateNewTokenIfExpired();
    let accessToken = retrieveAccessToken("accessToken");
    let usersOutput = {};

    try {
      let getUsersEndpoint = apiUrl + "users";
      let config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      let getUserResponse = await axios.get(getUsersEndpoint, config);
      usersOutput = {
        success: true,
        users: getUserResponse.data,
      };
    } catch (err) {
      console.log("getUsers axios error : ", err);
      usersOutput = {
        success: false,
      };
    }

    return usersOutput;
  } catch (err) {
    console.log("getUsers error : ", err);
  }
};

export const editUserService = async (userId, userUpdate) => {
  try {
    await generateNewTokenIfExpired();
    let accessToken = retrieveAccessToken("accessToken");

    let updateUserOutput = null;
    let updateUsersEndpoint = apiUrl + "users/" + userId;
    let config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    try {
      let updateUserResponse = await axios.patch(updateUsersEndpoint, userUpdate, config);
      updateUserOutput = {
        success: true,
        users: updateUserResponse.data,
      };
    } catch (err) {
      console.log("editUserService axios error : ", err);
      updateUserOutput = {
        success: false,
      };
    }

    return updateUserOutput;
  } catch (err) {
    console.log("editUserService error : ", err);
  }
};

export const deleteUserService = async (userId) => {
  try {
    await generateNewTokenIfExpired();
    let accessToken = retrieveAccessToken("accessToken");

    let deleteUserOutput = null;
    let deleteUsersEndpoint = apiUrl + "users/" + userId;
    let config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    try {
      let deleteUserResponse = await axios.delete(deleteUsersEndpoint, config);
      deleteUserOutput = {
        success: true,
        users: deleteUserResponse.data,
      };
    } catch (err) {
      console.log("deleteUserService axios error : ", err);
      deleteUserOutput = {
        success: false,
      };
    }
  } catch (err) {
    console.log("deleteUserService error : ", err);
  }
};

export const getGroups = async (userId) => {
  try {
    await generateNewTokenIfExpired();
    let accessToken = retrieveAccessToken("accessToken");

    let getGroupsOutput = null;
    let getGroupsEndpoint = apiUrl + "groups";

    if (userId) getGroupsEndpoint = getGroupsEndpoint + "?userId=" + userId + "&includeUserDetails=true";

    let config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    try {
      let getGroupsResponse = await axios.get(getGroupsEndpoint, config);
      getGroupsOutput = {
        success: true,
        groups: getGroupsResponse.data,
      };
    } catch (err) {
      console.log("getGroups axios error : ", err);
      getGroupsOutput = {
        success: false,
      };
    }

    return getGroupsOutput;
  } catch (err) {
    console.log("getGroups error : ", err);
  }
};

export const createGroupServices = async (createGroupInput) => {
  try {
    await generateNewTokenIfExpired();
    let accessToken = retrieveAccessToken("accessToken");

    let createGroupOutput = null;
    let createGroupEndpoint = apiUrl + "groups";

    let config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    try {
      let createGroupResponse = await axios.post(createGroupEndpoint, createGroupInput, config);
      createGroupOutput = {
        success: true,
        groups: createGroupResponse.data,
      };
    } catch (err) {
      console.log("createGroupServices axios error : ", err);
      createGroupOutput = {
        success: false,
      };
    }

    return createGroupOutput;
  } catch (err) {
    console.log("createGroupServices error : ", err);
  }
};

export const getMessages = async (groupId) => {
  try {
    if (false) {
      return {
        success: true,
        messages: [
          {
            id: "65ae9d332faa0e7d9a2e0308",
            userId: "65ae9d332faa0e7d9a2e0309",
            sender: "test04",
            groupId: "65ae9f90c0f7fdfbccc84c22",
            message: "I am user Kishor",
          },
          {
            id: "65ae9d2d2faa0e7d9a2e0303",
            userId: "65ae9d2d2faa0e7d9a2e0304",
            sender: "test03",
            groupId: "65ae9f90c0f7fdfbccc84c22",
            message: "Hello Kishor, who are you",
          },
          {
            id: "65ae9d242faa0e7d9a2e02fc",
            userId: "65ae9d242faa0e7d9a2e02fa",
            sender: "test01",
            groupId: "65ae9f90c0f7fdfbccc84c22",
            message: "Welcome Kishor, I know who you are",
          },
        ],
      };
    }

    await generateNewTokenIfExpired();
    let accessToken = retrieveAccessToken("accessToken");

    let getMessagesOutput = null;
    let getMessagesEndpoint = apiUrl + "groups/" + groupId + "/messages";
    let config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    try {
      let getMessagesResponse = await axios.get(getMessagesEndpoint, config);
      getMessagesOutput = {
        success: true,
        messages: getMessagesResponse.data,
      };
    } catch (err) {
      console.log("getMessages axios error : ", err);
      getMessagesOutput = {
        success: false,
      };
    }

    return getMessagesOutput;
  } catch (err) {
    console.log("getMessages error : ", err);
  }
};

export const addNewMessage = async (groupId, userId, newMessage) => {
  try {
    await generateNewTokenIfExpired();
    let accessToken = retrieveAccessToken("accessToken");

    let addNewMessageOutput = null;
    let addNewMessageInput = {
      userId: userId,
      message: newMessage,
    };
    let addNewMessageEndpoint = apiUrl + "groups/" + groupId + "/messages";
    let config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    try {
      let addNewMessagesResponse = await axios.post(addNewMessageEndpoint, addNewMessageInput, config);
      addNewMessageOutput = {
        success: true,
        messages: addNewMessagesResponse.data,
      };
    } catch (err) {
      console.log("getGroups axios error : ", err);
      addNewMessageOutput = {
        success: false,
      };
    }

    return addNewMessageOutput;
  } catch (err) {
    console.log("addNewMessage error : ", err);
  }
};
