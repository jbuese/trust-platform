// initialisation script for MongoDB
//  will create a few service entries
print(
  "Start init #################################################################"
);

db = db.getSiblingDB("first_db");
db.services.drop();
db.createCollection("services");

// db.services.save({
//   _id: "601d5bb69421a5ebb7a3c877",
//   company: "Weather Company",
//   url: "example.com",
//   email: "info@example.com",
//   tel: "0123 4567890",
//   name: "OpenWeather",
//   version: "1.0.1",
//   description:
//     "Dieser Dienst gibt das aktuelle Wetter am Standort, der in der Datei def. ist, zurück.",
//   needsFullAccess: true,
//   accessReason: "Die Angabe zum Ort wird aus der Datei gelesen.",
//   usesExternalService: true,
//   externalServiceName: "Open Weather Map",
//   externalServiceReason:
//     "Die Wetterdaten werden extern von OpenWeather gesammelt und von diesem Service nur abgefragt.",
// });

// db.services.save({
//   _id: "601d5bb69421a5ebb7a3c878",
//   company: "Translation Company",
//   url: "example.com",
//   email: "info@example.com",
//   tel: "0123 4567890",
//   name: "Google Translate",
//   version: "1.0.0",
//   description:
//     "Dieser Dienst übersetzt englischen Text.",
//   needsFullAccess: true,
//   accessReason: "Um den kompletten Text zu übersetzen, wird Vollzugriff benötigt.",
//   usesExternalService: true,
//   externalServiceName: "Google Translate, rapidapi",
//   externalServiceReason:
//     "Die Übersetzung erfolgt über den Google Translate Dienst und kann ressourcenbedingt nicht von der Translation Company durchgeführt werden.",
// });

db.services.save({
  _id: "601d5bb69421a5ebb7a3c879",
  company: "Capslock Company",
  url: "example.com",
  email: "info@example.com",
  tel: "0123 4567890",
  name: "ALL CAPS AS A SERVICE",
  version: "1.0.0",
  description: "Dieser Dienst gibt den kompletten Text in Großbuchstaben zurück.",
  needsFullAccess: true,
  accessReason:
    "Um den kompletten Text zu transformieren, wird Vollzugriff benötigt.",
  usesExternalService: true,
  externalServiceName: "ShoutCloud.io",
  externalServiceReason:
    "Die komplizierte Umwandlung des Textes erfolgt über die hochkomplexen Algorithmen von ShoutCloud.",
});

db.services.save({
  _id: "601d5bb69421a5ebb7a3c880",
  company: "Upload Company",
  url: "example.com",
  email: "info@example.com",
  tel: "0123 4567890",
  name: "Upload to Anywhere",
  version: "1.0.0",
  description:
    "Dieser Dienst lädt die gesamte Datei auf file.io hoch, wo sie dann für die nächsten paar Tage abrufbar ist.",
  needsFullAccess: true,
  accessReason:
    "Die Datei wird komplett hochgeladen.",
  usesExternalService: true,
  externalServiceName: "file.io",
  externalServiceReason:
    "Die Dateien werden extern auf den Servern von file.io gespeichert..",
});

db.services.save({
  _id: "605c9b7e6056510014550b9e",
  company: "LocalService SE",
  url: "example.com",
  email: "info@example.com",
  tel: "0123 4567890",
  name: "LocalService",
  version: "1.0.0",
  description:
    "Lokal ausgeführter Dienst, der die Länge des Textes (in Zeichen) zurückgibt.",
  needsFullAccess: true,
  accessReason: "Die Datei muss komplett eingelesen werden.",
  usesExternalService: false,
  externalServiceName: "Not Applicable",
  externalServiceReason: "Not Applicable",
});

print(
  "End init #################################################################"
);