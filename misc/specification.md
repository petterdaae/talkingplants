# Specification
The goal for this project is to make my phone notify me when my plants need water.

My plan to make this happen:
- Arduino with moisture sensor and wifi
- REST api that receives measures from the arduino and triggers notifications on my phone
- Android app that receives notifications


### Step 0 - 2 weeks
- Test different moisture sensors
- Write Arduino code that makes a light blink when the moisture is beneath some value


### Step 1 - 5 weeks
- Make a REST api and a web app that vizualizes moisture data
- Write Arduino code that logs sensor values (to a database through the REST api)


### Step 2 - 4 weeks
- Try to determine when different plants need water using the vizualisations from Step 1
- Maybe add more sensors (light, temperature, etc...)


### Step 3 - 3 weeks
- Build Android app that can receive notifications


### Step 4 - If I have more time left
- Try to make the arduino and sensors look nice


### Technologies
- Arduino
- REST api in Rust (node if I spend to much time)
- Web app in React
- Native Android app (flutter if I spend to much time)
