
import { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { Sala } from '../../../types/Sala';
import { useAppSelector } from '../../../redux/hooks';
import { commonStyles } from '../../../theme';
import { validarCampo, type Campo, type FormData, type FormErrors, } from '../validarSala';
import { colores } from '../../../theme';

interface SalaFormModalProps {
    visible: boolean;
    sala?: Sala;
    salas: Sala[];
    onClose: () => void;
    onGuardar: (datos: Omit<Sala, 'id' | 'asientos'>) => void;
}

export default function SalaFormModal({
    visible,
    sala,
    salas,
    onClose,
    onGuardar,
}: SalaFormModalProps) {
    const esEdicion = !!sala;
    const cines = useAppSelector(state => state.cine.lista);

    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        filas: '',
        columnas: '',
    });

    const [cineId, setCineId] = useState<number | null>(null);
    const [errorCine, setErrorCine] = useState('');

    const [errores, setErrores] = useState<FormErrors>({
        nombre: '',
        filas: '',
        columnas: '',
    });

    useEffect(() => {
        if (sala) {
            setFormData({
                nombre: sala.nombre,
                filas: String(sala.capacidad.filas),
                columnas: String(sala.capacidad.columnas),
            });
            setCineId(sala.cineId);
        } else {
            setFormData({
                nombre: '',
                filas: '',
                columnas: '',
            });
            setCineId(null);
        }

        setErrores({ nombre: '', filas: '', columnas: '' });
        setErrorCine('');
    }, [sala, visible]);

    const cambiarCampo = (campo: Campo, valor: string) => {
        setFormData(prev => ({ ...prev, [campo]: valor }));

        setErrores(prev => ({
            ...prev,
            [campo]: validarCampo(campo, valor, salas, sala),
        }));
    };

    const guardar = () => {
        const nuevosErrores: FormErrors = {
            nombre: validarCampo('nombre', formData.nombre, salas, sala),
            filas: validarCampo('filas', formData.filas, salas, sala),
            columnas: validarCampo('columnas', formData.columnas, salas, sala),
        };

        setErrores(nuevosErrores);

        const cineValido =
            cineId !== null && cines.some(cine => cine.id === cineId);

        setErrorCine(cineValido ? '' : 'Selecciona un cine.');

        const hayErrores = Object.values(nuevosErrores).some(
            error => error !== ''
        );

        if (hayErrores || !cineValido) {
            return;
        }

        onGuardar({
            nombre: formData.nombre.trim(),
            cineId,
            capacidad: {
                filas: Number(formData.filas),
                columnas: Number(formData.columnas),
            },
        });
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={commonStyles.modalOverlay}>
                <View style={commonStyles.modal}>
                    <Text style={commonStyles.title}>
                        {esEdicion ? 'Editar sala' : 'Nueva sala'}
                    </Text>


                    <View style={commonStyles.inputView}>
                        <Text style={commonStyles.label}>Cine</Text>


                        <View style={commonStyles.inputView}>
                            <View
                                style={{
                                    backgroundColor: colores.secundario,
                                    borderWidth: 1,
                                    borderColor: errorCine ? colores.rojo : colores.borde,
                                    borderRadius: 8,
                                    paddingHorizontal: 12,
                                    paddingVertical: 0,
                                }}
                            >
                                <Picker
                                    selectedValue={cineId}
                                    onValueChange={(valor: number | null) => {
                                        setCineId(valor);
                                        setErrorCine('');
                                    }}
                                    style={{ color: colores.blanco }}
                                    dropdownIconColor={colores.blanco}
                                    enabled={cines.length > 0}
                                >
                                    <Picker.Item
                                        label="Selecciona un cine"
                                        value={null}
                                        color={colores.blanco}
                                    />

                                    {cines.map(cine => (
                                        <Picker.Item
                                            key={cine.id}
                                            label={cine.nombre}
                                            value={cine.id}
                                            color={colores.blanco}
                                        />
                                    ))}
                                </Picker>
                            </View>

                            {cines.length === 0 && (
                                <Text style={commonStyles.secondaryText}>
                                    No hay cines disponibles.
                                </Text>
                            )}

                            {errorCine !== '' && (
                                <Text style={commonStyles.errorText}>
                                    {errorCine}
                                </Text>
                            )}
                        </View>

                        {cines.length === 0 && (
                            <Text style={commonStyles.secondaryText}>
                                No hay cines disponibles.
                            </Text>
                        )}

                        {errorCine !== '' && (
                            <Text style={commonStyles.errorText}>
                                {errorCine}
                            </Text>
                        )}
                    </View>

                    <View style={commonStyles.inputView}>
                        <Text style={commonStyles.label}>Nombre</Text>
                        <TextInput
                            style={[
                                commonStyles.input,
                                errores.nombre
                                    ? commonStyles.errorInput
                                    : undefined,
                            ]}
                            value={formData.nombre}
                            onChangeText={valor => cambiarCampo('nombre', valor)}
                            placeholder="Sala 1"
                        />
                        {errores.nombre !== '' && (
                            <Text style={commonStyles.errorText}>
                                {errores.nombre}
                            </Text>
                        )}
                    </View>

                    <View style={commonStyles.inputView}>
                        <Text style={commonStyles.label}>Filas</Text>
                        <TextInput
                            style={[
                                commonStyles.input,
                                errores.filas
                                    ? commonStyles.errorInput
                                    : undefined,
                            ]}
                            value={formData.filas}
                            onChangeText={valor => cambiarCampo('filas', valor)}
                            keyboardType="numeric"
                            placeholder="5"
                        />
                        {errores.filas !== '' && (
                            <Text style={commonStyles.errorText}>
                                {errores.filas}
                            </Text>
                        )}
                    </View>

                    <View style={commonStyles.inputView}>
                        <Text style={commonStyles.label}>Columnas</Text>
                        <TextInput
                            style={[
                                commonStyles.input,
                                errores.columnas
                                    ? commonStyles.errorInput
                                    : undefined,
                            ]}
                            value={formData.columnas}
                            onChangeText={valor =>
                                cambiarCampo('columnas', valor)
                            }
                            keyboardType="numeric"
                            placeholder="8"
                        />
                        {errores.columnas !== '' && (
                            <Text style={commonStyles.errorText}>
                                {errores.columnas}
                            </Text>
                        )}
                    </View>

                    <View style={commonStyles.modalButtons}>
                        <TouchableOpacity
                            style={commonStyles.modalButtonCancelar}
                            onPress={onClose}
                        >
                            <Text style={commonStyles.modalButtonCancelarText}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={commonStyles.modalButton}
                            onPress={guardar}
                        >
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