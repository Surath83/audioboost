
"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

// NOTE: This is a mock implementation using localStorage.
// In a real application, you would replace this with calls to your backend authentication service.

export interface UserData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  gender: string;
  age: number;
  occupation: string;
  signup_date: string;
  phone_no: string;
  left_ear: string;
  right_ear: string;
}

export interface AuthContextType {
  user: UserData | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (data: Omit<UserData, 'signup_date' | 'left_ear' | 'right_ear' | 'gender' | 'age' | 'occupation' | 'phone_no'> & { password: string; }) => void;
  updateUser: (data: Partial<UserData>) => void;
}

const MOCK_USERS_DB_KEY = 'dhvaniUsers';
const CURRENT_USER_SESSION_KEY = 'dhvaniSession';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      try {
        const sessionUserJson = localStorage.getItem(CURRENT_USER_SESSION_KEY);
        if (sessionUserJson) {
          setUser(JSON.parse(sessionUserJson));
        }
      } catch (error) {
        console.error("Failed to load user session from localStorage", error);
      }
      setIsInitialized(true);
    }, 1500); // Simulate 1.5 second loading
    
    return () => clearTimeout(timer);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const usersJson = localStorage.getItem(MOCK_USERS_DB_KEY);
      const users = usersJson ? JSON.parse(usersJson) : {};
      const userRecord = users[email];

      if (userRecord && userRecord.password === password) {
        const userData: UserData = { ...userRecord };
        delete (userData as any).password;
        
        setUser(userData);
        localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(userData));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const signup = useCallback((data: Omit<UserData, 'signup_date' | 'left_ear' | 'right_ear' | 'gender' | 'age' | 'occupation' | 'phone_no'> & { password: string; }) => {
    try {
      const usersJson = localStorage.getItem(MOCK_USERS_DB_KEY);
      const users = usersJson ? JSON.parse(usersJson) : {};
      
      if (users[data.email]) {
        throw new Error('An account with this email already exists.');
      }
      
      const newUser = {
        ...data,
        signup_date: new Date().toISOString(),
        left_ear: "60,60,60,50,50,70,70", // Default example value
        right_ear: "20,20,20,20,30,20,60", // Default example value
        age: 22,
        gender: "other",
        occupation: "Not specified",
        phone_no: "Not specified"
      };
      
      users[data.email] = newUser;
      localStorage.setItem(MOCK_USERS_DB_KEY, JSON.stringify(users));

    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_SESSION_KEY);
  }, []);

  const updateUser = useCallback((data: Partial<UserData>) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      
      const updatedUser = { ...currentUser, ...data };

      try {
        // Update user in "session"
        localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(updatedUser));
        
        // Update user in "DB"
        const usersJson = localStorage.getItem(MOCK_USERS_DB_KEY);
        const users = usersJson ? JSON.parse(usersJson) : {};
        if (users[updatedUser.email]) {
          const storedUser = users[updatedUser.email];
          // Make sure not to overwrite password
          const password = storedUser.password;
          users[updatedUser.email] = { ...storedUser, ...updatedUser, password };
          localStorage.setItem(MOCK_USERS_DB_KEY, JSON.stringify(users));
        }
      } catch (error) {
        console.error("Failed to update user data in localStorage", error);
      }
      
      return updatedUser;
    });
  }, []);

  const value = { user, isInitialized, login, logout, signup, updateUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
