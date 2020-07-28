const int MOIST_IN = A0;
const int MOIST_SWITCH = 5;

const int L1 = 2;
const int L2 = 7;
const int L3 = 10;
const int L4 = 13;

const int ALL_PINS[] = { MOIST_SWITCH, L1, L2, L3, L4 };

void setup() {
  Serial.begin(9600); 
  delay(2000);
  Serial.println("Starting ...");
  
  for (int i = 0; i < 5; i++) {
    pinMode(ALL_PINS[i], OUTPUT);
    digitalWrite(ALL_PINS[i], LOW);
  }

  for (int i = 0; i < 5; i++) {
    int current = ALL_PINS[i];
    Serial.print("Testing pin: ");
    Serial.print(current);
    Serial.print("\n");
    digitalWrite(current, HIGH);
    delay(1000);
    digitalWrite(current, LOW);
  }
}

void loop() {
  int moist = readMoist();
  Serial.print("Moist: ");
  Serial.print(moist);
  Serial.print("\n");
  delay(2000);
}

int readMoist() {
  digitalWrite(MOIST_SWITCH, HIGH);
  delay(1000);
  int moist = analogRead(MOIST_IN);
  changeLights(moist);
  digitalWrite(MOIST_SWITCH, LOW);
  return moist;
}

void changeLights(int moist) {
  digitalWrite(L1, LOW);
  digitalWrite(L2, LOW);
  digitalWrite(L3, LOW);
  digitalWrite(L4, LOW);
  if (moist < 700) {
    digitalWrite(L1, HIGH);
  }
  if (moist < 600) {
    digitalWrite(L2, HIGH);
  }
  if (moist < 500) {
    digitalWrite(L3, HIGH);
  }
  if (moist < 400) {
    digitalWrite(L4, HIGH);
  }
}
