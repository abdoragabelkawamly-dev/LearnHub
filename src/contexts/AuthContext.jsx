import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext({});

const normalizePayload = (payload) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return payload;
  }

  if (payload.data !== undefined && payload.data !== null) {
    const { data: nestedData, ...rest } = payload;
    const flattenedPayload = {
      ...rest,
      ...nestedData,
    };

    return normalizePayload(flattenedPayload);
  }

  return payload;
};

const getErrorMessage = (error) => {
  const responseData = error?.response?.data;

  if (typeof responseData === "string") {
    return responseData;
  }

  if (responseData && typeof responseData === "object") {
    // Handle array-based errors like {"InvalidLogin": ["..."]}
    for (const key in responseData) {
      if (Array.isArray(responseData[key]) && responseData[key].length > 0) {
        return responseData[key][0];
      }
    }

    return (
      responseData.message ||
      responseData.error ||
      responseData.title ||
      responseData.data?.message ||
      responseData.data?.error ||
      "Request failed"
    );
  }

  return error?.message || "Request failed";
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user from storage", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  const isAuthenticated = !!user;

  const login = async (email, password, rememberMe = true) => {
    const response = await api.post("/api/Account/Login", { email, password });
    const data = response.data;
    const normalizedResponse = normalizePayload(data);
    
    const accessToken =
      normalizedResponse.accessToken || 
      normalizedResponse.token || 
      normalizedResponse.Token || 
      normalizedResponse.AccessToken;
      
    const refreshToken = 
      normalizedResponse.refreshToken || 
      normalizedResponse.RefreshToken;

    if (!accessToken) {
      throw new Error(
        getErrorMessage({ response: { data: data } }) ||
          "Login failed",
      );
    }

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", accessToken);
    if (refreshToken) {
      storage.setItem("refreshToken", refreshToken);
    }

    try {
      const profileResponse = await api.get("/api/Account/Account/GetProfile");
      const userData = normalizePayload(profileResponse.data);

      const rawRole =
        userData.roles && userData.roles.length > 0
          ? userData.roles[0]
          : "Student";

      const userWithRole = {
        ...userData,
        id: userData.userId,
        emailConfirmed: userData.emailConfirmed,
        role: rawRole,
      };

      localStorage.setItem("user", JSON.stringify(userWithRole));
      setUser(userWithRole);
      return userWithRole;
    } catch (error) {
      console.error("Failed to fetch profile after login", error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const profileResponse = await api.get("/api/Account/Account/GetProfile");
      const userData = normalizePayload(profileResponse.data);

      const rawRole =
        userData.roles && userData.roles.length > 0
          ? userData.roles[0]
          : "Student";

      const userWithRole = {
        ...userData,
        id: userData.userId,
        emailConfirmed: userData.emailConfirmed,
        role: rawRole,
      };

      localStorage.setItem("user", JSON.stringify(userWithRole));
      setUser(userWithRole);
      return userWithRole;
    } catch (error) {
      console.error("Failed to refresh user profile", error);
      // If profile fetch fails, we might want to logout or just ignore
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    const response = await api.post("/api/Account/Register", {
      fullName: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword || password,
    });
    return response.data;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await api.post("/api/Account/Logout", null, {
          params: { refreshToken },
        });
      } catch (error) {
        console.error("Failed to logout from server", error);
      }
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
    setUser(null);
  };

  const updateProfile = async (data) => {
    const payload = {
      fullName: data.fullName || data.name,
    };
    const response = await api.put(
      "/api/Account/Account/UpdateProfile",
      payload,
    );
    const body = response.data;

    // Check if update was successful
    if (body.success || response.status === 200) {
      const currentUser = JSON.parse(localStorage.getItem("user"));

      // Use the name we sent if the server didn't return an object in the 'data' field
      const updatedFullName =
        body.data && typeof body.data === "object"
          ? body.data.fullName
          : payload.fullName;

      const newUser = {
        ...currentUser,
        fullName: updatedFullName || currentUser.fullName,
      };

      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      return { success: true, user: newUser };
    }
    return { success: false, message: body.message || "Update failed" };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        refreshUser,
        register,
        logout,
        updateProfile,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
