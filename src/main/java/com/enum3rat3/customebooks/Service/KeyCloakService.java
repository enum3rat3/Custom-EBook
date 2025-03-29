package com.enum3rat3.customebooks.Service;

import com.enum3rat3.customebooks.DTO.UserDTO;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.ws.rs.core.Response;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KeyCloakService {

    @Value("${keycloak.realm}")
    private String realm;

    private final Keycloak keycloak;

    public boolean addUser(UserDTO userDTO){
        
        UserRepresentation userRepresentation= new UserRepresentation();
        userRepresentation.setEnabled(true);
        userRepresentation.setFirstName(userDTO.getFirstName());
        userRepresentation.setLastName(userDTO.getLastName());
        userRepresentation.setUsername(userDTO.getUserName());
        userRepresentation.setEmail(userDTO.getEmailId());
        userRepresentation.setEmailVerified(true);

        CredentialRepresentation credentialRepresentation=new CredentialRepresentation();
        credentialRepresentation.setValue(userDTO.getPassword());
        credentialRepresentation.setType(CredentialRepresentation.PASSWORD);

        userRepresentation.setCredentials(List.of(credentialRepresentation));

        RealmResource resource = keycloak.realm(realm);
        UsersResource usersResource = resource.users();
        Response response = usersResource.create(userRepresentation);

        System.out.println(response.readEntity(String.class));
        System.out.println(response.getStatus());

        return response.getStatus() == 201;
    }
}
