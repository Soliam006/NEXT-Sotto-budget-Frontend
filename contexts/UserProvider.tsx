// app/context/UserProvider.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';
import { User, UserFollower } from './user.types';
import {followUserBD} from "@/app/actions/follows";
import {getToken} from "@/app/services/auth-service";

interface FollowResponse {
  follower_id: number;
  following_id: number;
  created_at: string;
  status: 'ACCEPTED' | 'REJECTED' | 'PENDING';
  updated_at: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updatedFields: Partial<User>) => void;
  saveProfile: (updatedFields: Partial<User>) => Promise<void>;
  acceptFollower: (followerId: string) => any;
  removeFollower: (followerId: string) => void;
  rejectFollower: (followerId: string) => any;
  followUser: (followerId: string) => any;
  unfollowUser: (followerId: string) => any;
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
  const acceptFollower = async (followerID: string) => {
    if (!user) return;

    // Simular una llamada a la API
    setIsSaving(true);
    try {
      // Aquí podrías hacer una llamada a la API para aceptar el seguidor
      const followerResponse = await followUserBD(getToken(), followerID, user.language_preference);

      console.log("Seguidor aceptado:", followerResponse);
      /*
      // Actualiza el usuario con el nuevo seguidor y elimina el seguidor de las solicitudes
      updateUser({
        followers: [...(user.followers || []), follower],
        requests: (user.requests || []).filter(request => request.id !== followerID),
      })
      console.log("User ACCEPTED:", user);

      return follower;*/
      return null;

    } catch (error) {
      console.error("Error al aceptar el seguidor:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Elimina un seguidor del usuario
  const removeFollower = (followerId: string) => {
    if (!user) return;
    setUser({
      ...user,
      followers: (user.followers || []).filter(follower => follower.id !== followerId),
    });
  };

  const rejectFollower = async (followerId: string) => {
    if (!user) return;

    // Simular una llamada a la API
    setIsSaving(true);
    try {
      // Aquí podrías hacer una llamada a la API para rechazar el seguidor
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Respuesta simulada
      const follower = {
        "follower_id": followerId,
        "status": "REJECTED",
      }
      console.log("Seguidor rechazado:", followerId);
      setUser({
        ...user,
        requests: (user.requests || []).filter(request => request.id !== followerId),
      });
      return follower;

    } catch (error) {
      console.error("Error al rechazar el seguidor:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }
  const followUser = async (followId: string) => {
    if (!user) return;

    // Simular una llamada a la API
    setIsSaving(true);
    try {
      // Aquí podrías hacer una llamada a la API para seguir al usuario
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const followUserResponse: FollowResponse = {
        follower_id: user.id,
        following_id: Number(followId),
        created_at: new Date().toISOString(),
        status: 'PENDING',
        updated_at: new Date().toISOString(),
      }
      console.log("Usuario seguido:", followId);
      setUser({
        ...user,
        following: [...(user.following || []), { id: followId, name: '', username: '', role: '', isFollowing: true }],
      });
      return followUserResponse;

    } catch (error) {
      console.error("Error al seguir al usuario:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  const unfollowUser = async (followId: string) => {
    if (!user) return;

    // Simular una llamada a la API
    setIsSaving(true);
    try {
      // Aquí podrías hacer una llamada a la API para dejar de seguir al usuario
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Usuario dejado de seguir:", followId);
      setUser({
        ...user,
        following: (user.following || []).filter(following => following.id !== followId),
      });
      const followUserResponse: FollowResponse = {
        follower_id: user.id,
        following_id: Number(followId),
        created_at: new Date().toISOString(),
        status: 'ACCEPTED',
        updated_at: new Date().toISOString(),
      }
      console.log("Usuario dejado de seguir:", followId);
      return followUserResponse;

    } catch (error) {
      console.error("Error al dejar de seguir al usuario:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

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
    acceptFollower,
    removeFollower,
    rejectFollower,
    followUser,
    unfollowUser,
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
