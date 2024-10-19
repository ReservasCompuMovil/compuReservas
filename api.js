import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BACKEND_URL} from '@env';
import { decode as atob } from 'base-64';
const API_URL = BACKEND_URL;

export const login = async (correo, contrasena ) => {
  try {

    const response = await axios.post(`${API_URL}/auth/login`, { correo, contrasena  });
    const { token } = response.data;
    await AsyncStorage.setItem('token', token);
    return token;
  } catch (error)  {

    if (error.response && error.response.status === 400 && error.response.data === 'Usuario o contraseña incorrectos') {
      throw new Error('Usuario o contraseña incorrectos');
    } else if (error.response) {
      throw new Error(`Error del servidor: ${error.response.status}`);
    } else if (error.request) {
      throw new Error('No se recibió respuesta del servidor');
    } else {
      throw new Error('Error al realizar la solicitud');
    }
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
};

export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};


export const isTokenValid = async () => {
  const token = await getToken();

  if (!token) {return false;}

  try {
    // El JWT tiene tres partes separadas por puntos (header, payload, signature)
    const payload = token.split('.')[1]; // Obtenemos la segunda parte (payload)

    if (!payload) {throw new Error('El token no tiene payload');}

    // Decodificamos el payload de Base64
    const decodedPayload = JSON.parse(atob(payload));

    // Verificamos si el token ha expirado
    const currentTime = Date.now() / 1000;
    return decodedPayload.exp > currentTime;
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return false;
  }
};

export const refreshTokenIfNeeded = async () => {
  if (!(await isTokenValid())) {
    // Implementa la lógica para refrescar el token aquí
    // Esto dependerá de cómo tu backend maneje el refresh de tokens
  }
};

export const register = async (nombre, cedula,correo,contrasena) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { nombre, cedula,correo,contrasena ,rol:'USER' });
      return response.data;
    } catch (error) {
      throw new Error('Error durante el registro');
    }
  };
