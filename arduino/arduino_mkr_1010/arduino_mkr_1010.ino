#include <SPI.h>
#include <WiFiNINA.h>
#include "config.h"

// Constants
const int MOIST_IN = A1;
const int MOIST_SWITCH = 1;
const int KEEP_ALIVE_SWITCH = 2;

// Global
int status = WL_IDLE_STATUS;
WiFiClient client;

void setup() {
  // Init serial connection
  Serial.begin(9600);
  delay(2000);

  // Setup output pins
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(MOIST_SWITCH, OUTPUT);
  pinMode(KEEP_ALIVE_SWITCH, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);
  digitalWrite(MOIST_SWITCH, LOW);
  digitalWrite(KEEP_ALIVE_SWITCH, LOW);

  // Connect to WiFi
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to wifi: ");
    Serial.println(WIFI_SSID);
    status = WiFi.begin(WIFI_SSID, WIFI_PASS);
  }
  Serial.println("Successfully connected to wifi");
}

void loop() {
  // Measure the moist
  keepAlive();
  int moist = meassureMoist();
  keepAlive();
  Serial.print("Measured moist: ");
  Serial.println(moist);
  sendMoistureData(moist);

  // Sleep for 60 minutes ish and keep the power bank alive
  for (int i = 0; i < 120; i++) {
    keepAlive();
    delay(30000);
  }
}

void sendMoistureData(int moisture) {
  String postData = "{\"data\": " + String(moisture) + ", \"type\":\"moisture\", \"plant\": " + String(PLANT_ID) + "}";
  client.stop();
  if (client.connectSSL(API_HOST, 443)) {
    Serial.println("Sending http request with moisture data");
    client.println("POST /data HTTP/1.1");
    client.print("Host: ");
    client.println(API_HOST);
    client.print("Authorization: ");
    client.println(API_KEY);
    client.print("Content-Length: ");
    client.println(postData.length());
    client.println();
    client.println(postData);
    client.println();
  } else {
    Serial.println("Failed to connect to server");
  }
}

int meassureMoist() {
  digitalWrite(MOIST_SWITCH, HIGH);
  // Wait for sensor to stabalize??
  delay(5000);
  int samples = 300;
  int total = 0;
  for (int i = 0; i < samples; i++) {
    int current = analogRead(MOIST_IN);
    total += current;
    Serial.println(current);
    delay(50);
  }
  int average = total / samples;
  digitalWrite(MOIST_SWITCH, LOW);
  return average;
}

void keepAlive() {
  digitalWrite(KEEP_ALIVE_SWITCH, HIGH);
  delay(500);
  digitalWrite(KEEP_ALIVE_SWITCH, LOW);
}
