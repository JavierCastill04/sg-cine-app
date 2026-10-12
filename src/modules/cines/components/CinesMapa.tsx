import { useEffect, useMemo, useRef } from 'react';
import { WebView } from 'react-native-webview';

import { commonStyles } from '../../../theme';
import type { Cine } from '../../../services/cines.service';
import type { Ubicacion } from '../utils/distancia';

interface CinesMapaProps {
    cines: Cine[];
    ubicacionUsuario: Ubicacion | null;
    restablecerEncuadre: number;
}

export default function CinesMapa({
    cines,
    ubicacionUsuario,
    restablecerEncuadre,
}: CinesMapaProps) {
    const mapaRef = useRef<WebView>(null);

    const html = useMemo(() => {
        const ubicaciones = cines
            .map(cine => ({
                id: cine.id,
                nombre: cine.nombre,
                direccion: cine.direccion,
                latitud: Number(cine.latitud),
                longitud: Number(cine.longitud),
            }))
            .filter(
                cine =>
                    Number.isFinite(cine.latitud) &&
                    Number.isFinite(cine.longitud) &&
                    cine.latitud >= -90 &&
                    cine.latitud <= 90 &&
                    cine.longitud >= -180 &&
                    cine.longitud <= 180
            );

        const datos = JSON.stringify(ubicaciones).replace(
            /</g,
            '\\u003c'
        );

        const datosUsuario = JSON.stringify(ubicacionUsuario);

        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />

    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    />

    <style>
        html, body, #map {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }
    </style>
</head>

<body>
    <div id="map"></div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

    <script>
        const cines = ${datos};
        const usuario = ${datosUsuario};

        const mapa = L.map('map').setView(
            [13.6929, -89.2182],
            11
        );

        L.tileLayer(
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap contributors'
            }
        ).addTo(mapa);

        const limites = [];

        cines.forEach(cine => {
            const posicion = [
                cine.latitud,
                cine.longitud
            ];

            const marcador = L.marker(posicion).addTo(mapa);

            const contenido = document.createElement('div');
            const titulo = document.createElement('strong');
            const direccion = document.createElement('p');

            titulo.textContent = cine.nombre;
            direccion.textContent = cine.direccion;

            contenido.appendChild(titulo);
            contenido.appendChild(direccion);

            marcador.bindPopup(contenido);
            limites.push(posicion);
        });

        if (usuario) {
            const posicionUsuario = [
                usuario.latitud,
                usuario.longitud
            ];

            L.circleMarker(posicionUsuario, {
                radius: 9,
                color: '#ffffff',
                weight: 3,
                fillColor: '#2563eb',
                fillOpacity: 1
            })
                .addTo(mapa)
                .bindPopup('Tu ubicación actual');

            limites.push(posicionUsuario);
        }

        function restablecerEncuadre() {
            if (limites.length > 0) {
                mapa.fitBounds(limites, {
                    padding: [30, 30],
                    maxZoom: 13
                });
            } else {
                mapa.setView([13.6929, -89.2182], 11);
            }
        }

        restablecerEncuadre();

        window.addEventListener('message', event => {
            if (event.data === 'restablecerEncuadre') {
                restablecerEncuadre();
            }
        });

        document.addEventListener('message', event => {
            if (event.data === 'restablecerEncuadre') {
                restablecerEncuadre();
            }
        });
    </script>
</body>
</html>
        `;
    }, [cines, ubicacionUsuario]);

    useEffect(() => {
        if (restablecerEncuadre > 0) {
            mapaRef.current?.injectJavaScript(`
                restablecerEncuadre();
                true;
            `);
        }
    }, [restablecerEncuadre]);

    return (
        <WebView
            ref={mapaRef}
            originWhitelist={['*']}
            source={{
                html,
                baseUrl: 'https://localhost/',
            }}
            style={commonStyles.cinesMapaWebView}
            javaScriptEnabled
            domStorageEnabled
            scrollEnabled={false}
            onError={event => {
                console.error(
                    'Error al cargar el mapa:',
                    event.nativeEvent.description
                );
            }}
        />
    );
}