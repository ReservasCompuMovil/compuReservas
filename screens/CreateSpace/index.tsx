import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { BACKEND_URL } from '@env';

export const CreateSpaceScreen: React.FC = () => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    capacidad: '',
    ubicacion: '',
    deporte: '',
    activo: true,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (field: string, value: string) => {
    setForm({
      ...form,
      [field]: field === 'capacidad' ? value.replace(/[^0-9]/g, '') : value, // Capacidad solo permite números
    });
  };

  const handleSubmit = async () => {
    // Validación simple
    if (!form.nombre || !form.descripcion || !form.capacidad || !form.ubicacion || !form.deporte) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/espacio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          capacidad: parseInt(form.capacidad, 10),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear el espacio');
      }

      Alert.alert('Éxito', 'Espacio creado correctamente.');
      setForm({
        nombre: '',
        descripcion: '',
        capacidad: '',
        ubicacion: '',
        deporte: '',
        activo: true,
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al crear el espacio. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Espacio</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={form.nombre}
        onChangeText={(text) => handleChange('nombre', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={form.descripcion}
        onChangeText={(text) => handleChange('descripcion', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Capacidad"
        value={form.capacidad}
        keyboardType="numeric"
        onChangeText={(text) => handleChange('capacidad', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Ubicación"
        value={form.ubicacion}
        onChangeText={(text) => handleChange('ubicacion', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Deporte"
        value={form.deporte}
        onChangeText={(text) => handleChange('deporte', text)}
      />
      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: '#ccc' }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Creando...' : 'Crear Espacio'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#619d52',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
