import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api";

export function use_auth() {
  const [user, set_user] = useState(null);
  const [is_authenticated, set_is_authenticated] = useState(false);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    check_auth();
  }, []);

  const check_auth = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: "include"
      });
      const data = await response.json();
      if (response.ok) {
        set_user(data.user);
        set_is_authenticated(true);
      } else {
        set_user(null);
        set_is_authenticated(false);
      }
    } catch (error) {
      set_user(null);
      set_is_authenticated(false);
    } finally {
      set_loading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        set_user(data.user);
        set_is_authenticated(true);
        return true;
      } else {
        alert(data.error || "Login failed");
        return false;
      }
    } catch (error) {
      alert("Something went wrong");
      return false;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await response.json();
      if (response.ok) {
        set_user(data.user);
        set_is_authenticated(true);
        return true;
      } else {
        alert(data.error || "Registration failed");
        return false;
      }
    } catch (error) {
      alert("Something went wrong");
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
      set_user(null);
      set_is_authenticated(false);
      alert("Logged out successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return { user, is_authenticated, loading, login, register, logout };
}