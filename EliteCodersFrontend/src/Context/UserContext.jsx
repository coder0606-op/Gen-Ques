import axios from "axios";
import PropTypes from "prop-types";
import { createContext, useState, useEffect } from "react";

const BACKEND_URI = "https://jwt-s0r0.onrender.com";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Check if the user is already authenticated based on localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedEmail && storedAccessToken && storedRefreshToken) {
      setUserDetails({ ...userDetails, email: storedEmail });
      // Optionally, you could verify the access token expiration time here and refresh if necessary
    }
  }, []);

  const storeTokens = (email, accessToken, refreshToken) => {
    localStorage.setItem("email", email);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const clearTokens = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const registerUser = async () => {
    if (!userDetails.name ||!userDetails.email ||!userDetails.password) {
      throw new Error("All fields are required for registration!");
    }
    try {
      const response = await axios.post(
        `${BACKEND_URI}/api/auth/register`,
        userDetails
      );
      storeTokens(
        response.data.email,
        response.data.accessToken,
        response.data.refreshToken
      );
      return response.data;
    } catch (err) {
      console.error("Registration failed:", err);
      return err.response?.data || err;
    }
  };

  const loginUser = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URI}/api/auth/login`,
        userDetails
      );
      storeTokens(
        response.data.email,
        response.data.accessToken,
        response.data.refreshToken
      );
      return response.data;
    } catch (err) {
      console.error("Login failed:", err);
      return err.response?.data || err;
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // If no refresh token is available, prompt user to log in
        clearTokens();
        return;
      }

      const response = await axios.post(`${BACKEND_URI}/api/auth/refresh`, {
        refreshToken,
      });

      if (response.data.accessToken && response.data.refreshToken) {
        storeTokens(
          response.data.email,
          response.data.accessToken,
          response.data.refreshToken
        );
        return response.data;
      }
    } catch (err) {
      console.error("Error refreshing token:", err);
      clearTokens();
    }
  };

  const updatedUser = async () => {
    try {
      const response = await axios.put(
        `${BACKEND_URI}/api/user/update-password`,
        userDetails
      );
      return response.data;
    } catch (err) {
      console.error("Error updating password:", err);
      return err.response?.data || err;
    }
  };

  const logoutUser = async () => {
    const email = localStorage.getItem("email");
    if (email) {
      try {
        const response = await axios.post(
          `${BACKEND_URI}/api/user/logout/${email}`,
          { email }
        );
        console.log("Logout successful:", response.data);
      } catch (err) {
        console.error("Logout failed:", err);
        return err.response?.data || err;
      }
    }
    clearTokens();
    // Optionally, reset userDetails state
    setUserDetails({ name: "", email: "", password: "", role: "employee" });
  };

  return (
    <UserContext.Provider
      value={{
        userDetails,
        setUserDetails,
        registerUser,
        loginUser,
        updatedUser,
        refreshToken,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserProvider;
