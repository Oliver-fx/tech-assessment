import { Server } from 'http';
import fetch from 'node-fetch'
import { WebSocketServer } from 'ws';


export interface MetaData {
    sensorId: number;
    sensorName: string;
    unit: string;
}

export interface LiveData {
    sensorId: number;
    value: number;
    timestamp: number;
}

export interface CheckRange {
    sensorId: number;
    sensorName: string;
    timestamp: number[];
}

async function fetchData(emuUrl: string): Promise< MetaData[] | undefined > {
    let metaData: MetaData[];
    try {
        const response = await fetch(emuUrl + '/sensors');

        if (response.ok == false) {
            throw new Error("failed to fetch");
        } 
        
        metaData = await response.json() as MetaData[];

        return metaData;
    } catch (error) {
        console.error("ERROR in getData", error);
    }
}



export { fetchData };