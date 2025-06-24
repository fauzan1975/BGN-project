import { useState } from 'react'
import Navbar from './assets/components/Navbar'
import 'leaflet/dist/leaflet.css';
import MapView from './assets/components/peta/MapView'


import './App.css'

function App() {

  return (
    <div style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, marginTop: '64px' }}> {/* 64px = tinggi Navbar */}
        <MapView />


      </div>

    </div>
  );
}


export default App


