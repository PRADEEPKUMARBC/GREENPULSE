// // #include <DHT.h>

// // #define DHTPIN 2       // DHT11 data pin
// // #define DHTTYPE DHT11
// // DHT dht(DHTPIN, DHTTYPE);

// int sensorPin = A0;
// int pumpPin = 3;
// int sensorValue = 0;
// int threshold = 50;

// void setup() {
//   pinMode(pumpPin, OUTPUT);
//   digitalWrite(pumpPin, LOW);
//   Serial.begin(9600);
//   dht.begin();
//   delay(2000);
// }

// void loop() {
//   // --- Soil Moisture ---
//   sensorValue = analogRead(sensorPin);
//   int moisturePercent = map(sensorValue, 1023, 400, 0, 100);
//   if (moisturePercent < 0) moisturePercent = 0;
//   if (moisturePercent > 100) moisturePercent = 100;

//   // --- Soil Status ---
//   String soilStatus;
//   if (moisturePercent < 50) {
//     soilStatus = "DRY";
//     digitalWrite(pumpPin, HIGH);
//   } else if (moisturePercent < 60) {
//     soilStatus = "MOIST";
//     digitalWrite(pumpPin, LOW);
//   } else {
//     soilStatus = "WET";
//     digitalWrite(pumpPin, LOW);
//   }

//   // --- DHT11 Readings ---
//   float humidity = dht.readHumidity();
//   float temperature = dht.readTemperature();
  
//   if (isnan(humidity) || isnan(temperature)) {
//     Serial.println("Error reading DHT11!");
//     delay(2000);
//     return;
//   }

//   // --- Print all in single line ---
//   Serial.print("Moisture: "); Serial.print(moisturePercent);
//   Serial.print("% - "); Serial.print(soilStatus);
//   Serial.print(" | Temperature: "); Serial.print(temperature);
//   Serial.print("°C | Humidity: "); Serial.print(humidity);
//   Serial.println("%");

//   delay(2000);
// }


// #define SOIL_PIN A0      // Soil moisture sensor analog pin
// #define RELAY_PIN 7      // Relay control pin

// int soilMoistureValue = 0;
// int soilMoisturePercent = 0;
// String soilStatus = "";

// void setup() {
//   Serial.begin(9600);
//   pinMode(SOIL_PIN, INPUT);
//   pinMode(RELAY_PIN, OUTPUT);
//   digitalWrite(RELAY_PIN, LOW);
//   Serial.println("Smart Irrigation System Started...");
// }

// void loop() {
//   soilMoistureValue = analogRead(SOIL_PIN);

//   // Convert raw value (0–1023) to percentage (0–100%)
//   soilMoisturePercent = map(soilMoistureValue, 1023, 0, 0, 100);
//   // (Dry = 1023 → 0%, Wet = 0 → 100%)

//   // Print moisture percentage
//   Serial.print("Soil Moisture: ");
//   Serial.print(soilMoisturePercent);
//   Serial.println("%");

//   // Decide dry or wet
//   if (soilMoisturePercent > 40) {
//     soilStatus = "WET";
//     digitalWrite(RELAY_PIN, LOW); // Turn OFF pump
//   } else {
//     soilStatus = "DRY";
//     digitalWrite(RELAY_PIN, HIGH); // Turn ON pump
//   }

//   // Send to Node.js backend
//   Serial.print("Soil Status: ");
//   Serial.println(soilStatus);

//   delay(3000); // wait 3 seconds before next reading
// }






// // ✅ Smart Irrigation System (No DHT, only Soil Moisture)
// #define SOIL_PIN A0
// #define RELAY_PIN 7

// int soilMoistureValue = 0;
// int soilMoisturePercent = 0;
// String soilStatus = "";

// void setup() {
//   Serial.begin(9600);
//   pinMode(SOIL_PIN, INPUT);
//   pinMode(RELAY_PIN, OUTPUT);
//   digitalWrite(RELAY_PIN, LOW);
//   Serial.println("Smart Irrigation System Started...");
// }

// void loop() {
//   soilMoistureValue = analogRead(SOIL_PIN);

//   // Convert raw value (0–1023) to percentage (0–100)
//   soilMoisturePercent = map(soilMoistureValue, 1023, 0, 0, 100);

//   // Decide soil condition
//   if (soilMoisturePercent > 60) {
//     soilStatus = "WET";
//     digitalWrite(RELAY_PIN, LOW);
//   } else {
//     soilStatus = "DRY";
//     digitalWrite(RELAY_PIN, HIGH);
//   }

//   // Send clean serial data
//   Serial.print("Soil Moisture: ");
//   Serial.print(soilMoisturePercent);
//   Serial.print("% | Status: ");
//   Serial.println(soilStatus);

//   delay(2000);
// }
























#define SOIL_PIN A0
#define RELAY_PIN 7

int soilValue = 0;
int soilPercent = 0;
String soilStatus = "";

void setup() {
  Serial.begin(9600);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);
  Serial.println("🌿 Smart Irrigation Started...");
}

void loop() {
  soilValue = analogRead(SOIL_PIN);
  soilPercent = map(soilValue, 1023, 0, 0, 100); // convert to %

  if (soilPercent < 40) {
    soilStatus = "DRY";
    digitalWrite(RELAY_PIN, HIGH);
  } else if (soilPercent <= 70) {
    soilStatus = "MOIST";
    digitalWrite(RELAY_PIN, LOW);
  } else {
    soilStatus = "WET";
    digitalWrite(RELAY_PIN, LOW);
  }

  Serial.print("Soil Moisture: ");
  Serial.print(soilPercent);
  Serial.print("% | Status: ");
  Serial.println(soilStatus);

  delay(2000);
}
