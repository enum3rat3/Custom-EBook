import Keycloak from "keycloak-js";

const KeyClock = new Keycloak({
  url: "http://localhost:8082", // Keycloak server URL
  realm: "ebook-publisher", // Replace with your realm name
  clientId: "client-publisher", // Replace with your client ID
});

export default KeyClock;