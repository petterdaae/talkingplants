const int RESET_SWITCH = 10;

void setup() {
  
  Serial.begin(9600);
  delay(2000);
  Serial.println("Starting ...");
  
}

int a = 0;

void loop() {
  Serial.println("Looping ...");
  a++;
  if (a > 6) {
    Serial.println("Resetting ...");
    a = 0;
    digitalWrite(RESET_SWITCH, HIGH);
    pinMode(RESET_SWITCH, OUTPUT);
    digitalWrite(RESET_SWITCH, LOW);
  }
  delay(1000);
}
