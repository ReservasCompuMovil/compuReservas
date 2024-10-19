import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getToken } from '../../api';

type HomeScreenProps = {
  onLogout: () => void;
};


const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout }) => {
  const [token, setToken] = useState<string | null>(null);
    console.log(token);
    useEffect(() => {
        const fetchToken = async () => {
          try {
            const storedToken = await getToken(); // Recupera el token desde AsyncStorage
            setToken(storedToken); // Guarda el token en el estado para mostrarlo en la UI si es necesario
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
      <TouchableOpacity style={styles.button} onPress={onLogout}>
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
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
