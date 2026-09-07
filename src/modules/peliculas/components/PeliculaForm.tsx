import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
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

    const inputStyle = {
        backgroundColor: colores.secundario,
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: colores.blanco,
        fontSize: 16,
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View
                style={{
                    backgroundColor: colores.secundario,
                    borderRadius: 12,
                    padding: 20,
                }}
            >

                <Text
                    style={[
                        commonStyles.heading,
                        {
                            color: colores.blanco,
                            marginBottom: 20,
                        },
                    ]}
                >
                    {editando
                        ? 'Editar película'
                        : 'Nueva película'}
                </Text>

                {/* Código */}
                <View style={commonStyles.inputView}>
                    <Text
                        style={[
                            commonStyles.labelBlack,
                            { color: colores.blanco },
                        ]}
                    >
                        Código
                    </Text>

                    <TextInput
                        style={inputStyle}
                        value={codigo}
                        onChangeText={setCodigo}
                        placeholder="Ej. PEL-005"
                        placeholderTextColor={colores.textoSecundario}
                    />
                </View>

                {/* Nombre */}
                <View style={commonStyles.inputView}>
                    <Text
                        style={[
                            commonStyles.labelBlack,
                            { color: colores.blanco },
                        ]}
                    >
                        Nombre
                    </Text>

                    <TextInput
                        style={inputStyle}
                        value={nombre}
                        onChangeText={setNombre}
                        placeholder="Nombre de la película"
                        placeholderTextColor={colores.textoSecundario}
                    />
                </View>

                {/* Género */}
                <View style={commonStyles.inputView}>
                    <Text
                        style={[
                            commonStyles.labelBlack,
                            { color: colores.blanco },
                        ]}
                    >
                        Género
                    </Text>

                    <TextInput
                        style={inputStyle}
                        value={genero}
                        onChangeText={setGenero}
                        placeholder="Ej. Acción"
                        placeholderTextColor={colores.textoSecundario}
                    />
                </View>

                {/* Duración */}
                <View style={commonStyles.inputView}>
                    <Text
                        style={[
                            commonStyles.labelBlack,
                            { color: colores.blanco },
                        ]}
                    >
                        Duración
                    </Text>

                    <TextInput
                        style={inputStyle}
                        value={duracion}
                        onChangeText={setDuracion}
                        placeholder="Duración en minutos"
                        placeholderTextColor={colores.textoSecundario}
                        keyboardType="numeric"
                    />
                </View>

                {/* Clasificación */}
                <View style={commonStyles.inputView}>
                    <Text
                        style={[
                            commonStyles.labelBlack,
                            { color: colores.blanco },
                        ]}
                    >
                        Clasificación
                    </Text>

                    <TextInput
                        style={inputStyle}
                        value={clasificacion}
                        onChangeText={setClasificacion}
                        placeholder="Ej. 12+"
                        placeholderTextColor={colores.textoSecundario}
                    />
                </View>

                {/* Precio */}
                <View style={commonStyles.inputView}>
                    <Text
                        style={[
                            commonStyles.labelBlack,
                            { color: colores.blanco },
                        ]}
                    >
                        Precio
                    </Text>

                    <TextInput
                        style={inputStyle}
                        value={precio}
                        onChangeText={setPrecio}
                        placeholder="Ej. 6.50"
                        placeholderTextColor={colores.textoSecundario}
                        keyboardType="numeric"
                    />
                </View>

                {/* Guardar */}
                <TouchableOpacity
                    style={[
                        commonStyles.button,
                        {
                            marginTop: 5,
                        },
                    ]}
                    onPress={onGuardar}
                >
                    <Text style={commonStyles.buttonText}>
                        {editando
                            ? 'Actualizar película'
                            : 'Guardar película'}
                    </Text>
                </TouchableOpacity>

                {/* Cancelar */}
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
        </ScrollView>
    );
}