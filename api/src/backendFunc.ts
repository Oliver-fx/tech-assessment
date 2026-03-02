import { response } from 'express';
import fetch from 'node-fetch'
import { Interface } from 'readline'

interface MetaData {
    sensorId: string;
    sensorName: string;
    unit: string;
}

async function getData(emuUrl: string): Promise< MetaData | undefined > {
    let metaData: MetaData;
    try {
        const response = await fetch(emuUrl + '/sensors');

        if (response.ok == false) {
            throw new Error("failed to fetch");
        } 
        
        metaData = await response.json() as MetaData;

        return metaData;
    } catch (error) {
        console.log("ERROR in getData", error);
    }
}
