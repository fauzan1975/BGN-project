import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl, Popup, useMapEvents, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import geoJsonData from './../../gejson/indonesia.json';
import MarkerClusterGroup from 'react-leaflet-cluster';
import SimpleChart from '../grafik/SimpleChart';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
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

function MapResetOnDoubleClick({ onReset }) {
    const map = useMapEvents({
        dblclick() {
            onReset();
            setTimeout(() => {
                map.flyTo([-2.27, 121.92], 5, { duration: 0.75 });
            }, 150);
        }
    });
    return null;
}

function MapView() {
    const [geoPoints, setGeoPoints] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [feature, setFeature] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [statusFilter, setStatusFilter] = useState('Semua');

    const itemsPerPage = 10;

    const statusKategori = {
        "Aktif": [
            "Penentuan KA SPPG",
            "Pembuatan VA",
            "BA Verval"
        ],
        "Non-Aktif": [
            "Ditolak",
            "Dibatalkan"
        ],
        "Pending": [
            "Verifikasi Pengajuan",
            "Draft",
            "Proses Persiapan",
            "Penentuan Petugas Survey",
            "Penentuan Kelayakan",
            "Survey Lapangan"
        ]
    };

    const provinceToIsland = {
        "ACEH": "sumatera", "SUMATERA UTARA": "sumatera", "SUMATERA BARAT": "sumatera",
        "RIAU": "sumatera", "KEPULAUAN RIAU": "sumatera", "JAMBI": "sumatera",
        "SUMATERA SELATAN": "sumatera", "BENGKULU": "sumatera", "LAMPUNG": "sumatera",
        "KEPULAUAN BANGKA BELITUNG": "sumatera",

        "JAKARTA RAYA": "jawa", "JAWA BARAT": "jawa", "JAWA TENGAH": "jawa",
        "JAWA TIMUR": "jawa", "BANTEN": "jawa",
        "YOGYAKARTA": "jawa",


        "KALIMANTAN BARAT": "kalimantan", "KALIMANTAN TENGAH": "kalimantan",
        "KALIMANTAN SELATAN": "kalimantan", "KALIMANTAN TIMUR": "kalimantan",
        "KALIMANTAN UTARA": "kalimantan",

        "SULAWESI UTARA": "sulawesi", "SULAWESI TENGAH": "sulawesi",
        "SULAWESI SELATAN": "sulawesi", "SULAWESI TENGGARA": "sulawesi",
        "SULAWESI BARAT": "sulawesi", "GORONTALO": "sulawesi",

        "NUSA TENGGARA BARAT": "ntb",
        "NUSA TENGGARA TIMUR": "ntt",

        "BALI": "bali",


        "MALUKU": "maluku", "MALUKU UTARA": "maluku",

        "PAPUA": "papua", "PAPUA BARAT": "papua", "PAPUA TENGAH": "papua",
        "PAPUA SELATAN": "papua", "PAPUA PEGUNUNGAN": "papua", "PAPUA BARAT DAYA": "papua"
    };

    const normalize = (str) => String(str || '').trim().toUpperCase()
        .replace('DAERAH ISTIMEWA ', '')
        .replace('DI. ', '')
        .replace('PROVINSI ', '')
        .replace('PROV. ', '')
        .replace(/\s+/g, ' ');

    const provAlias = {
        'SULBAR': 'SULAWESI BARAT',
        'SULSEL': 'SULAWESI SELATAN',
        'SULTRA': 'SULAWESI TENGGARA',
        'SULTENG': 'SULAWESI TENGAH',
        'DKI JAKARTA': 'JAKARTA RAYA'

    };

    const normalizeProvinsi = (prov) => {
        const clean = normalize(prov);
        return provAlias[clean] || clean;
    };


    // generate island GeoJSONs
    const islandGeoJson = {};
    Object.values(provinceToIsland).forEach(island => {
        islandGeoJson[island] = { type: 'FeatureCollection', features: [] };
    });


    geoJsonData.features.forEach((f) => {
        const prov = f.properties?.state?.toUpperCase();
        const island = provinceToIsland[prov];
        if (island) islandGeoJson[island].features.push(f);
    });

    const provName = selectedProvince?.trim().toUpperCase();
    const allData = geoPoints
        ? geoPoints.features.map(f => ({
            ...f.properties,
            latitude: f.geometry.coordinates[1],
            longitude: f.geometry.coordinates[0]
        }))
        : [];


    const filteredData = allData.filter(item => {

        const rawProv = String(item.provinsi || '').trim().toUpperCase();
        const itemProv = provAlias[rawProv] || rawProv;

        const normalizedProvinceName = provAlias[provName] || provName;

        const provMatch = itemProv === normalizedProvinceName;

        const statusMatch =
            statusFilter === 'Semua' ||
            (statusKategori[statusFilter] || []).includes((item.status || '').trim());

        return provMatch && statusMatch;

        // const provMatch = normalize(item.provinsi).includes(provName);
        // // const statusMatch =
        // //     statusFilter === 'Semua' || (item.status || '').toLowerCase() === statusFilter.toLowerCase();
        // const statusMatch =
        //     statusFilter === 'Semua' ||
        //     (statusKategori[statusFilter] || []).includes((item.status || '').trim())

        // return provMatch && statusMatch;
    });

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const onEachFeature = (feature, layer) => {
        console.log("🌍 GeoJSON province:", feature.properties?.state || feature.properties?.name);

        const provName = feature.properties?.state;
        const key = provName?.toUpperCase();
        const islandKey = provinceToIsland[key];
        if (!islandKey) return;

        const geo = islandGeoJson[islandKey];
        layer.bindTooltip(provName, { sticky: true });
        layer.on('click', () => {

            const bounds = L.geoJSON(geo).getBounds();

            setSelectedProvince(provName);
            setFeature({ feature: geo, bounds });
        });
    };

    useEffect(() => {
        fetch('http://localhost:5050/api/geojson')
            .then(res => res.json())
            .then(setGeoPoints)
            .catch(err => console.error('❌ GeoJSON fetch failed:', err));
    }, []);

    const thStyle = { fontSize: '10px', padding: 8, textAlign: 'center', borderBottom: '1px solid #ccc' };
    const tdStyle = { fontSize: '10px', padding: 8, borderBottom: '1px solid #eee' };

    return (
        <div>
            <MapContainer
                center={[-2.27, 121.92]}
                zoom={5}
                style={{ width: '100%', height: '75vh' }}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                touchZoom={false}
                zoomControl={false}  // ✅ WAJIB ADA

                key={feature ? 'zoomed' : 'default'}
            >
                <ZoomControl position="bottomright" />

                <MapResetOnDoubleClick onReset={() => {
                    setFeature(null);
                    setSelectedProvince(null);
                }} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='<a>Sistem Monitoring Dapur BGN</a> ©2025'
                />

                {!feature && (
                    <GeoJSON
                        data={geoJsonData}
                        onEachFeature={onEachFeature}
                        style={() => ({ fillColor: 'rgba(100, 150, 240, 0.3)', color: '#333', weight: 1 })}
                    />
                )}

                {feature && (
                    <>
                        <GeoJSON
                            data={feature.feature}
                            onEachFeature={onEachFeature}
                            style={() => ({ fillColor: 'rgba(240,100,100,0.5)', color: '#900', weight: 2 })}
                        />
                        <ZoomToFeature bounds={feature.bounds} />
                    </>
                )}

                {/* {geoPoints && (
                    <MarkerClusterGroup>
                        {geoPoints.features.map((f, i) => {
                            const lat = f.geometry.coordinates[1];
                            const lon = f.geometry.coordinates[0];
                            const p = f.properties;
                            return (
                                <Marker key={i} position={[lat, lon]}>
                                    <Popup>
                                        <strong>{p.nama_yayasan}</strong><br />
                                        {p.provinsi}, {p.kabupaten_kota}<br />
                                        {p.kecamatan}<br />
                                        {p.alamat}
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MarkerClusterGroup>
                )} */}
            </MapContainer>

            {!feature && (
                <div style={{ padding: '1rem', backgroundColor: 'white' }}>
                    <h2 style={{ color: '#DE5278' }}>Statistik Data SPPG Indonesia</h2>
                    <SimpleChart />
                </div>
            )}

            {feature && (
                <div style={{ padding: '1rem', background: '#fff' }}>
                    <h2 style={{ color: 'black' }}>
                        DATA AREA <span style={{ color: 'red' }}>{selectedProvince}</span>
                    </h2>
                    <div style={{ marginBottom: '1rem' }}>
                        {['Semua', 'Aktif', 'Non-Aktif', 'Pending'].map(status => (
                            <button
                                key={status}
                                onClick={() => {
                                    setCurrentPage(1);
                                    setStatusFilter(status);
                                }}
                                style={{
                                    marginRight: '8px',
                                    padding: '6px 12px',
                                    backgroundColor: statusFilter === status ? '#06b6d4' : '#eee',
                                    color: statusFilter === status ? 'white' : 'black',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    fontSize: '12px'
                                }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    {filteredData.length > 0 ? (

                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'black' }}>
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
                                        <td style={tdStyle}>
                                            {statusKategori["Aktif"].includes((item.status || '').trim()) ? (
                                                <span style={{ color: 'green', fontWeight: 'bold' }}>Aktif</span>
                                            ) : statusKategori["Non-Aktif"].includes((item.status || '').trim()) ? (
                                                <span style={{ color: 'gray' }}>Non-Aktif</span>
                                            ) : statusKategori["Pending"].includes((item.status || '').trim()) ? (
                                                <span style={{ color: 'orange' }}>Pending</span>
                                            ) : (
                                                <span style={{ color: 'black' }}>-</span>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ color: 'black' }}>Tidak ada data untuk provinsi ini.</p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>⬅ Prev</button>
                        <span style={{ color: 'black' }}>Halaman {currentPage} dari {Math.ceil(filteredData.length / itemsPerPage)}</span>
                        <button
                            onClick={() => setCurrentPage(p => (p < Math.ceil(filteredData.length / itemsPerPage) ? p + 1 : p))}
                            disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)}
                        >Next ➡</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MapView;
