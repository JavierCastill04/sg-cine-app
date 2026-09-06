import { FlatList } from "react-native";
import { Pelicula } from "../../../types/Pelicula";
import CarteleraCard from "../components/CarteleraCard";

interface CarteleraListProps {
    peliculas: Pelicula[],
    onVerFunciones:(pelicula:Pelicula) => void;
}


export default function CarteleraList({ peliculas, onVerFunciones }: CarteleraListProps) {
    return (
        <FlatList
            data={peliculas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <CarteleraCard
                    pelicula={item}
                    onVerFunciones={onVerFunciones}
                />
            )
            }
        />
    );
}