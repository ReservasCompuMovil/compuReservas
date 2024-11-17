import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getToken } from '../../api';

type HomeScreenProps = {
  onLogout: () => void;
  onVerEspacios: () => void;
  onCrearReserva: () => void;
  onVerMisReservas: () => void;
  onCrearEspacio: () => void;
};


const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout, onVerEspacios,onCrearReserva,onVerMisReservas,onCrearEspacio  }) => {
  const [role, setRole] = useState<string | null>(null);
  
    useEffect(() => {
        const fetchToken = async () => {
          try {
            const storedToken = await getToken(); // Recupera el token desde AsyncStorage
            const payload = storedToken.split('.')[1];
             const decodedPayload = JSON.parse(atob(payload));
             setRole(decodedPayload.rol);
          } catch (error) {
            console.error('Error al recuperar el token:', error);
          }
        };

        fetchToken();
      }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bienvenido a tu cuenta</Text>
      <Text style={styles.instructions}>
        Aquí puedes agregar funcionalidades adicionales para tu aplicación.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onVerEspacios}>
        <Text style={styles.buttonText}>Ver espacios</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onCrearReserva}>
        <Text style={styles.buttonText}>Crear Reserva</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onVerMisReservas}>
        <Text style={styles.buttonText}>Mis reservas</Text>
      </TouchableOpacity>
      
      {
        role === 'ROLE_ADMIN' ? (
          <TouchableOpacity style={styles.button} onPress={onCrearEspacio}>
            <Text style={styles.buttonText}>Crear Espacio</Text>
          </TouchableOpacity>
        ) : null
      }
      <TouchableOpacity style={styles.logout} onPress={onLogout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b1de9e',
    padding: 20,
  },
  logout: {
    backgroundColor: '#9F543E',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginTop: 100,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#619d52',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#619d52',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
