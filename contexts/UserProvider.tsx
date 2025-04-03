// app/context/UserProvider.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';
import { User as User_Type } from './user.types';

interface UserContextType {
  user: User_Type | null;
  setUser: (user: User_Type | null) => void;
  updateUser: (updatedFields: Partial<User_Type>) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User_Type | null>(null);

  const updateUser = (updatedFields: Partial<User_Type>) => {
    if (!user) return;
    setUser({ ...user, ...updatedFields });
  };

  return (
      <UserContext.Provider value={{ user, setUser, updateUser}}>
        {children}
      </UserContext.Provider>
  );
};

// Custom hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};