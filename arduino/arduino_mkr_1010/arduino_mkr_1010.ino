/*
  This example connects to an WPA2 Enterprise WiFi network.
  Then it prints the  MAC address of the WiFi module,
  the IP address obtained, and other network details.

  Based on ConnectWithWPA.ino by dlf (Metodo2 srl) and Tom Igoe
*/
#include <SPI.h>
#include <WiFiNINA.h>

#include "arduino_secrets.h"
///////please enter your sensitive data in the Secret tab/arduino_secrets.h
char ssid[] = WIFI_SSID;  // your WPA2 enterprise network SSID (name)
char user[] = WIFI_USER;  // your WPA2 enterprise username
char pass[] = WIFI_PASS;  // your WPA2 enterprise password
int status = WL_IDLE_STATUS;     // the Wifi radio's status

// Initialize the Wifi client library
WiFiClient client;

// server address:
char server[] = "inf319.herokuapp.com";
//IPAddress server(64,131,82,241);

unsigned long lastConnectionTime = 0;            // last time you connected to the server, in milliseconds
const unsigned long postingInterval = 10L * 1000L; // delay between updates, in milliseconds

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ;
  }

  // attempt to connect to Wifi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to wifi: ");
    Serial.println(ssid);
    status = WiFi.begin(ssid, pass);
    delay(10000);
  }

  Serial.println("Successfully connected to wifi");
}

void loop() {
  while (client.available()) {
    char c = client.read();
    Serial.write(c);
    if (!client.available()) {
      Serial.println("Finished receiving http response");
    }
  }


  
  if (millis() - lastConnectionTime > postingInterval) {
    httpRequest();
  }
}

void httpRequest() {
  client.stop();
  if (client.connectSSL(server, 443)) {
    Serial.println("Sending http request");
    client.println("GET /health HTTP/1.1");
    client.println("Host: inf319.herokuapp.com");
    client.println("Connection: close");
    client.println();
    lastConnectionTime = millis();
  } else {
    Serial.println("Failed to connect to server");
  }
}
