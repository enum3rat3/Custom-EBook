import Keycloak from "keycloak-js";

const KeyClock = new Keycloak({
  url: "http://localhost:8082", // Keycloak server URL
  realm: "ebook-consumer", // Replace with your realm name
  clientId: "client-consumer", // Replace with your client ID
});

export default KeyClock;