import React, { useState, useEffect } from 'react';

import { MapContainer, TileLayer, useMap, useMapEvents, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import geoJsonData from './../../gejson/indonesia-province-simple.json';
import sumateraBranch from './../../datasumatera.json';
import SimpleChart from '../grafik/SimpleChart';

// Fix icon hilang (karena path default di Leaflet gak cocok di React)
delete L.Icon.Default.prototype._getIconUrl;
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

function ZoomToFeature({ bounds }) {
    const map = useMap();
    useEffect(() => {
        if (bounds) map.fitBounds(bounds);
    }, [bounds, map]);
    return null;
}

function MapView() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [feature, setFeature] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);

    const provName = selectedProvince?.trim().toUpperCase();

    const allData = Object.entries(sumateraBranch[0]).flatMap(([prov, list]) =>
        list.map(item => ({ ...item, provinsiGroup: prov }))
    );

    const filteredData = allData.filter(item =>
        item.provinsi?.trim().toUpperCase() === provName
    );
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const thStyle = {
        textAlign: 'center',
        padding: '8px',
        color: 'black',
        fontSize: '10px',  // ⬅ kecilin font header
        borderBottom: '1px solid #ccc'
    };

    const tdStyle = {
        padding: '8px',
        color: 'black',
        fontSize: '10px',  // ⬅ kecilin font header

        borderBottom: '1px solid #eee'
    };
    const provinceToIsland = {
        "DI. ACEH": "sumatera",
        "SUMATERA UTARA": "sumatera",
        "SUMATERA BARAT": "sumatera",
        "RIAU": "sumatera",
        "KEPULAUAN RIAU": "sumatera",
        "JAMBI": "sumatera",
        "SUMATERA SELATAN": "sumatera",
        "BENGKULU": "sumatera",
        "LAMPUNG": "sumatera",
        "KEPULAUAN BANGKA BELITUNG": "sumatera"
        // ... lanjut untuk Jawa, Kalimantan, dll
    };
    const sumateraProvinces = Object.keys(provinceToIsland).filter(
        (prov) => provinceToIsland[prov] === "sumatera"
    );

    const sumateraGeoJSON = {
        type: "FeatureCollection",
        features: geoJsonData.features.filter(
            (feat) => sumateraProvinces.includes(feat.properties.Propinsi?.toUpperCase())
        )
    };
    function MapResetOnDoubleClick({ onReset }) {
        const map = useMapEvents({
            dblclick() {
                onReset();

                // Delay sejenak agar setFeature(null) selesai
                setTimeout(() => {
                    map.flyTo([-2.27, 121.92], 5, {
                        duration: 0.75 // smooth transition
                    });
                }, 150); // 150ms untuk memastikan re-render selesai
            }
        });

        return null;
    }
    const islandGeoJson = {
        sumatera: sumateraGeoJSON
    };

    const onEachFeature = (feature, layer) => {
        console.log("🔥 onEachFeature jalan:", feature.properties?.Propinsi);

        const provinceName = feature.properties?.Propinsi;
        const islandKey = provinceToIsland[provinceName];
        const islandGeo = islandGeoJson[islandKey];

        if (!islandGeo) return;

        // ✅ Tambah tooltip saat hover
        layer.bindTooltip(provinceName, {
            direction: 'top',
            sticky: true,
            opacity: 0.8,
            className: 'leaflet-tooltip-custom'
        });

        // ✅ Event klik tetap jalan
        layer.on('click', () => {
            const geoLayer = L.geoJSON(islandGeo);
            const bounds = geoLayer.getBounds();
            setSelectedProvince(provinceName);
            console.log("==> Klik:", provinceName);
            console.log("==> Bounds:", bounds);

            setFeature({
                feature: islandGeo,
                bounds
            });
        });
    };


    return (
        <div>

            <MapContainer
                key={feature ? 'zoomed' : 'default'} // <- force remount

                center={[-2.2723306192832458, 121.92820545081639]} zoom={5} style={{ width: '100%', height: '75vh' }}
                // dragging={false}
                scrollWheelZoom={false}
                doubleClickZoom={false} // ⬅️ ini dia bro
                // boxZoom={false}
                zoomControl={false}

                // keyboard={false}
                touchZoom={false} // ini buat disable drag
            // zoomControl={false}
            >
                <MapResetOnDoubleClick
                    onReset={() => {
                        setFeature(null);
                        setSelectedProvince(null);
                    }}
                />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {!feature && (
                    <GeoJSON
                        data={geoJsonData} // data indonesia lengkap
                        onEachFeature={onEachFeature}
                        style={() => ({
                            fillColor: 'rgba(100, 150, 240, 0.3)',
                            color: '#333',
                            weight: 1
                        })}
                    />
                )}

                {feature && (
                    <>
                        <GeoJSON
                            data={feature.feature} // data sumatera
                            onEachFeature={onEachFeature} // ⬅️ INI WAJIB!

                            style={() => ({
                                fillColor: 'rgba(240,100,100,0.5)',
                                color: '#900',
                                weight: 2
                            })}
                        />
                        <ZoomToFeature bounds={feature.bounds} />
                    </>
                )}
            </MapContainer>
            {!feature && (
                <div style={{ padding: '1rem', backgroundColor: 'white' }}>
                    <h2 style={{ color: '#DE5278' }}>Statistik Data SPPG Indonesia</h2>
                    <SimpleChart />

                </div>
            )}
            {feature && (
                <div style={{ padding: '1rem', background: '#fff' }}>
                    <h2 style={{ color: 'black' }}>DATA AREA <span style={{ color: 'red' }}>{selectedProvince}</span></h2>
                    {filteredData.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f3f4f6' }}>
                                    <th style={thStyle}>Nama SPG</th>
                                    <th style={thStyle}>Provinsi</th>
                                    <th style={thStyle}>Kabupaten/Kota</th>
                                    <th style={thStyle}>Kecamatan</th>
                                    <th style={thStyle}>Alamat</th>
                                    <th style={thStyle}>Nama Ka. SPG</th>
                                    <th style={thStyle}>Nama Yayasan</th>
                                    <th style={thStyle}>Status</th>
                                </tr>
                            </thead>
                            <tbody>

                                {paginatedData.map((item, i) => (
                                    <tr key={i}>
                                        <td style={tdStyle}>{item.nama_spg}</td>
                                        <td style={tdStyle}>{item.provinsi}</td>
                                        <td style={tdStyle}>{item.kabupaten_kota}</td>
                                        <td style={tdStyle}>{item.kecamatan}</td>
                                        <td style={tdStyle}>{item.alamat}</td>
                                        <td style={tdStyle}>{item.nama_spg}</td>
                                        <td style={tdStyle}>{item.nama_yayasan}</td>
                                        <td style={tdStyle}>{item.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>) : (<p style={{ color: 'black' }}>Tidak ada data untuk provinsi ini.</p>)}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            ⬅ Prev
                        </button>
                        <span style={{ color: 'black' }}>Halaman {currentPage} dari {Math.ceil(filteredData.length / itemsPerPage)}</span>
                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    prev < Math.ceil(filteredData.length / itemsPerPage) ? prev + 1 : prev
                                )
                            }
                            disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)}
                        >
                            Next ➡
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MapView
