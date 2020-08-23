/*
 * Status codes:
 * - 5 blinks     : Start of loop
 * - Stable light : Measuring moist
 * - 3 blinks     : Failed to connect to server
 * - 2 blinks     : Starting
 */

#include <SPI.h>
#include <WiFiNINA.h>
#include "config.h"

int status = WL_IDLE_STATUS;
WiFiClient client;

void setup() {
  Serial.begin(9600);
  // while (!Serial) { ; }
  delay(3000);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);
  blinkN(2);
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to wifi: ");
    Serial.println(WIFI_SSID);
    status = WiFi.begin(WIFI_SSID, WIFI_PASS);
    delay(10000);
  }
  Serial.println("Successfully connected to wifi");
}

void loop() {
  blinkN(5);
  int moist = meassureMoist();
  Serial.print("Measured moist: ");
  Serial.println(moist);
  sendMoistureData(moist);
  delay(600000);
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
    blinkN(3);
  }
}

int meassureMoist() {
  digitalWrite(LED_BUILTIN, HIGH);
  int samples = 10;
  int total = 0;
  for (int i = 0; i < samples; i++) {
    total += analogRead(A1);
    delay(2000);
  }
  int average = total / samples;
  digitalWrite(LED_BUILTIN, LOW);
  return average;
}

void blinkN(int n) {
  digitalWrite(LED_BUILTIN, LOW);
  delay(2000);
  for (int i = 0; i < n; i++) {
    digitalWrite(LED_BUILTIN, HIGH);
    delay(500);
    digitalWrite(LED_BUILTIN, LOW);
    delay(500);
  }
}
