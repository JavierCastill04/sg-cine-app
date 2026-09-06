import { FlatList } from "react-native";
import { Pelicula } from "../../../types/Pelicula";
import CarteleraCard from "../components/CarteleraCard";

interface CarteleraListProps {
    peliculas: Pelicula[],
}


export default function CarteleraList({ peliculas }: CarteleraListProps) {
    return (
        <FlatList
            data={peliculas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <CarteleraCard
                    pelicula={item}
                />
            )
            }
        />
    );
}