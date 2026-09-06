import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
} from 'react-native';

import { commonStyles, colores } from '../../../theme';

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

    editando: boolean;

    onGuardar: () => void;
    onCancelar: () => void;
}

export default function PeliculaForm({
    codigo,
    nombre,
    genero,
    duracion,
    clasificacion,
    precio,

    setCodigo,
    setNombre,
    setGenero,
    setDuracion,
    setClasificacion,
    setPrecio,

    editando,

    onGuardar,
    onCancelar,
}: PeliculaFormProps) {

    return (
        <View
            style={[
                commonStyles.card,
                {
                    backgroundColor: colores.superficie,
                    borderLeftWidth: 0,
                    borderWidth: 1,
                    borderColor: colores.borde,
                },
            ]}
        >

            <Text
                style={[
                    commonStyles.heading,
                    {
                        marginBottom: 15,
                    },
                ]}
            >
                {editando
                    ? 'Editar película'
                    : 'Nueva película'}
            </Text>

            <View style={commonStyles.inputView}>
                <Text style={commonStyles.labelBlack}>
                    Código
                </Text>

                <TextInput
                    style={commonStyles.input}
                    value={codigo}
                    onChangeText={setCodigo}
                    placeholder="Ej. PEL-005"
                    placeholderTextColor={colores.textoSecundario}
                />
            </View>

            <View style={commonStyles.inputView}>
                <Text style={commonStyles.labelBlack}>
                    Nombre
                </Text>

                <TextInput
                    style={commonStyles.input}
                    value={nombre}
                    onChangeText={setNombre}
                    placeholder="Nombre de la película"
                    placeholderTextColor={colores.textoSecundario}
                />
            </View>

            <View style={commonStyles.inputView}>
                <Text style={commonStyles.labelBlack}>
                    Género
                </Text>

                <TextInput
                    style={commonStyles.input}
                    value={genero}
                    onChangeText={setGenero}
                    placeholder="Ej. Acción"
                    placeholderTextColor={colores.textoSecundario}
                />
            </View>

            <View style={commonStyles.inputView}>
                <Text style={commonStyles.labelBlack}>
                    Duración
                </Text>

                <TextInput
                    style={commonStyles.input}
                    value={duracion}
                    onChangeText={setDuracion}
                    placeholder="Duración en minutos"
                    placeholderTextColor={colores.textoSecundario}
                    keyboardType="numeric"
                />
            </View>

            <View style={commonStyles.inputView}>
                <Text style={commonStyles.labelBlack}>
                    Clasificación
                </Text>

                <TextInput
                    style={commonStyles.input}
                    value={clasificacion}
                    onChangeText={setClasificacion}
                    placeholder="Ej. 12+"
                    placeholderTextColor={colores.textoSecundario}
                />
            </View>

            <View style={commonStyles.inputView}>
                <Text style={commonStyles.labelBlack}>
                    Precio
                </Text>

                <TextInput
                    style={commonStyles.input}
                    value={precio}
                    onChangeText={setPrecio}
                    placeholder="Ej. 6.50"
                    placeholderTextColor={colores.textoSecundario}
                    keyboardType="numeric"
                />
            </View>

            <TouchableOpacity
                style={commonStyles.button}
                onPress={onGuardar}
            >
                <Text style={commonStyles.buttonText}>
                    {editando
                        ? 'Actualizar película'
                        : 'Guardar película'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    commonStyles.button,
                    {
                        backgroundColor: colores.rojo,
                        marginTop: 10,
                    },
                ]}
                onPress={onCancelar}
            >
                <Text
                    style={[
                        commonStyles.buttonText,
                        {
                            color: colores.blanco,
                        },
                    ]}
                >
                    Cancelar
                </Text>
            </TouchableOpacity>

        </View>
    );
}