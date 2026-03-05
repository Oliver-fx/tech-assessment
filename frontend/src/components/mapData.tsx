interface fullData {
    sensorName: string;
    sensorUnit: string;
    sensorId: number;
    value: number | string;
}


export function MapData({sensorName, sensorUnit, sensorId, value}: fullData) {
    return (
        <h1>{sensorName} <p className="font-mono">{value} {sensorUnit}</p> </h1>
    )


}