import { Modal, View } from "react-native";
import { commonStyles, colores } from "../../../theme";
import PeliculaForm from "./PeliculaForm";
import type { ErroresPelicula } from "../peliculaValidaciones";

interface Props {
    visible: boolean;
    editando: boolean;
    datos: {
        codigo: string;
        nombre: string;
        genero: string;
        duracion: string;
        clasificacion: string;
        precio: string;
    };
    setters: {
        setCodigo: (v: string) => void;
        setNombre: (v: string) => void;
        setGenero: (v: string) => void;
        setDuracion: (v: string) => void;
        setClasificacion: (v: string) => void;
        setPrecio: (v: string) => void;
    };
    errores: ErroresPelicula;
    onGuardar: () => void;
    onCancelar: () => void;
}

export default function PeliculaModal({ visible, editando, datos, setters, errores, onGuardar, onCancelar }: Props) {
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancelar}>
            <View style={commonStyles.modalOverlay}>
                <View style={[commonStyles.modal, { backgroundColor: colores.secundario, maxHeight: "90%" }]}>
                    <PeliculaForm {...datos} {...setters} errores={errores} editando={editando} onGuardar={onGuardar} onCancelar={onCancelar} />
                </View>
            </View>
        </Modal>
    );
}