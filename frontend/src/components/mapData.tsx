import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface fullData {
    sensorName: string;
    sensorUnit: string;
    sensorId: number;
    value: number | string;
}


export function MapData({sensorName, sensorUnit, sensorId, value}: fullData) {
    return (
        <Card>
            <CardHeader className="pb-0">
                <CardTitle>{sensorName}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="font-mono mt-1">
                    {value}{sensorUnit}
                </p>
            </CardContent>
        </Card>

    )


}