import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import {showMessage} from 'react-native-flash-message';
import {getToken} from '../../api';
import {SelectList} from 'react-native-dropdown-select-list';
import {BACKEND_URL} from '@env';
import DateTimePicker from 'react-native-ui-datepicker';

interface Space {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  ubicacion: string;
  deporte: string;
  activo: boolean;
}

interface Reservation {
  usuarioId: number;
  espacioId: number;
  fechaReserva: string;
  horaInicio: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  horaFin: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
}

export const CreateReservationScreen = ({}) => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const [selectedSpace, setSelectedSpace] = useState<number>(0);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    fetchSpaces();
    getUserIdFromToken();
  }, []);

  const getUserIdFromToken = async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No hay token almacenado');
      }

      // Decodificar el payload del token
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));

      // Asumiendo que el ID del usuario está en el campo 'id' del payload
      setUserId(decodedPayload.id);
    } catch (error) {
      console.error('Error al obtener el ID del usuario:', error);
      // navigation.replace('Login'); // Redirigir al login si hay un error con el token
    }
  };

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(`${BACKEND_URL}/espacio`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener espacios');
      }

      //   const data = await response.json();

      const data = [
        {
          id: 1,
          nombre: 'Cancha de Fútbol A',
          descripcion: 'Cancha de fútbol profesional con césped sintético',
          capacidad: 22,
          ubicacion: 'Sector Norte',
          deporte: 'Fútbol',
          activo: true,
        },
        {
          id: 2,
          nombre: 'Cancha de Básquet',
          descripcion: 'Cancha techada de básquet',
          capacidad: 10,
          ubicacion: 'Sector Sur',
          deporte: 'Básquetbol',
          activo: true,
        },
        {
          id: 3,
          nombre: 'Cancha de Tenis',
          descripcion: 'Cancha de tenis profesional',
          capacidad: 4,
          ubicacion: 'Sector Este',
          deporte: 'Tenis',
          activo: true,
        },
        {
          id: 4,
          nombre: 'Cancha de Tenis',
          descripcion: 'Cancha de tenis profesional',
          capacidad: 4,
          ubicacion: 'Sector Este',
          deporte: 'Tenis',
          activo: true,
        },
        {
          id: 5,
          nombre: 'Cancha de Tenis',
          descripcion: 'Cancha de tenis profesional',
          capacidad: 4,
          ubicacion: 'Sector Este',
          deporte: 'Tenis',
          activo: true,
        },
        {
          id: 6,
          nombre: 'Cancha de Tenis',
          descripcion: 'Cancha de tenis profesional',
          capacidad: 4,
          ubicacion: 'Sector Este',
          deporte: 'Tenis',
          activo: true,
        },
        {
          id: 7,
          nombre: 'Cancha de Tenis',
          descripcion: 'Cancha de tenis profesional',
          capacidad: 4,
          ubicacion: 'Sector Este',
          deporte: 'Tenis',
          activo: true,
        },
        {
          id: 8,
          nombre: 'Cancha de Tenis',
          descripcion: 'Cancha de tenis profesional',
          capacidad: 4,
          ubicacion: 'Sector Este',
          deporte: 'Tenis',
          activo: true,
        },
        {
          id: 9,
          nombre: 'Cancha de Tenis',
          descripcion: 'Cancha de tenis profesional',
          capacidad: 4,
          ubicacion: 'Sector Este',
          deporte: 'Tenis',
          activo: true,
        },
        {
          id: 10,
          nombre: 'Cancha de Tenis',
          descripcion: 'Cancha de tenis profesional',
          capacidad: 4,
          ubicacion: 'Sector Este',
          deporte: 'Tenis',
          activo: true,
        },
      ];
      setSpaces(data);
      const formattedData = data.map(space => ({
        key: space.id,
        value: space.nombre,
      }));
      setSpaces(formattedData);
    } catch (error) {
      console.error('Error al cargar los espacios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };

  const handleSubmit = async () => {
    if (!userId || !selectedSpace) {
      showMessage({
        message: 'Por favor, complete todos los campos',
        type: 'danger',
      });
      return;
    }

    const reservation: Reservation = {
      usuarioId: userId,
      espacioId: selectedSpace,
      fechaReserva: format(date, 'yyyy-MM-dd'),
      horaInicio: {
        hour: startTime.getHours(),
        minute: startTime.getMinutes(),
        second: 0,
        nano: 0,
      },
      horaFin: {
        hour: endTime.getHours(),
        minute: endTime.getMinutes(),
        second: 0,
        nano: 0,
      },
    };

    try {
      setLoading(true);
      const token = await getToken();

      const response = await fetch('TU_URL_API/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservation),
      });

      if (!response.ok) {
        throw new Error('Error al crear la reserva');
      }
      showMessage({
        message: 'Operacion exitosa',
        description: 'Reserva creada exitosamente',
        type: 'success',
      });
      // navigation.goBack();
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      showMessage({
        message: 'Error al crear la reserva',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && spaces.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Espacio</Text>
        <View style={styles.pickerContainer}>
          {/* <Picker
            selectedValue={selectedSpace}
            onValueChange={(itemValue) => setSelectedSpace(Number(itemValue))}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione un espacio" value={0} />
            {spaces.map((space) => (
              <Picker.Item
                key={space.id}
                label={space.nombre}
                value={space.id}
              />
            ))}
          </Picker> */}
          <SelectList
            setSelected={val => setSelectedSpace(val)}
            data={spaces}
            save="value"
          />
        </View>

        <Text style={styles.label}>Fecha</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}>
          <Text>{format(date, 'dd/MM/yyyy')}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Hora de inicio</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartTimePicker(true)}>
          <Text>{format(startTime, 'HH:mm')}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Hora de fin</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndTimePicker(true)}>
          <Text>{format(endTime, 'HH:mm')}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          // <DateTimePicker
          //   value={date}
          //   mode="date"
          //   display="default"
          //   onChange={handleDateChange}
          //   minimumDate={new Date()}
          // />
          <DateTimePicker
        mode="single"
        date={date}
        onChange={(params) =>{ setDate(params.date)
          setShowDatePicker(false)
        }}
      />
        )}

        {showStartTimePicker && (
          <></>
          // <DateTimePicker
          //   value={startTime}
          //   mode="time"
          //   is24Hour={true}
          //   display="default"
          //   onChange={handleStartTimeChange}
          // />
        )}

        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleEndTimeChange}
          />
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Crear Reserva</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  picker: {
    height: 50,
  },
  dateButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
