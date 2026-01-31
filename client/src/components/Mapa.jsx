// components/Mapa.jsx
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Correção dos ícones do Leaflet para Vite
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Configurar os ícones padrão
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Banco de dados de bairros de Lichinga com coordenadas aproximadas
const bairrosLichinga = {
  // Bairros centrais
  'centro': [-13.3124, 35.2406],
  '25 de junho': [-13.3030, 35.2450],
  'liberdade': [-13.3100, 35.2350],
  'unidade': [-13.3150, 35.2500],
  'ponta de ouro': [-13.3200, 35.2550],
  'chilobwe': [-13.3050, 35.2300],
  'joaquim chissano': [-13.3000, 35.2400],
  'jose macamo': [-13.3180, 35.2430],
  'julius nyerere': [-13.3080, 35.2480],
  'massangulo': [-13.3250, 35.2380],
  'majune': [-13.3320, 35.2420],
  'matchuemba': [-13.3150, 35.2250],
  'nampula': [-13.3220, 35.2320],
  'napila': [-13.3280, 35.2280],
  'sabão': [-13.3050, 35.2520],
  'sancul': [-13.3350, 35.2350],
  'songea': [-13.2980, 35.2380],
  // Bairros adicionais (pode adicionar mais)
  'bairro militar': [-13.2900, 35.2450],
  'cimento': [-13.3200, 35.2150],
  'comercial': [-13.3105, 35.2410],
  'hospitalar': [-13.3085, 35.2435],
  'industrial': [-13.3250, 35.2200],
  'universitário': [-13.3005, 35.2505],
};

export default function Mapa({ address, cidade = "Lichinga" }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const [bairro, setBairro] = useState('');
  const [coords, setCoords] = useState([-13.3124, 35.2406]); // Centro de Lichinga

  // Extrair bairro do endereço
  useEffect(() => {
    if (address) {
      // Tentar encontrar bairro no endereço
      const enderecoLowerCase = address.toLowerCase();
      let bairroEncontrado = '';
      
      // Procurar bairros conhecidos no endereço
      Object.keys(bairrosLichinga).forEach(nomeBairro => {
        if (enderecoLowerCase.includes(nomeBairro.toLowerCase())) {
          bairroEncontrado = nomeBairro;
        }
      });
      
      // Se não encontrar, tentar extrair a primeira palavra após vírgula ou número
      if (!bairroEncontrado) {
        const partes = address.split(/[,\-]/);
        if (partes.length > 1) {
          bairroEncontrado = partes[1]?.trim() || '';
        }
      }
      
      // Se ainda não encontrou, usar "Centro" como padrão
      if (!bairroEncontrado || bairroEncontrado.length > 30) {
        bairroEncontrado = 'Centro';
      }
      
      setBairro(bairroEncontrado.charAt(0).toUpperCase() + bairroEncontrado.slice(1));
      
      // Definir coordenadas do bairro
      const bairroKey = bairroEncontrado.toLowerCase();
      if (bairrosLichinga[bairroKey]) {
        setCoords(bairrosLichinga[bairroKey]);
      } else {
        // Adicionar pequena variação aleatória para não sobrepor marcadores
        const randomOffset = () => (Math.random() - 0.5) * 0.01;
        setCoords([-13.3124 + randomOffset(), 35.2406 + randomOffset()]);
      }
    }
  }, [address]);

  useEffect(() => {
    // Inicializar o mapa apenas uma vez
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current).setView(coords, 14);
      
      // Adicionar camada de tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        detectRetina: true,
      }).addTo(mapInstance.current);
    }

    // Atualizar vista do mapa quando as coordenadas mudarem
    if (mapInstance.current) {
      mapInstance.current.setView(coords, 14);
      
      // Remover marcador anterior se existir
      if (markerRef.current) {
        mapInstance.current.removeLayer(markerRef.current);
      }
      
      // Adicionar novo marcador
      markerRef.current = L.marker(coords).addTo(mapInstance.current);
      
      // Adicionar popup
      const popupContent = `
        <div class="p-2 min-w-[200px]">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-2 h-2 bg-red-500 rounded-full"></div>
            <h3 class="font-bold text-gray-800">${cidade}</h3>
          </div>
          <div class="space-y-1">
            <p class="text-sm text-gray-700">
              <span class="font-medium">Bairro:</span> ${bairro}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Endereço:</span> ${address || 'Não especificado'}
            </p>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            📍 Localização aproximada do imóvel
          </p>
        </div>
      `;
      
      markerRef.current.bindPopup(popupContent);
      
      // Abrir popup automaticamente
      setTimeout(() => {
        markerRef.current?.openPopup();
      }, 500);
    }

    // Cleanup
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [coords, address, cidade, bairro]);

  return (
    <div className="relative">
      <div 
        ref={mapRef}
        style={{
          height: "384px", // h-96 equivalente
          width: "100%",
          borderRadius: "0.75rem"
        }}
        className="leaflet-map border border-gray-200"
      />
      
      {/* Legenda */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">
            Propriedade em <span className="text-blue-600">{bairro}</span>
          </span>
        </div>
      </div>
    </div>
  );
}