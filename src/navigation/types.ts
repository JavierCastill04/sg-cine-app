
export type RootStackParamList = {
    Home: undefined;

    Login: {
        funcionId?: number;
    } | undefined;
    
    Registro: undefined;

    ClienteNavigator: undefined;
    PersonalNavigator: undefined;

    Reserva: {
        funcionId: number;
        pasoInicial?: number;
    };
};

export type ClienteTabParamList = {
    Cartelera: undefined;
    Cines: undefined;
    Boletos: undefined;
    Perfil: undefined;
};

export type PersonalTabParamList = {
    Peliculas: undefined;
    Salas: undefined;
    Funciones: undefined;
    Dashboard: undefined;
    Escaner: undefined;
};
