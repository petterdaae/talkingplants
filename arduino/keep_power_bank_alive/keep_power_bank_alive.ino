void setup() {
  pinMode(7, OUTPUT);
}

void loop() {
  for (int i = 0; i < 40; i++) {
    keepAlive();
    delay(30000);
  }
  NVIC_SystemReset();
}

void keepAlive() {
  digitalWrite(7, HIGH);
  delay(500);
  digitalWrite(7, LOW);
}
