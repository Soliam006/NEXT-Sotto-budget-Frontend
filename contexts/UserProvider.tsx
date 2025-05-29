'use client';

import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import { User } from './user.types';
import {acceptRequestBD, followUserBD, unfollowUserBD} from "@/app/actions/follows";
import { setCookie, deleteCookie, getCookie } from 'cookies-next';
import {fetchUserMe} from "@/app/actions/auth";
import {redirect} from "next/navigation";
import Swal from "sweetalert2";

export const getTokenFromStorage = () => {
  const token = getCookie('access_token');
  return token ? String(token) : null;
};


interface FollowResponse {
  follower_id: number;
  following_id: number;
  created_at: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'NONE';
  updated_at: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null, rememberMe: boolean, lang:string) => void;
  updateUser: (updatedFields: Partial<User>) => void;
  saveProfile: (updatedFields: Partial<User>) => Promise<void>;
  acceptFollower: (followerId: number) => Promise<FollowResponse>;
  removeFollower: (followerId: number) => void;
  rejectFollower: (followerId: number) => Promise<FollowResponse>;
  followUser: (followingId: number) => Promise<FollowResponse>;
  unfollowUser: (followingId: number) => Promise<FollowResponse>;
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
  const [error, setError] = useState<string | null>(null)

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


  const acceptFollower = async (followerId: number): Promise<FollowResponse> => {
    if (!user || !tokenState) throw new Error("User not authenticated");

    setIsSaving(true);
    try {
      const response = await acceptRequestBD(tokenState, followerId, user.language_preference);
      return {
        follower_id: Number(followerId),
        following_id: user.id,
        status: 'ACCEPTED',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error al aceptar el seguidor:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };


  const removeFollower = (followerId: number) => {
    if (!user) return;
    setUser({
      ...user,
      followers: (user.followers || []).filter(f => f.id !== followerId),
    });
  };

  const rejectFollower = async (followerId: number): Promise<FollowResponse> => {
    if (!user || !tokenState) throw new Error("User not authenticated");

    setIsSaving(true);
    try {
      // Aquí deberías llamar a tu API para rechazar la solicitud
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        follower_id: Number(followerId),
        following_id: user.id,
        status: 'REJECTED',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error al rechazar el seguidor:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };


  const followUser = async (followingId: number): Promise<FollowResponse> => {
    if (!user || !tokenState) throw new Error("User not authenticated");

    setIsSaving(true);
    try {
      const response = await followUserBD(tokenState, followingId, user.language_preference);

      if (response.statusCode !== 200) {
        setError( response.message || "Failed to follow user");
      }

      return response.data as FollowResponse;

    } catch (error) {
      console.error("Error al seguir al usuario:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const unfollowUser = async (followingId: number): Promise<FollowResponse> => {
    if (!user || !tokenState) throw new Error("User not authenticated");

    setIsSaving(true);
    try {
      const response = await unfollowUserBD(tokenState, followingId, user.language_preference);
      return {
        follower_id: user.id,
        following_id: Number(followingId),
        status: 'NONE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error al dejar de seguir al usuario:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Función para mostrar errores
  const showErrorAlert = useCallback((errorMessage: string) => {
    Swal.fire({
      title: "Error",
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      footer: 'Si es urgente, contacte a soporte inmediatamente'
    });
  }, []);
  // Efecto para mostrar errores cuando cambien
  useEffect(() => {
    if (error) {
      showErrorAlert(error);
    }
  }, [error, showErrorAlert]);


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
