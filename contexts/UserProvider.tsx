// app/context/UserProvider.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';
import { User, UserFollower } from './user.types';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updatedFields: Partial<User>) => void;
  saveProfile: (updatedFields: Partial<User>) => Promise<void>;
  addFollower: (follower: UserFollower) => void;
  removeFollower: (followerId: string) => void;
  updateAvailability: (availabilities: User['availabilities']) => void;
  isSaving: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Actualiza el usuario en memoria combinando los campos actuales con los nuevos.
  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updatedFields });
  };

  // Simula el envío al backend y, si tiene éxito, actualiza el perfil.
  const saveProfile = async (updatedFields: Partial<User>): Promise<void> => {
    if (!user) return;
    setIsSaving(true);
    try {
      // Simulación de llamada a la API (por ejemplo, 1.5 segundos de delay)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Actualiza el usuario con los campos nuevos
      updateUser(updatedFields);
      console.log("Perfil actualizado con éxito");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Agrega un seguidor al usuario
  const addFollower = (follower: UserFollower) => {
    if (!user) return;
    setUser({
      ...user,
      followers: [...(user.followers || []), follower],
    });
  };

  // Elimina un seguidor del usuario
  const removeFollower = (followerId: string) => {
    if (!user) return;
    setUser({
      ...user,
      followers: (user.followers || []).filter(follower => follower.id !== followerId),
    });
  };

  // Actualiza el array de disponibilidades
  const updateAvailability = (availabilities: User['availabilities']) => {
    if (!user) return;
    setUser({
      ...user,
      availabilities,
    });
  };

  const value: UserContextType = {
    user,
    setUser,
    updateUser,
    saveProfile,
    addFollower,
    removeFollower,
    updateAvailability,
    isSaving,
  };

  return (
      <UserContext.Provider value={value}>
        {children}
      </UserContext.Provider>
  );
};

// Custom hook para usar el contexto de usuario
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
