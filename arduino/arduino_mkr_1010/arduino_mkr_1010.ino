#include <SPI.h>
#include <WiFiNINA.h>
#include "config.h"

int status = WL_IDLE_STATUS;
WiFiClient client;

void setup() {
  Serial.begin(9600);
  while (!Serial) { ; }
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to wifi: ");
    Serial.println(WIFI_SSID);
    status = WiFi.begin(WIFI_SSID, WIFI_PASS);
    delay(10000);
  }
  Serial.println("Successfully connected to wifi");
}

void loop() {
  int moist = analogRead(A1);
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
  }
}

void sleep() {
  
}
