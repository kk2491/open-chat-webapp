"use strict";

// const USER_ID = localStorage.getItem("USER_ID") || null;
// const ACCESS_TOKEN = localStorage.getItem("ACCESS_TOKEN") || null;
// const REFRESH_TOKEN = localStorage.getItem("REFRESH_TOKEN") || null;
// const TOKEN_EXPIRATION_TIMESTAMP = localStorage.getItem("TOKEN_EXPIRATION_TIMESTAMP") || null;

export const saveUserId = (userId) => {
  localStorage.setItem("USER_ID", userId);
};

export const retrieveUserId = () => {
  return localStorage.getItem("USER_ID");
};

export const saveAccessToken = (accessToken) => {
  localStorage.setItem("ACCESS_TOKEN", accessToken);
};

export const retrieveAccessToken = () => {
  return localStorage.getItem("ACCESS_TOKEN");
};

export const saveRefreshToken = (refreshToken) => {
  localStorage.setItem("REFRESH_TOKEN", refreshToken);
};

export const retrieveRefreshToken = () => {
  return localStorage.getItem("REFRESH_TOKEN");
};

export const saveTokenExpirationTimestamp = (tokenExpirationTimestamp) => {
  localStorage.setItem("TOKEN_EXPIRATION_TIMESTAMP", tokenExpirationTimestamp);
};

export const retrieveTokenExpirationTimestamp = () => {
  return localStorage.getItem("TOKEN_EXPIRATION_TIMESTAMP");
};
