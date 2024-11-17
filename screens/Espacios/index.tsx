import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import {BACKEND_URL} from '@env';
import {getToken} from '../../api';

// Definición del tipo para un espacio
interface Space {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  ubicacion: string;
  deporte: string;
  activo: boolean;
}

type SpacesScreenProps = {};

export const SpacesScreen: React.FC<SpacesScreenProps> = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Función para obtener los espacios de la API
  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/espacio`);
      const data = await response.json();

      // Filtra los espacios activos
      const activeSpaces = data.filter((space: Space) => space.activo === true);

      setSpaces(activeSpaces);
      setError(null);
    } catch (err) {
      setError('Error al cargar los espacios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un espacio
  const deleteSpace = async (id: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/espacio/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el espacio');
      }

      Alert.alert('Éxito', 'El espacio ha sido eliminado correctamente.');
      setSpaces(prevSpaces => prevSpaces.filter(space => space.id !== id));
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Error',
        'Hubo un problema al eliminar el espacio. Intenta nuevamente.',
      );
    }
  };

  // Función para abrir el modal con datos del espacio seleccionado
  const openUpdateModal = (space: Space) => {
    setSelectedSpace(space);
    setIsModalVisible(true);
  };

  // Función para actualizar un espacio
  const updateSpace = async () => {
    if (!selectedSpace) return;

    try {
      const response = await fetch(
        `${BACKEND_URL}/espacio/${selectedSpace.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedSpace),
        },
      );

      if (!response.ok) {
        throw new Error('Error al actualizar el espacio');
      }

      Alert.alert('Éxito', 'El espacio ha sido actualizado correctamente.');
      setSpaces(prevSpaces =>
        prevSpaces.map(space =>
          space.id === selectedSpace.id ? selectedSpace : space,
        ),
      );
      setIsModalVisible(false);
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Error',
        'Hubo un problema al actualizar el espacio. Intenta nuevamente.',
      );
    }
  };

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
    fetchSpaces();
  }, []);

  const renderSpaceItem = ({item}: {item: Space}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>
        <View
          style={[
            styles.badge,
            {backgroundColor: item.activo ? '#4CAF50' : '#F44336'},
          ]}>
          <Text style={styles.badgeText}>
            {item.activo ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>
      <Text style={styles.description}>{item.descripcion}</Text>
      <View style={styles.details}>
        <Text style={styles.detailText}>🏃 {item.deporte}</Text>
        <Text style={styles.detailText}>📍 {item.ubicacion}</Text>
        <Text style={styles.detailText}>👥 Capacidad: {item.capacidad}</Text>
      </View>
      {role === 'ROLE_ADMIN' ? (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => openUpdateModal(item)}>
            <Text style={styles.updateButtonText}>Actualizar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              Alert.alert(
                'Confirmar eliminación',
                `¿Estás seguro de que deseas eliminar el espacio "${item.nombre}"?`,
                [
                  {text: 'Cancelar', style: 'cancel'},
                  {
                    text: 'Eliminar',
                    onPress: () => deleteSpace(item.id),
                    style: 'destructive',
                  },
                ],
              );
            }}>
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={spaces}
        renderItem={renderSpaceItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      {isModalVisible && selectedSpace && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Actualizar Espacio</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={selectedSpace.nombre}
                onChangeText={text =>
                  setSelectedSpace({...selectedSpace, nombre: text})
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={selectedSpace.descripcion}
                onChangeText={text =>
                  setSelectedSpace({...selectedSpace, descripcion: text})
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Capacidad"
                keyboardType="numeric"
                value={String(selectedSpace.capacidad)}
                onChangeText={text =>
                  setSelectedSpace({
                    ...selectedSpace,
                    capacidad: parseInt(text, 10) || 0,
                  })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Ubicación"
                value={selectedSpace.ubicacion}
                onChangeText={text =>
                  setSelectedSpace({...selectedSpace, ubicacion: text})
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Deporte"
                value={selectedSpace.deporte}
                onChangeText={text =>
                  setSelectedSpace({...selectedSpace, deporte: text})
                }
              />
              <View style={styles.modalActions}>
                <Button title="Guardar" onPress={updateSpace} />
                <Button
                  title="Cancelar"
                  onPress={() => setIsModalVisible(false)}
                  color="#F44336"
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  detailText: {
    fontSize: 14,
    color: '#444',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  updateButton: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});
