#include <ArduinoLowPower.h>

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  startSerial();
  
  digitalWrite(LED_BUILTIN, HIGH);
  Serial.println("Waking up");
  int val = analogRead(ADC_BATTERY);
  Serial.print("Li-Po:");
  Serial.println(val);
  Serial.println("Going to sleep again in 15 seconds");
  delay(15000);
  digitalWrite(LED_BUILTIN, LOW);

  endSerial();
  Serial.println("Sleeping for 5 seconds");
  delay(500);
  LowPower.deepSleep(5000);
}


void startSerial() {
  Serial.begin(9600);
  delay(2000);
}

void endSerial() {
  Serial.flush();
  Serial.end();
}
