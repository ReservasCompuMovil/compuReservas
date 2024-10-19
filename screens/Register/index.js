import React, { useState } from 'react';
import { showMessage } from 'react-native-flash-message';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const RegisterScreen = ({ onRegister, onReturn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [documento, setDocumento] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      showMessage({
        message: 'Las contraseñas no coinciden',
        type: 'danger',
      });
      return;
    }
    onRegister(username,documento,username + '@udea.edu.co', password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
      style={styles.input}
      placeholder="Nro de documento"
      value={documento}
      onChangeText={setDocumento}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={onReturn}>
        <Text style={styles.registerButtonText}>¿Ya tienes cuenta? Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  registerButton: {
    marginTop: 10,
  },
  registerButtonText: {
    color: '#619d52',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b1de9e',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#619d52',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#619d52',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
