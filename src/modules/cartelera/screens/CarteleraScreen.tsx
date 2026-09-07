import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { useAppSelector } from "../../../redux/hooks";
import { Pelicula } from "../../../types/Pelicula";

import Filtros from "../../../components/filtro/Filtros";

import CarteleraList from "../components/CarteleraList";
import CarteleraSlider from "../components/CarteleraSlider";
import CarteleraModal from "../components/CarteleraModal";

import { commonStyles } from "../../../theme";

export default function CarteleraScreen() {
    const [peliculaSeleccionada, setPeliculaSeleccionada] = useState<Pelicula | null>(null);
    const [busqueda, setBusqueda] = useState("");
    const [generoSeleccionado, setGeneroSeleccionado] = useState("");
    const [clasificacionSeleccionada, setClasificacionSeleccionada] = useState("");
    const [salaSeleccionada, setSalaSeleccionada] = useState<number | null>(null);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState<"todos" | "disponible" | "noDisponible">("disponible");
    const peliculas = useAppSelector((state) => state.pelicula);
    const funciones = useAppSelector((state) => state.funcion);
    const salas = useAppSelector((state) => state.sala);
    const peliculasConFunciones = peliculas.filter((pelicula) => funciones.some((funcion) => funcion.peliculaId === pelicula.id));
    const peliculasDestacadas = peliculas.filter((pelicula) => {
        const numFunciones = funciones.filter((funcion) => funcion.peliculaId === pelicula.id).length;
        return numFunciones > 3;
    });

    const generos = useMemo(
        () => [...new Set(peliculas.map((pelicula) => pelicula.genero))],
        [peliculas]
    );

    const clasificaciones = useMemo(
        () => [
            ...new Set(
                peliculas.map((pelicula) => pelicula.clasificacion)
            ),
        ],
        [peliculas]
    );

    const obtenerSalasDePelicula = (peliculaId: number) => {
        const salaIds = funciones
            .filter((funcion) => funcion.peliculaId === peliculaId)
            .map((funcion) => funcion.salaId);

        return salas.filter((sala) => salaIds.includes(sala.id));
    };

    const peliculasFiltradas = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();

        return peliculasConFunciones.filter((pelicula) => {
            const salasDePelicula = obtenerSalasDePelicula(pelicula.id);

            const nombresSalas = salasDePelicula
                .map((sala) => sala.nombre.toLowerCase())
                .join(" ");

            const coincideBusqueda =
                texto === "" ||
                pelicula.nombre.toLowerCase().includes(texto) ||
                pelicula.genero.toLowerCase().includes(texto) ||
                pelicula.clasificacion.toLowerCase().includes(texto) ||
                nombresSalas.includes(texto);

            const coincideGenero =
                generoSeleccionado === "" ||
                pelicula.genero === generoSeleccionado;

            const coincideClasificacion =
                clasificacionSeleccionada === "" ||
                pelicula.clasificacion ===
                clasificacionSeleccionada;

            const coincideSala =
                salaSeleccionada === null ||
                salasDePelicula.some(
                    (sala) => sala.id === salaSeleccionada
                );

            const coincideEstado =
                estadoSeleccionado === "todos" ||
                (estadoSeleccionado === "disponible" &&
                    pelicula.disponible) ||
                (estadoSeleccionado === "noDisponible" &&
                    !pelicula.disponible);

            return (
                coincideBusqueda &&
                coincideGenero &&
                coincideClasificacion &&
                coincideSala &&
                coincideEstado
            );
        });
    }, [
        peliculasConFunciones,
        busqueda,
        generoSeleccionado,
        clasificacionSeleccionada,
        salaSeleccionada,
        estadoSeleccionado,
        funciones,
        salas,
    ]);

    const abrirFunciones = (pelicula: Pelicula) => {
        setPeliculaSeleccionada(pelicula);
    };

    const cerrarFunciones = () => {
        setPeliculaSeleccionada(null);
    };

    return (
        <View style={commonStyles.containerScreen}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <CarteleraSlider
                    peliculasDestacadas={peliculasDestacadas}
                    onVerFunciones={abrirFunciones}
                />

                <Filtros
                    busqueda={busqueda}
                    onBusquedaChange={setBusqueda}
                    generoSeleccionado={generoSeleccionado}
                    onGeneroChange={setGeneroSeleccionado}
                    clasificacionSeleccionada={
                        clasificacionSeleccionada
                    }
                    onClasificacionChange={
                        setClasificacionSeleccionada
                    }
                    salaSeleccionada={salaSeleccionada}
                    onSalaChange={setSalaSeleccionada}
                    estadoSeleccionado={estadoSeleccionado}
                    onEstadoChange={setEstadoSeleccionado}
                    generos={generos}
                    clasificaciones={clasificaciones}
                    salas={salas.map((sala) => ({
                        id: sala.id,
                        nombre: sala.nombre,
                    }))}
                />

                <CarteleraList
                    peliculas={peliculasFiltradas}
                    onVerFunciones={abrirFunciones}
                />

                {peliculasFiltradas.length === 0 && (
                    <Text
                        style={[
                            commonStyles.text,
                            {
                                textAlign: "center",
                                marginTop: 20,
                            },
                        ]}
                    >
                        No se encontraron películas con los
                        filtros seleccionados.
                    </Text>
                )}
            </ScrollView>

            <CarteleraModal
                visible={peliculaSeleccionada !== null}
                pelicula={peliculaSeleccionada}
                onClose={cerrarFunciones}
            />
        </View>
    );
}