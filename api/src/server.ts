import http from 'http';
import express, {Request, Response} from 'express';
import cors from 'cors';
import { CheckRange, fetchData, LiveData } from './backendFunc';
import WebSocket, { WebSocketServer } from 'ws';
import { MetaData } from './backendFunc';
import { check, combineData, containsLetter } from './helper';

const app = express();
app.use(cors({ origin: true, credentials: false }));
app.use(express.json());

// Default to local emulator when EMULATOR_URL is not provided.
const EMULATOR_URL = process.env.EMULATOR_URL || 'http://localhost:3001';

let store: MetaData[] = [];

async function initData() {
  try {
    const data: MetaData[] | undefined = await fetchData(EMULATOR_URL);

    if (data) {
      store = data;
    }
  } catch (error) {
    console.log("failed to get init value")
  }
}

initData();

//console.log(store);

app.get('/health', async (_req, res) => {
  try {
    const r = await fetch(`${EMULATOR_URL.replace(/\/$/, '')}/sensors`);
    if (r.ok) {
      return res.json({ status: 'ok', emulator: true });
    }
  } catch {
    // connection failed
  }
  res.status(503).json({ status: 'unhealthy', emulator: false });
});

// ---------------------------------------------------------------------------
// Assessment: implement the API below.
// The emulator is a black box: it only outputs data. Its base URL is EMULATOR_URL
// (e.g. http://emulator:3001 with Docker, or http://localhost:3001 locally).
// Emulator exposes only:
//   GET {EMULATOR_URL}/sensors   → static metadata (sensorId, sensorName, unit)
//   WS  {EMULATOR_URL}/ws/telemetry → stream of readings { sensorId, value, timestamp }
// The emulator does not store or serve "latest" readings. You must:
// - Connect to the emulator WebSocket stream.
// - Store the latest value per sensor in the API as readings arrive.
// - Expose your own metadata and "latest telemetry" routes to clients.
// Do not modify the emulator service.
// ---------------------------------------------------------------------------

const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(Number(PORT), HOST, () => {
  console.log(`API server listening on http://${HOST}:${PORT}`);
});


app.get('/metadata', async (req: Request, res: Response) => {
  res.json(store);
});


// create ws client to recieve message
const wsRecv = new WebSocket('ws://localhost:3001/ws/telemetry');
// create a server side to send the data
const wsServer = new WebSocketServer({server , path: "/livedata" });

let checkRange: CheckRange[] = [];
let liveData: LiveData;
let prevData: LiveData = {
  sensorId: -1,
  value: -1,
  timestamp: -1
};

