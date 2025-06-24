import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer

} from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';


const CustomLegend = () => {
    return (
        <div style={{ color: '#DE5278', fontWeight: 'bold' }}></div>
    );
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: 'white', border: '1px solid #ccc', color: 'black', padding: '5px' }}>
                <p>{`${payload[0].payload.name}`}</p>
                <p>{`SPPG: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

function SimpleChart() {

    const [statistikData, setStatistikData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5050/api/statistik')
            .then((res) => {
                setStatistikData(res.data); // <-- simpan ke state
                setLoading(false);
            })
            .catch((err) => {
                console.error('❌ Error ambil data statistik:', err);
                setError('Gagal memuat data');
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ overflowX: 'auto' }}>
            <div style={{ width: '2000px', height: 300 }}>

                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statistikData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />

                        <Bar dataKey="uv" fill="#DE5278" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

    );
}

export default SimpleChart;
