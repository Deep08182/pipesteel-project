"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, UserRole } from "@/types";
import { db } from "@/lib/database/store";

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (data: {
    full_name: string;
    company_name: string;
    email: string;
    phone: string;
    designation?: string;
    city?: string;
    state?: string;
    gstin?: string;
  }) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  switchDemoUser: (profileId: string) => void;
  availableDemoUsers: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "steelcore_current_user_id";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    db.initialize();
    const storedUserId = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUserId) {
      const found = db.getProfile(storedUserId);
      if (found) {
        setUser(found);
      } else {
        // Fallback default to demo customer
        const defaultCust = db.getProfile("usr-cust-01");
        setUser(defaultCust || null);
      }
    } else {
      // Default to demo customer so visitors immediately experience portal features
      const defaultCust = db.getProfile("usr-cust-01");
      if (defaultCust) {
        setUser(defaultCust);
        localStorage.setItem(AUTH_STORAGE_KEY, defaultCust.id);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const found = db.getProfile(email.trim());
    if (!found) {
      return {
        success: false,
        error: "No industrial account found with this email. Use one of the demo accounts below or create a new account.",
      };
    }
    setUser(found);
    localStorage.setItem(AUTH_STORAGE_KEY, found.id);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const register = async (data: {
    full_name: string;
    company_name: string;
    email: string;
    phone: string;
    designation?: string;
    city?: string;
    state?: string;
    gstin?: string;
  }) => {
    const existing = db.getProfile(data.email.trim());
    if (existing) {
      return { success: false, error: "An account with this email address already exists. Please log in." };
    }

    const newProfile = db.createProfile({
      full_name: data.full_name,
      company_name: data.company_name,
      email: data.email.trim().toLowerCase(),
      phone: data.phone,
      designation: data.designation || "Procurement Manager",
      city: data.city || "Mumbai",
      state: data.state || "Maharashtra",
      gstin: data.gstin || "27AABCA0000A1Z5",
      role: "CUSTOMER",
    });

    setUser(newProfile);
    localStorage.setItem(AUTH_STORAGE_KEY, newProfile.id);
    return { success: true, user: newProfile };
  };

  const switchDemoUser = (profileId: string) => {
    const target = db.getProfile(profileId);
    if (target) {
      setUser(target);
      localStorage.setItem(AUTH_STORAGE_KEY, target.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        switchDemoUser,
        availableDemoUsers: db.getProfiles(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
