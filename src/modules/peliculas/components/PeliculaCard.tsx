import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Pencil, Power, Trash2 } from "lucide-react-native";

import { Pelicula } from "../../../types/Pelicula";
import { commonStyles, colores } from "../../../theme";

interface Props {
  pelicula: Pelicula;
  onEditar: () => void;
  onEliminar: () => void;
  onCambiarDisponibilidad: () => void;
}

export default function PeliculaCard({
  pelicula,
  onEditar,
  onEliminar,
  onCambiarDisponibilidad,
}: Props) {
  return (
    <View style={commonStyles.card}>
      <Text style={commonStyles.cardTitle}>
        {pelicula.nombre}
      </Text>

      <Text style={commonStyles.text}>
        Código: {pelicula.codigo}
      </Text>

      <Text style={commonStyles.text}>
        Género: {pelicula.genero}
      </Text>

      <Text style={commonStyles.text}>
        Duración: {pelicula.duracion} min
      </Text>

      <Text style={commonStyles.text}>
        Clasificación: {pelicula.clasificacion}
      </Text>

      <Text style={commonStyles.text}>
        Precio: ${pelicula.precio.toFixed(2)}
      </Text>

      <Text
        style={[
          commonStyles.text,
          {
            marginTop: 8,
            color: pelicula.disponible
              ? colores.verde
              : colores.rojo,
            fontWeight: "700",
          },
        ]}
      >
        Estado: {pelicula.disponible ? "Disponible" : "No disponible"}
      </Text>

      <View style={commonStyles.cardButtonContainter}>

        {/* Editar */}
        <TouchableOpacity
          style={[
            commonStyles.cardButton,
            { backgroundColor: colores.enfasis },
          ]}
          onPress={onEditar}
        >
          <Pencil
            size={20}
            color={colores.negro}
          />
        </TouchableOpacity>

        {/* Habilitar / Deshabilitar */}
        <TouchableOpacity
          style={[
            commonStyles.cardButton,
            { backgroundColor: colores.enfasis },
          ]}
          onPress={onCambiarDisponibilidad}
        >
          <Power
            size={20}
            color={colores.negro}
          />
        </TouchableOpacity>

        {/* Eliminar */}
        <TouchableOpacity
          style={[
            commonStyles.cardButton,
            { backgroundColor: colores.rojo },
          ]}
          onPress={onEliminar}
        >
          <Trash2
            size={20}
            color={colores.negro}
          />
        </TouchableOpacity>

      </View>
    </View>
  );
}