wsRecv.on("message", (data) => {

  liveData = JSON.parse(data.toString());
  //console.log(liveData.sensorId);

  // check wrong sensorId
  if (typeof(liveData.sensorId) === "string") {
    if (containsLetter(liveData.sensorId) == true) {
      // drop
      liveData = prevData;
    } else {
      // recover
      liveData.sensorId = Number(liveData.sensorId);
    }
  }
  // check wrong value
  if (typeof(liveData.value) === "string") {
    if (containsLetter(liveData.value) == true) {
      //drop
      liveData = prevData;
    } else {
      //recover
      liveData.value = Number(liveData.value);
    }
  }

  if (liveData.sensorId == undefined) {
    console.log("error: sensorId is missed");
    liveData = prevData
    console.log("data droped successfully, sensorId: " + liveData.sensorId);
  }
  //console.log("recieve");

  // data out of range
  const foundObj: MetaData | undefined = store.find(id => id.sensorId === liveData.sensorId);
  //console.log(foundObj?.sensorName);
  switch(foundObj?.sensorName) {
    case 'BATTERY_TEMPERATURE':
      if (liveData.value < 20 || liveData.value > 80) {
        // check are they already in checkrange
        const obj: CheckRange | undefined = checkRange.find(name => name.sensorName === foundObj.sensorName);
        
        if (obj) {
          // store into checkRange
          obj.timestamp.push(liveData.timestamp);
          // check 3 times in 5s
          check(obj);

        } else {
          // create new obj for it and store
          const newObj: CheckRange = combineData(foundObj.sensorId, foundObj.sensorName, liveData.timestamp);
          checkRange.push(newObj);
        }
        
      }
      break;
    case 'MOTOR_TEMPERATURE':
      if (liveData.value < 30 || liveData.value > 120) {
        const obj: CheckRange | undefined = checkRange.find(name => name.sensorName === foundObj.sensorName);
        
        if (obj) {
          // store into checkRange
          obj.timestamp.push(liveData.timestamp);
          // check 3 times in 5s
          check(obj);

        } else {
          // create new obj for it and store
          const newObj: CheckRange = combineData(foundObj.sensorId, foundObj.sensorName, liveData.timestamp);
          checkRange.push(newObj);
        }
      }
      break;
    case 'TYRE_PRESSURE_FL':
      if (liveData.value < 150 || liveData.value > 250) {
        //console.log(liveData.value);
        const obj: CheckRange | undefined = checkRange.find(name => name.sensorName === foundObj.sensorName);
        
        if (obj) {
          // store into checkRange
          obj.timestamp.push(liveData.timestamp);
          // check 3 times in 5s
          check(obj);

        } else {
          // create new obj for it and store
          const newObj: CheckRange = combineData(foundObj.sensorId, foundObj.sensorName, liveData.timestamp);
          checkRange.push(newObj);
        }
      }
      break;
    case 'TYRE_PRESSURE_FR':
      if (liveData.value < 150 || liveData.value > 250) {
        const obj: CheckRange | undefined = checkRange.find(name => name.sensorName === foundObj.sensorName);
        
        if (obj) {
          // store into checkRange
          obj.timestamp.push(liveData.timestamp);
          // check 3 times in 5s
          check(obj);

        } else {
          // create new obj for it and store
          const newObj: CheckRange = combineData(foundObj.sensorId, foundObj.sensorName, liveData.timestamp);
          checkRange.push(newObj);
        }
      }
      break;
    case 'TYRE_PRESSURE_RL':
      if (liveData.value < 150 || liveData.value > 250) {
        const obj: CheckRange | undefined = checkRange.find(name => name.sensorName === foundObj.sensorName);
        
        if (obj) {
          // store into checkRange
          obj.timestamp.push(liveData.timestamp);
          // check 3 times in 5s
          check(obj);

        } else {
          // create new obj for it and store
          const newObj: CheckRange = combineData(foundObj.sensorId, foundObj.sensorName, liveData.timestamp);
          checkRange.push(newObj);
        }
      }
      break;
    case 'TYRE_PRESSURE_RR':
      if (liveData.value < 150 || liveData.value > 250) {
        const obj: CheckRange | undefined = checkRange.find(name => name.sensorName === foundObj.sensorName);
        
        if (obj) {
          // store into checkRange
          obj.timestamp.push(liveData.timestamp);
          // check 3 times in 5s
          check(obj);

        } else {
          // create new obj for it and store
          const newObj: CheckRange = combineData(foundObj.sensorId, foundObj.sensorName, liveData.timestamp);
          checkRange.push(newObj);
        }
      }
      break;
    case 'PACK_CURRENT':
      if (liveData.value < -300 || liveData.value > 300) {
        const obj: CheckRange | undefined = checkRange.find(name => name.sensorName === foundObj.sensorName);
        
        if (obj) {
          // store into checkRange
          obj.timestamp.push(liveData.timestamp);
          // check 3 times in 5s
          check(obj);

        } else {
          // create new obj for it and store
          const newObj: CheckRange = combineData(foundObj.sensorId, foundObj.sensorName, liveData.timestamp);
          checkRange.push(newObj);
        }
      }
      break;
    case 'PACK_VOLTAGE':
      if (liveData.value < 350 || liveData.value > 500) {
        const obj: CheckRange | undefined = checkRange.find(name => name.sensorName === foundObj.sensorName);
        //console.log(liveData.value, "timestamp:" + liveData.timestamp);
        if (obj) {
          // store into checkRange
          obj.timestamp.push(liveData.timestamp);
          // check 3 times in 5s
          check(obj);
          //console.log(obj.timestamp);
        } else {
          // create new obj for it and store
          const newObj: CheckRange = combineData(foundObj.sensorId, foundObj.sensorName, liveData.timestamp);
          checkRange.push(newObj);
        }
      }
      break;
    case 'PACK_SOC':
      if (liveData.value < 0 || liveData.value > 100) {
        const obj: CheckRange | undefined = checkRange.find(name => name.sensorName === foundObj.sensorName);
        
        if (obj) {
          // store into checkRange
          obj.timestamp.push(liveData.timestamp);
          // check 3 times in 5s
          check(obj);

        } else {
          // create new obj for it and store
          const newObj: CheckRange = combineData(foundObj.sensorId, foundObj.sensorName, liveData.timestamp);
          checkRange.push(newObj);
        }
      }
      break;
    case 'VEHICLE_SPEED':
      if (liveData.value < 0 || liveData.value > 250) {
        const obj: CheckRange | undefined = checkRange.find(name => name.sensorName === foundObj.sensorName);
        
        if (obj) {
          // store into checkRange
          obj.timestamp.push(liveData.timestamp);
          // check 3 times in 5s
          check(obj);

        } else {
          // create new obj for it and store
          const newObj: CheckRange = combineData(foundObj.sensorId, foundObj.sensorName, liveData.timestamp);
          checkRange.push(newObj);
        }
      }
      break;
    case 'STEERING_ANGLE':
      if (liveData.value < -180 || liveData.value > 180) {
        const obj: CheckRange | undefined = checkRange.find(name => name.sensorName === foundObj.sensorName);
        
        if (obj) {
          // store into checkRange
          obj.timestamp.push(liveData.timestamp);
          // check 3 times in 5s
          check(obj);

        } else {
          // create new obj for it and store
          const newObj: CheckRange = combineData(foundObj.sensorId, foundObj.sensorName, liveData.timestamp);
          checkRange.push(newObj);
        }
      }
      break;
    case 'BRAKE_PRESSURE_FRONT':
      if (liveData.value < 0 || liveData.value > 120) {
        const obj: CheckRange | undefined = checkRange.find(name => name.sensorName === foundObj.sensorName);
        //console.log(liveData.value);
        if (obj) {
          // store into checkRange
          obj.timestamp.push(liveData.timestamp);
          // check 3 times in 5s
          check(obj);

        } else {
          // create new obj for it and store
          const newObj: CheckRange = combineData(foundObj.sensorId, foundObj.sensorName, liveData.timestamp);
          checkRange.push(newObj);
        }
      }
      break;
  }


  // set prevData for the next event
  prevData = liveData;

  wsServer.clients.forEach((client) => {
    if (client.readyState == WebSocket.OPEN) {
      client.send(JSON.stringify(liveData), (error) => {
        if (error) {
          console.error("error on sending data")
        } else {
          //console.log("sent successfully" + liveData.timestamp);
        }
      });
    }
  })
})






