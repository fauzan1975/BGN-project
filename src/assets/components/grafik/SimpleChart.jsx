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

const data = [
    {
        "name": "Aceh",
        "uv": 916
    },
    {
        "name": "Bali",
        "uv": 480
    },
    {
        "name": "Banten",
        "uv": 2648
    },
    {
        "name": "Bengkulu",
        "uv": 725
    },
    {
        "name": "Daerah Istimewa Yogyakarta",
        "uv": 2190
    },
    {
        "name": "Dki Jakarta",
        "uv": 2009
    },
    {
        "name": "Gorontalo",
        "uv": 456
    },
    {
        "name": "Jambi",
        "uv": 1539
    },
    {
        "name": "Jawa Barat",
        "uv": 34880
    },
    {
        "name": "Jawa Tengah",
        "uv": 25388
    },
    {
        "name": "Jawa Timur",
        "uv": 29424
    },
    {
        "name": "Kalimantan Barat",
        "uv": 2860
    },
    {
        "name": "Kalimantan Selatan",
        "uv": 3948
    },
    {
        "name": "Kalimantan Tengah",
        "uv": 1350
    },
    {
        "name": "Kalimantan Timur",
        "uv": 2640
    },
    {
        "name": "Kalimantan Utara",
        "uv": 663
    },
    {
        "name": "Kepulauan Bangka Belitung",
        "uv": 1044
    },
    {
        "name": "Kepulauan Riau",
        "uv": 2261
    },
    {
        "name": "Lampung",
        "uv": 13400
    },
    {
        "name": "Maluku",
        "uv": 1890
    },
    {
        "name": "Maluku Utara",
        "uv": 1056
    },
    {
        "name": "Nusa Tenggara Barat",
        "uv": 11201
    },
    {
        "name": "Nusa Tenggara Timur",
        "uv": 5304
    },
    {
        "name": "Papua",
        "uv": 3450
    },
    {
        "name": "Papua Barat",
        "uv": 1222
    },
    {
        "name": "Papua Barat Daya",
        "uv": 1620
    },
    {
        "name": "Papua Pegunungan",
        "uv": 140
    },
    {
        "name": "Papua Selatan",
        "uv": 435
    },
    {
        "name": "Papua Tengah",
        "uv": 1800
    },
    {
        "name": "Riau",
        "uv": 7905
    },
    {
        "name": "Sulawesi Barat",
        "uv": 2976
    },
    {
        "name": "Sulawesi Selatan",
        "uv": 32208
    },
    {
        "name": "Sulawesi Tengah",
        "uv": 9078
    },
    {
        "name": "Sulawesi Tenggara",
        "uv": 8330
    },
    {
        "name": "Sulawesi Utara",
        "uv": 5688
    },
    {
        "name": "Sumatera Barat",
        "uv": 9509
    },
    {
        "name": "Sumatera Selatan",
        "uv": 22952
    },
    {
        "name": "Sumatera Utara",
        "uv": 28275
    }
];

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
    return (
        <div style={{ overflowX: 'auto' }}>
            <div style={{ width: '2000px', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
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
