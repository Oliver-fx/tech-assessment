import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface fullData {
    sensorName: string;
    sensorUnit: string;
    sensorId: number;
    value: number | string;
}


export function MapData({sensorName, sensorUnit, sensorId, value}: fullData) {
    return (
        <Card className=" w_full text-center">
            <CardHeader className="pb-0 text-xs">
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