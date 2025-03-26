// app/context/UserProvider.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';
import { User } from './user.types';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  const updateUser = (updatedFields: Partial<User>) => {
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