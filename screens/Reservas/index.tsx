import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { BACKEND_URL } from '@env';
import { getToken } from '../../api';

interface Reservation {
  id: number;
  usuarioId: number;
  espacioId: number;
  espacioNombre: string;
  fechaReserva: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
}

export const ReservationsScreen: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const getUserIdFromToken = async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No hay token almacenado');
      }
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      // console.log(decodedPayload)
      setUserId(decodedPayload.id_usuario);
      return decodedPayload.id_usuario;
    } catch (error) {
      console.error('Error al obtener el ID del usuario:', error);
      throw error;
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const userId = await getUserIdFromToken();
      const response = await fetch(`${BACKEND_URL}/reserva/usuario/${userId}`);
      const data = await response.json();
        if (data.length === 0) {
            return;
        }
      if (data.lenght === 0) {
        return
      }

      // Ordenar reservas: activas primero
      const sortedData = data.sort((a: Reservation, b: Reservation) => {
        if (a.estado === 'ACTIVA' && b.estado !== 'ACTIVA') return -1;
        if (a.estado !== 'ACTIVA' && b.estado === 'ACTIVA') return 1;
        return 0;
      });

      setReservations(sortedData);
      setError(null);
    } catch (err) {
      setError('Error al cargar las reservas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (reservationId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/reserva/cancelar/${reservationId}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Error al cancelar la reserva');
      }
      Alert.alert('Reserva cancelada', 'La reserva ha sido cancelada exitosamente.');
      fetchReservations(); // Recargar las reservas
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      Alert.alert('Error', 'No se pudo cancelar la reserva. Intenta nuevamente.');
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const renderReservationItem = ({ item }: { item: Reservation }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Reserva #{item.id}</Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: item.estado === 'ACTIVA' ? '#4CAF50' : '#F44336' },
          ]}
        >
          <Text style={styles.badgeText}>{item.estado}</Text>
        </View>
      </View>
      <Text style={styles.description}>Usuario ID: {item.usuarioId}</Text>
      <Text style={styles.description}>Espacio: {item.espacioNombre}</Text>
      <Text style={styles.description}>
        Fecha: {new Date(item.fechaReserva).toLocaleDateString()}
      </Text>
      <Text style={styles.detailText}>
        Hora: {item.horaInicio.substring(0, 5)} - {item.horaFin.substring(0, 5)}
      </Text>
      {item.estado === 'ACTIVA' && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() =>
            Alert.alert(
              'Cancelar Reserva',
              `¿Estás seguro de que deseas cancelar la reserva #${item.id}?`,
              [
                { text: 'No', style: 'cancel' },
                { text: 'Sí', onPress: () => cancelReservation(item.id) },
              ]
            )
          }
        >
          <Text style={styles.cancelButtonText}>Cancelar Reserva</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchReservations}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (reservations.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No tienes reservas en este momento.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchReservations}>
          <Text style={styles.retryButtonText}>Recargar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={reservations}
        renderItem={renderReservationItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    shadowOffset: { width: 0, height: 2 },
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
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#444',
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: '#F44336',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
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
  emptyText: {
    fontSize: 18,
    color: '#444',
    marginBottom: 16,
    textAlign: 'center',
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
});
