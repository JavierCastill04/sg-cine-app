import { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import type { Funcion } from '../../../types/Funcion';
import type { Pelicula } from '../../../types/Pelicula';
import type { Sala } from '../../../types/Sala';
import { commonStyles } from '../../../theme';

import { validarCampo, type Campo, type FormData, type FormErrors } from '../validarFuncion';

interface FuncionFormModalProps {
    visible: boolean;
    funcion?: Funcion;
    funciones: Funcion[];
    peliculas: Pelicula[];
    salas: Sala[];
    onClose: () => void;
    onGuardar: (datos: Omit<Funcion, 'id' | 'estadoAsientos'>) => void;
}

export default function FuncionFormModal({
    visible,
    funcion,
    funciones,
    peliculas,
    salas,
    onClose,
    onGuardar,
}: FuncionFormModalProps) {

    const esEdicion = !!funcion;
    const [formData, setFormData] = useState<FormData>({ peliculaId: '', salaId: '', fecha: '', horaInicio: '', });
    const [errores, setErrores] = useState<FormErrors>({ peliculaId: '', salaId: '', fecha: '', horaInicio: '', });
    const [mostrarFecha, setMostrarFecha] = useState(false);
    const [mostrarHora, setMostrarHora] = useState(false);

    useEffect(() => {
        if (funcion) {
            setFormData({ peliculaId: String(funcion.peliculaId), salaId: String(funcion.salaId), fecha: funcion.fecha, horaInicio: funcion.horaInicio, });
        }
        else {
            setFormData({ peliculaId: '', salaId: '', fecha: '', horaInicio: '', });
        }
        setErrores({ peliculaId: '', salaId: '', fecha: '', horaInicio: '', });

    }, [funcion, visible]);

    const cambiarCampo = (campo: Campo, valor: string) => {
        const nuevoFormData = { ...formData, [campo]: valor, };
        setFormData(nuevoFormData);
        const error = validarCampo(campo, valor, nuevoFormData, funciones, peliculas, funcion);
        setErrores({ ...errores, [campo]: error, });
    };

    const seleccionarFecha = (_: unknown, fechaSeleccionada?: Date) => {
        setMostrarFecha(false);
        if (!fechaSeleccionada) { return; }

        const fecha = [
            fechaSeleccionada.getFullYear(),
            String(fechaSeleccionada.getMonth() + 1).padStart(2, '0'),
            String(fechaSeleccionada.getDate()).padStart(2, '0'),
        ].join('-');

        cambiarCampo('fecha', fecha);
    };

    const seleccionarHora = (_: unknown, horaSeleccionada?: Date) => {
        setMostrarHora(false);
        if (!horaSeleccionada) { return; }

        const hora = `${String(horaSeleccionada.getHours()).padStart(2, '0')}:${String(horaSeleccionada.getMinutes()).padStart(2, '0')}`;

        cambiarCampo('horaInicio', hora);
    };

    const guardar = () => {
        const nuevosErrores: FormErrors = {
            peliculaId: validarCampo('peliculaId', formData.peliculaId, formData, funciones, peliculas, funcion),
            salaId: validarCampo('salaId', formData.salaId, formData, funciones, peliculas, funcion),
            fecha: validarCampo('fecha', formData.fecha, formData, funciones, peliculas, funcion),
            horaInicio: validarCampo('horaInicio', formData.horaInicio, formData, funciones, peliculas, funcion),
        };
        setErrores(nuevosErrores);

        const hayErrores = Object.values(nuevosErrores).some(error => error !== '');
        if (hayErrores) { return; }

        onGuardar({
            peliculaId: Number(formData.peliculaId),
            salaId: Number(formData.salaId),
            fecha: formData.fecha,
            horaInicio: formData.horaInicio,
        });
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={commonStyles.modalOverlay}>
                <View style={commonStyles.modal}>

                    <Text style={commonStyles.title}>
                        {esEdicion ? 'Editar función' : 'Nueva función'}
                    </Text>

                    <View style={commonStyles.inputView}>
                        <Text style={commonStyles.label}>Película</Text>
                        <View style={[commonStyles.input, { paddingVertical: 0, },]} >
                            <Picker selectedValue={formData.peliculaId} onValueChange={valor => cambiarCampo('peliculaId', String(valor))}>
                                <Picker.Item label="Seleccione una película" value="" />
                                {peliculas.map(
                                    pelicula => (
                                        <Picker.Item
                                            key={pelicula.id}
                                            label={pelicula.nombre}
                                            value={String(pelicula.id)}
                                        />
                                    )
                                )}
                            </Picker>
                        </View>

                        {errores.peliculaId !== '' && (
                            <Text style={commonStyles.errorText}>{errores.peliculaId} </Text>
                        )}
                    </View>

                    <View style={commonStyles.inputView}>
                        <Text style={[commonStyles.label]}>Sala</Text>
                        <View style={[commonStyles.input, { paddingVertical: 0, },]}>
                            <Picker selectedValue={formData.salaId} onValueChange={valor => cambiarCampo('salaId', String(valor))}>
                                <Picker.Item label="Seleccione una sala" value="" />
                                {salas.map(
                                    sala => (
                                        <Picker.Item
                                            key={sala.id}
                                            label={sala.nombre}
                                            value={String(sala.id)}
                                        />
                                    )
                                )}
                            </Picker>
                        </View>

                        {errores.salaId !== '' && (
                            <Text style={commonStyles.errorText}> {errores.salaId} </Text>
                        )}
                    </View>

                    <View style={commonStyles.inputView}>
                        <Text style={[commonStyles.label]}>Fecha</Text>
                        <TouchableOpacity style={commonStyles.input} onPress={() => setMostrarFecha(true)}>
                            <Text>{formData.fecha || 'Seleccionar fecha'}</Text>
                        </TouchableOpacity>

                        {mostrarFecha && (
                            <DateTimePicker
                                value={formData.fecha ? new Date(`${formData.fecha}T00:00:00`) : new Date()}
                                mode="date"
                                minimumDate={new Date()}
                                onChange={seleccionarFecha}
                            />
                        )}

                        {errores.fecha !== '' && (
                            <Text style={commonStyles.errorText}>  {errores.fecha}</Text>
                        )}
                    </View>

                    <View style={commonStyles.inputView}>
                        <Text style={[commonStyles.label,]}>Hora de inicio</Text>
                        <TouchableOpacity style={commonStyles.input} onPress={() => setMostrarHora(true)}>
                            <Text>{formData.horaInicio || 'Seleccionar hora'}</Text>
                        </TouchableOpacity>

                        {mostrarHora && (
                            <DateTimePicker
                                value={formData.horaInicio ? new Date(`1970-01-01T${formData.horaInicio}:00`) : new Date()}
                                mode="time"
                                is24Hour
                                onChange={seleccionarHora}
                            />
                        )}

                        {errores.horaInicio !== '' && (
                            <Text style={commonStyles.errorText} > {errores.horaInicio} </Text>
                        )}
                    </View>

                    <View style={commonStyles.modalButtons} >
                        <TouchableOpacity style={commonStyles.modalButtonCancelar} onPress={onClose}>
                            <Text style={commonStyles.modalButtonCancelarText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={commonStyles.modalButton} onPress={guardar}>
                            <Text style={commonStyles.buttonText}>{esEdicion ? 'Guardar' : 'Crear'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}