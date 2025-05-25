'use client';

import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import { User } from './user.types';
import { acceptRequestBD } from "@/app/actions/follows";
import { setCookie, deleteCookie, getCookie } from 'cookies-next';
import {fetchUserMe} from "@/app/actions/auth";
import {redirect} from "next/navigation";

export const getTokenFromStorage = () => {
  const token = getCookie('access_token');
  return token ? String(token) : null;
};


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
  token: string | null;
  setToken: (token: string | null, rememberMe: boolean, lang:string) => void;
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
  const [tokenState, setTokenState] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // NUEVO: Inicializa el token desde coockies al montar
  useEffect(() => {
    const storedToken = getTokenFromStorage();
    if (storedToken) {
      setTokenState(storedToken);
      // Cargar usuario desde backend
      fetchUserMe(storedToken, { serverError: "Something went Wrong" }).then(res => {
        if (res.statusCode === 200) {
          console.log("User datafetch ME:", res.data);
          setUser(res.data);
        } else {
          // Si error o token inválido, limpiar token y usuario
          setTokenState(null);
          setUser(null);
          deleteCookie('access_token', { path: '/' });
          deleteCookie('lang', { path: '/' });
          redirect(`/es/login`);
        }
      });
    }
  }, []);

  const setToken = (newToken: string | null, rememberMe: boolean, lang: string) => {
    if (!newToken) {
      // Eliminar cookies
      deleteCookie('access_token', { path: '/' });
      deleteCookie('lang', { path: '/' });
      return;
    }

    // Establecer cookies
    const cookieOptions = {
      path: '/',
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : undefined, // 30 días
    };

    setCookie('access_token', newToken, cookieOptions);
    setCookie('lang', lang, cookieOptions);
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updatedFields });
  };

  const saveProfile = async (updatedFields: Partial<User>): Promise<void> => {
    if (!user) return;
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      updateUser(updatedFields);
      console.log("Perfil actualizado con éxito");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const acceptFollower = async (followerID: string) => {
    if (!user || !tokenState) return;

    setIsSaving(true);
    try {
      const followersResponse = await acceptRequestBD(tokenState, followerID, user.language_preference);
      console.log("Seguidores Actualizados con el nuevo Follow:", followersResponse);
      return null;
    } catch (error) {
      console.error("Error al aceptar el seguidor:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const removeFollower = (followerId: string) => {
    if (!user) return;
    setUser({
      ...user,
      followers: (user.followers || []).filter(f => f.id !== followerId),
    });
  };

  const rejectFollower = async (followerId: string) => {
    if (!user) return;

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUser({
        ...user,
        requests: (user.requests || []).filter(r => r.id !== followerId),
      });
      return {
        follower_id: followerId,
        status: "REJECTED",
      };
    } catch (error) {
      console.error("Error al rechazar el seguidor:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const followUser = async (followId: string) => {
    if (!user) return;

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUser({
        ...user,
        following: [...(user.following || []), { id: followId, name: '', username: '', role: '', isFollowing: true }],
      });
      return {
        follower_id: user.id,
        following_id: Number(followId),
        created_at: new Date().toISOString(),
        status: 'PENDING',
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error al seguir al usuario:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const unfollowUser = async (followId: string) => {
    if (!user) return;

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUser({
        ...user,
        following: (user.following || []).filter(f => f.id !== followId),
      });
      return {
        follower_id: user.id,
        following_id: Number(followId),
        created_at: new Date().toISOString(),
        status: 'ACCEPTED',
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error al dejar de seguir al usuario:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

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
    token: tokenState,
    setToken,
    updateUser,
    saveProfile,
    acceptFollower,
    removeFollower,
    rejectFollower,
    followUser,
    unfollowUser,
    updateAvailability,
    isSaving
  };

  return (
      <UserContext.Provider value={value}>
        {children}
      </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
