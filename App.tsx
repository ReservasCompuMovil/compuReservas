import React, {useState, useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  login,
  register,
  logout,
  isTokenValid,
  refreshTokenIfNeeded,
} from './api';
import {ActivityIndicator, StyleSheet, View} from 'react-native'; // Para mostrar el estado de carga
import FlashMessage, {showMessage} from 'react-native-flash-message';
import HomeScreen from './screens/Home';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import {SpacesScreen} from './screens/Espacios';
import {CreateReservationScreen} from './screens/CreateReserva';
import {ReservationsScreen} from './screens/Reservas';
import { CreateSpaceScreen } from './screens/CreateSpace';
const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carga mientras se verifica el token
  const flashMessageRef = useRef<FlashMessage>(null);
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Verificar si hay un token válido al abrir la app
  const checkLoginStatus = async () => {
    setLoading(true); // Mostrar la pantalla de carga mientras se valida el token
    const tokenValid = await isTokenValid(); // Verifica si el token en AsyncStorage es válido
    if (!tokenValid) {
      await refreshTokenIfNeeded(); // Intenta refrescar el token si es necesario
    }
    setIsLoggedIn(tokenValid); // Actualiza el estado de autenticación
    setLoading(false); // Oculta la pantalla de carga
  };

  // Manejar el inicio de sesión
  const handleLogin = async (username: string, password: string) => {
    try {
      await login(username, password);
      setIsLoggedIn(true);
    } catch (error) {
      // Verificar si el error tiene una propiedad message
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as {message?: string}).message;

        if (errorMessage === 'Usuario o contraseña incorrectos') {
          // Mostrar un mensaje de error específico cuando las credenciales son incorrectas
          showMessage({
            message: 'Usuario o contraseña incorrectos',
            type: 'danger',
          });
        } else {
          // Mostrar un mensaje genérico para otros tipos de errores
          showMessage({
            message: 'Error al iniciar sesión. Inténtalo más tarde.',
            type: 'danger',
          });
        }
      } else {
        // En caso de que el error no sea un objeto o no tenga message
        showMessage({
          message: 'Error desconocido. Inténtalo más tarde.',
          type: 'danger',
        });
      }
    }
  };

  // Manejar el registro
  const handleRegister = async (
    username: string,
    cedula: string,
    correo: string,
    contraseña: string,
  ) => {
    try {
      await register(username, cedula, correo, contraseña);
      showMessage({
        message: 'Registro exitoso. ',
        description: 'Por favor, inicia sesión.',
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: 'Error al registrarse. Por favor, intenta de nuevo.',
        type: 'danger',
      });
    }
  };

  // Manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Si la app está cargando, muestra un indicador de carga
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? (
            <>
              <Stack.Screen name="Home" options={{headerShown: false}}>
                {props => (
                  <HomeScreen
                    {...props}
                    onLogout={handleLogout}
                    onVerEspacios={() => props.navigation.navigate('Espacios')}
                    onCrearReserva={() =>
                      props.navigation.navigate('Crear-Reserva')
                    }
                    onCrearEspacio={() =>
                      props.navigation.navigate('Crear-Espacio')
                    }
                    onVerMisReservas={() =>
                      props.navigation.navigate('Mis-Reservas')
                    }
                  />
                )}
              </Stack.Screen>
              <Stack.Screen
                name="Espacios"
                component={SpacesScreen}
                options={{
                  title: 'Espacios Deportivos',
                  headerStyle: {
                    backgroundColor: '#619d52',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}
              />
              <Stack.Screen
                name="Crear-Reserva"
                component={CreateReservationScreen}
                options={{
                  title: 'Crear reserva',
                  headerStyle: {
                    backgroundColor: '#619d52',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}
              />
              <Stack.Screen
                name="Crear-Espacio"
                component={CreateSpaceScreen}
                options={{
                  title: 'Crear Espacio',
                  headerStyle: {
                    backgroundColor: '#619d52',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}
              />
              <Stack.Screen
                name="Mis-Reservas"
                component={ReservationsScreen}
                options={{
                  title: 'Mis reservas',
                  headerStyle: {
                    backgroundColor: '#619d52',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" options={{headerShown: false}}>
                {props => (
                  <LoginScreen
                    {...props}
                    onLogin={handleLogin}
                    onRegister={() => props.navigation.navigate('Register')}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="Register" options={{headerShown: false}}>
                {props => (
                  <RegisterScreen
                    {...props}
                    onRegister={handleRegister}
                    onReturn={() => props.navigation.navigate('Login')}
                  />
                )}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <FlashMessage position="top" ref={flashMessageRef} />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default App;
