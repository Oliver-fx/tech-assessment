# Vehicle Analytics Fullstack Assessment – Justification

## API

Use this file to briefly explain your design decisions. Bullet points are fine.

### 1. Overall API design

- Summary of your API structure and main routes (paths, methods, and what they return):
    1. 
        Path: /metadata
        Method: GET
        Description: get all sensors metadata, including sensorId, sensorName, and unit
        Returns: array of object [{sensorId: number, sensorName: string, Unit: string}, ...]
    2. 
        Path: /livedata
        Method: WebSocket 
        Description: stream all sensor data continuously
        Returns: object {sensorId: number, value: number, timestamp: number}


### 2. Data vs metadata separation

- How clients should use your metadata route(s) vs your data route(s) (and streaming, if implemented):
    The clients should call metadata route to get all information about the sensor. Next they
    should connect to websocket server to get the streaming data. Then, they need to map these two data to show it on the webpage.

### 3. Emulator (read-only)

- Confirm you did not modify the emulator service (`emulator/`) or its `sensor-config.json`. If you needed to work around anything, note it here: y/N
Yes, I didn't modify any emulator service.

### 4. OpenAPI / Swagger

- Where your final OpenAPI spec lives and how to view or use it (e.g. Swagger UI):
I put my get method api into the /openapi.yaml file, and I created a new async.api file and i put my webstream api into async.api file
### 5. Testing and error handling

- What you chose to test and any notable error-handling decisions:
Due to the time manner, I didn't implement any test for my api. However, I have done some
checks by my self, and I created some error-handling for api. I used try catch and async to 
implement my get method api, which can pause the server if get is not working. For websocket sending, I made a error check to make sure it shows error when sending data is not working.

### 6. Invalid data from the emulator (Task 2)

- How you detect invalid readings from the emulator stream:
I detect the type of properties in the object to know wether this is a valid or invalid string. If it meant to be a number, but it is a string, the program checks the string contain any letter. If it contains letter i droped it and switch the previous data to current data. If no, the program recovers the string into a number.

- What you do with invalid data (drop, log, count, etc.) and why:
 If it is recoverable the program recovers the value to the correct form, if it is unrecoverable the
 program drops it and use previous data as teh current data.
### 7. Out-of-range values per sensor (Task 3)

- How you use the valid-range table (sensor name or sensorId → min/max) and count out-of-range readings per sensor in a 5-second window:
I will check every current data when i recieve it. If it is out of range, I store it in to an array of object which has field sensorName, sensorId, errorTimestamp array. After, I store error timestamp into an array, I wait until the array length is equal to 3, then calculate the  difference between last element and first element, if it is smaller or equal to 5 I will log an error and show the timestamp. If no I will delete the first element, then do the same process when next error timestamp is pushed into the array.

- How you log the timestamp and error message (including sensor) when a sensor exceeds the threshold (&gt;3 out-of-range in 5 s):
The logging is in my checking function, if the array length is equal to 3, the  difference between last element and first element is less than and equal to 5, it will log the current timestamp and show the sensor name with an error message.

## Frontend

Use this section to briefly explain your frontend design decisions. Bullet points are fine.
For engineers, the key information is driver's behaviour data and car's condition data.
I grouped data that relate to driving data together to make engineer easier to analyze. For, other
engineers who needs the car condition data I put them on the side in a clear grid layout. This arrangement helps them to find the data easily.

### 1. Figma mockup

- Link to your low-fidelity Figma mockup and what it shows:
    https://www.figma.com/design/YRIzjVmyV68haxh8oeTHA9/frontend-design?node-id=0-1&t=hhrBRTZigovwivE3-1
### 2. Layout and information hierarchy

- Why you structured the dashboard the way you did:

### 3. API consumption

- How you use `/sensors` and `/telemetry` (and WebSocket, if used):
I use my api which are /metadata and /livedata. I copy the metadata and then put them into the usestate list so that I can use them  on the webpage. Then, I created an usestate object that stores all previous data and current data into the object,which can always keep old sensor data show on the screen when the livedata is not streaming that sensor. And, then use map function to combine them and display on the webpage.
### 4. Visual design and usability

- Choices around colours, typography, states, and responsiveness:
Due to the time constraints, I can't adjust my ui properly, it is just a prototype.

### 5. Trade-offs and limitations

- Anything you would do with more time or a different stack:
I might add a object or list that stores all the pervious data.
I will change the font of the ui and highlight number.
I will write some tests to make sure my function works properly.
I might put some indicator on the page to show the data clearly.