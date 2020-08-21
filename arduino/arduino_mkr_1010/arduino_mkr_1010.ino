#include <SPI.h>
#include <WiFiNINA.h>
#include "arduino_secrets.h"

char ssid[] = WIFI_SSID;
char pass[] = WIFI_PASS;
int status = WL_IDLE_STATUS;
WiFiClient client;
char server[] = "inf319.herokuapp.com";
unsigned long lastConnectionTime = 0;
const unsigned long postingInterval = 10L * 1000L;

void setup() {
  Serial.begin(9600);
  while (!Serial) { ; }
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to wifi: ");
    Serial.println(ssid);
    status = WiFi.begin(ssid, pass);
    delay(10000);
  }
  Serial.println("Successfully connected to wifi");
}

void loop() {
  int moist = analogRead(A1);
  Serial.print("Measured moist: ");
  Serial.println(moist);
  sendMoistureData(moist);
  delay(10000);
}

void sendMoistureData(int moisture) {
  String postData = "{\"data\": " + String(moisture) + ", \"type\":\"moisture\", \"plant\": 10}";
  client.stop();
  if (client.connectSSL(server, 443)) {
    Serial.println("Sending http request with moisture data");
    client.println("POST /data HTTP/1.1");
    client.println("Host: inf319.herokuapp.com");
    client.print("Authorization: ");
    client.println(API_KEY);
    client.print("Content-Length: ");
    client.println(postData.length());
    client.println();
    client.println(postData);
    client.println();
    lastConnectionTime = millis();
  } else {
    Serial.println("Failed to connect to server");
  }
}
