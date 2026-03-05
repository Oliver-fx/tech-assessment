import { CheckRange } from "./backendFunc";

function containsLetter(string: string): boolean {
    return /[a-zA-Z]/.test(string);
}

function combineData(sensorId: number, sensorName: string, timestamp: number): CheckRange {
    const newArr: number[] = [];
    newArr.push(timestamp);
    let newObj: CheckRange = {
        sensorId: sensorId,
        sensorName: sensorName,
        timestamp: newArr
    }

    return newObj;
}

function check(obj: CheckRange): void {
    if (obj.timestamp.length === 3) {
        if (obj.timestamp[2] - obj.timestamp[0] <= 5) {
            console.log(`Time: ${obj.timestamp[2]}, ERROR: ${obj.sensorName} sends value out of range`)
        }

        obj.timestamp.splice(0, 1);
    }
}

export { containsLetter, combineData, check };