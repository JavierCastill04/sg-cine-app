import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { commonStyles, colores } from '../../../theme';
import type { ErroresPelicula } from '../peliculaValidaciones';

const generos = [
    "Acción",
    "Animación",
    "Terror",
    "Suspenso",
    "Romance",
    "Comedia",
    "Aventura",
    "Ciencia Ficción",
];

const clasificaciones = [
    "Todo público",
    "12+",
    "15+",
    "18+",
];

interface PeliculaFormProps {
    codigo: string;
    nombre: string;
    genero: string;
    duracion: string;
    clasificacion: string;
    precio: string;
    setCodigo: (value: string) => void;
    setNombre: (value: string) => void;
    setGenero: (value: string) => void;
    setDuracion: (value: string) => void;
    setClasificacion: (value: string) => void;
    setPrecio: (value: string) => void;
    errores: ErroresPelicula;
    editando: boolean;
    onGuardar: () => void;
    onCancelar: () => void;
}

export default function PeliculaForm({
    codigo, nombre, genero, duracion, clasificacion, precio,
    setCodigo, setNombre, setGenero, setDuracion, setClasificacion, setPrecio,
    errores = {}, editando, onGuardar, onCancelar
}: PeliculaFormProps) {
    const inputStyle = (error?: string) => ({
        backgroundColor: colores.secundario,
        borderWidth: 1,
        borderColor: error ? colores.rojo : colores.borde,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: colores.blanco,
        fontSize: 16
    });

    const campo = (
        label: string,
        value: string,
        onChangeText: (value: string) => void,
        placeholder: string,
        error?: string,
        keyboardType?: "default" | "numeric"
    ) => (
        <View style={commonStyles.inputView}>
            <Text style={[commonStyles.labelBlack, { color: colores.blanco }]}>{label}</Text>
            <TextInput
                style={inputStyle(error)}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colores.textoSecundario}
                keyboardType={keyboardType}
            />
            {error && <Text style={commonStyles.errorText}>{error}</Text>}
        </View>
    );

    return (
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={{ backgroundColor: colores.secundario, borderRadius: 12, padding: 20 }}>
                <Text style={[commonStyles.heading, { color: colores.blanco, marginBottom: 20 }]}>
                    {editando ? 'Editar película' : 'Nueva película'}
                </Text>

                {campo("Código", codigo, setCodigo, "Ej. PEL-005", errores.codigo)}
                {campo("Nombre", nombre, setNombre, "Nombre de la película", errores.nombre)}

                <View style={commonStyles.inputView}>
                    <Text style={[commonStyles.labelBlack, { color: colores.blanco }]}>
                        Género
                    </Text>

                    <View style={inputStyle(errores.genero)}>
                        <Picker
                            selectedValue={genero}
                            onValueChange={setGenero}
                            style={{ color: colores.blanco }}
                            dropdownIconColor={colores.blanco}
                        >
                            <Picker.Item
                                label="Selecciona un género"
                                value=""
                            />

                            {generos.map(genero => (
                                <Picker.Item
                                    key={genero}
                                    label={genero}
                                    value={genero}
                                />
                            ))}
                        </Picker>
                    </View>

                    {errores.genero && (
                        <Text style={commonStyles.errorText}>
                            {errores.genero}
                        </Text>
                    )}
                </View>

                {campo(
                    "Duración",
                    duracion,
                    setDuracion,
                    "Duración en minutos",
                    errores.duracion,
                    "numeric"
                )}

                <View style={commonStyles.inputView}>
                    <Text style={[commonStyles.labelBlack, { color: colores.blanco }]}>
                        Clasificación
                    </Text>

                    <View style={inputStyle(errores.clasificacion)}>
                        <Picker
                            selectedValue={clasificacion}
                            onValueChange={setClasificacion}
                            style={{ color: colores.blanco }}
                            dropdownIconColor={colores.blanco}
                        >
                            <Picker.Item
                                label="Selecciona una clasificación"
                                value=""
                            />

                            {clasificaciones.map(clasificacion => (
                                <Picker.Item
                                    key={clasificacion}
                                    label={clasificacion}
                                    value={clasificacion}
                                />
                            ))}
                        </Picker>
                    </View>

                    {errores.clasificacion && (
                        <Text style={commonStyles.errorText}>
                            {errores.clasificacion}
                        </Text>
                    )}
                </View>

                {campo(
                    "Precio",
                    precio,
                    setPrecio,
                    "Ej. 6.50",
                    errores.precio,
                    "numeric"
                )}

                <TouchableOpacity
                    style={[commonStyles.button, { marginTop: 5 }]}
                    onPress={onGuardar}
                >
                    <Text style={commonStyles.buttonText}>
                        {editando ? 'Actualizar película' : 'Guardar película'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        commonStyles.button,
                        { backgroundColor: colores.rojo, marginTop: 10 }
                    ]}
                    onPress={onCancelar}
                >
                    <Text style={[commonStyles.buttonText, { color: colores.blanco }]}>
                        Cancelar
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}