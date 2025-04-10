package com.enum3rat3.customebooks.Service;

import com.enum3rat3.customebooks.DTO.RegisterDTO;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.RolesResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class KeyCloakService {

    @Value("${keycloak.realm}")
    private String realm;

    private final Keycloak keycloak;
    public ResponseEntity<String> addUser(RegisterDTO registerDTO, String userRole)
    {
        RolesResource rolesResource = keycloak.realm(realm).roles();
        RoleRepresentation roleRepresentation = rolesResource.get(userRole).toRepresentation();

        // Invalid Role
        if(roleRepresentation == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Role");

        // Define User
        UserRepresentation userRepresentation= new UserRepresentation();
        userRepresentation.setEnabled(true);
        userRepresentation.setFirstName(registerDTO .getFirstName());
        userRepresentation.setLastName(registerDTO.getLastName());
        userRepresentation.setUsername(registerDTO.getUserName());
        userRepresentation.setEmail(registerDTO.getEmailId());
        userRepresentation.setEmailVerified(true);

        // Define Credential
        CredentialRepresentation credentialRepresentation=new CredentialRepresentation();
        credentialRepresentation.setValue(registerDTO.getPassword());
        credentialRepresentation.setType(CredentialRepresentation.PASSWORD);
        userRepresentation.setCredentials(List.of(credentialRepresentation));

        // Create User
        RealmResource resource = keycloak.realm(realm);
        UsersResource usersResource = resource.users();
        Response response = usersResource.create(userRepresentation);
        String userID = CreatedResponseUtil.getCreatedId(response);
        System.out.println("USER ID: " + userID);

        // Role Assignment
        UserResource userResource = usersResource.get(userID);
        userResource.roles().realmLevel().add(Collections.singletonList(roleRepresentation));

        System.out.println(response.readEntity(String.class));

        return userLogin(registerDTO.getUserName(), registerDTO.getPassword(), userRole);
    }

    public ResponseEntity<String> userLogin(String username, String password, String userRole) {
        // Get User
        RealmResource realmResource = keycloak.realm(realm);
        Set<UserRepresentation> listOfUsers = realmResource.roles().get(userRole).getRoleUserMembers();

        boolean isContains = false;
        for(UserRepresentation userRepresentation: listOfUsers) {
            if(userRepresentation.getUsername().equals(username)) {
                isContains = true;
                break;
            }
        }

        // Invalid User
        if (!isContains)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid username or password");

        String url = "http://localhost:8082/realms/enum3rat3/protocol/openid-connect/token";

        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("grant_type", "password");
        map.add("client_id", "custom-ebook");
        map.add("username", username);
        map.add("password", password);


        HttpHeaders headers = new HttpHeaders();
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(map, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                return ResponseEntity.ok(response.getBody());  // The token from Keycloak
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred: " + e.getMessage());
        }
    }
}
