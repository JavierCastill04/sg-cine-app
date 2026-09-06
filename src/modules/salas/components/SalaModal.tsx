import { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import type { Sala } from '../../../types/Sala';
import { commonStyles } from '../../../theme';
import { validarCampo, type Campo, type FormData, type FormErrors, } from '../validarSala';

interface SalaFormModalProps {
    visible: boolean;
    sala?: Sala;
    salas: Sala[];
    onClose: () => void;
    onGuardar: (datos: Omit<Sala, 'id' | 'asientos'>) => void;
}

export default function SalaFormModal({ visible, sala, salas, onClose, onGuardar }: SalaFormModalProps) {

    const esEdicion = !!sala;
    const [formData, setFormData] = useState<FormData>({ nombre: '', filas: '', columnas: '', });
    const [errores, setErrores] = useState<FormErrors>({ nombre: '', filas: '', columnas: '', });

    useEffect(() => {
        if (sala) {
            setFormData({
                nombre: sala.nombre,
                filas: String(sala.capacidad.filas),
                columnas: String(sala.capacidad.columnas),
            });
        } else {
            setFormData({ nombre: '', filas: '', columnas: '', });
        }

        setErrores({ nombre: '', filas: '', columnas: '', });

    }, [sala, visible]);

    const cambiarCampo = (campo: Campo, valor: string) => {

        const nuevoFormData = { ...formData, [campo]: valor, };
        setFormData(nuevoFormData);

        const error = validarCampo(campo, valor, salas, sala);
        setErrores({ ...errores, [campo]: error, });
    };

    const guardar = () => {

        const nuevosErrores: FormErrors = {
            nombre: validarCampo('nombre', formData.nombre, salas, sala),
            filas: validarCampo('filas', formData.filas, salas, sala),
            columnas: validarCampo('columnas', formData.columnas, salas, sala),
        };

        setErrores(nuevosErrores);

        const hayErrores = Object.values(nuevosErrores).some(error => error !== '');
        if (hayErrores) {
            return;
        }

        onGuardar({
            nombre: formData.nombre.trim(),
            capacidad: {
                filas: Number(formData.filas),
                columnas: Number(formData.columnas),
            },
        });
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={commonStyles.modalOverlay}>
                <View style={commonStyles.modal}>

                    <Text style={commonStyles.title}>
                        {esEdicion ? 'Editar sala' : 'Nueva sala'}
                    </Text>

                    <View style={commonStyles.inputView}>
                        <Text style={commonStyles.label}>
                            Nombre
                        </Text>
                        <TextInput
                            style={[commonStyles.input, errores.nombre ? commonStyles.errorInput : undefined,]}
                            value={formData.nombre}
                            onChangeText={valor => cambiarCampo('nombre', valor)}
                            placeholder="Sala 1"
                        />

                        {errores.nombre !== '' && (
                            <Text style={commonStyles.errorText} >
                                {errores.nombre}
                            </Text>
                        )}
                    </View>

                    <View style={commonStyles.inputView}>
                        <Text style={commonStyles.label}>
                            Filas
                        </Text>
                        <TextInput
                            style={[commonStyles.input, errores.filas ? commonStyles.errorInput : undefined,]}
                            value={formData.filas}
                            onChangeText={valor => cambiarCampo('filas', valor)}
                            keyboardType="numeric"
                            placeholder="5"
                        />

                        {errores.filas !== '' && (
                            <Text style={commonStyles.errorText} >
                                {errores.filas}
                            </Text>
                        )}

                    </View>
                    <View style={commonStyles.inputView}>
                        <Text style={commonStyles.label}>
                            Columnas
                        </Text>
                        <TextInput
                            style={[commonStyles.input, errores.columnas ? commonStyles.errorInput : undefined,]}
                            value={formData.columnas}
                            onChangeText={valor => cambiarCampo('columnas', valor)}
                            keyboardType="numeric"
                            placeholder="8"
                        />

                        {errores.columnas !== '' && (
                            <Text style={commonStyles.errorText} >
                                {errores.columnas}
                            </Text>
                        )}
                    </View>

                    <View style={commonStyles.modalButtons}>
                        <TouchableOpacity style={commonStyles.modalButtonCancelar} onPress={onClose} >
                            <Text style={commonStyles.modalButtonCancelarText}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={commonStyles.modalButton} onPress={guardar}>
                            <Text style={commonStyles.buttonText}>
                                {esEdicion ? 'Guardar' : 'Crear'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}