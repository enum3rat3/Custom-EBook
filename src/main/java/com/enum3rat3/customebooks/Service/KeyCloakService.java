package com.enum3rat3.customebooks.Service;

import com.enum3rat3.customebooks.DTO.UserDTO;
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
import org.springframework.stereotype.Service;

import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KeyCloakService {

    @Value("${keycloak.realm}")
    private String realm;

    private final Keycloak keycloak;
    public boolean addUser(UserDTO userDTO, String userRole)
    {
        RolesResource rolesResource = keycloak.realm(realm).roles();
        RoleRepresentation roleRepresentation = rolesResource.get(userRole).toRepresentation();

        // Invalid Role
        if(roleRepresentation == null)
            return false;

        // Define User
        UserRepresentation userRepresentation= new UserRepresentation();
        userRepresentation.setEnabled(true);
        userRepresentation.setFirstName(userDTO.getFirstName());
        userRepresentation.setLastName(userDTO.getLastName());
        userRepresentation.setUsername(userDTO.getUserName());
        userRepresentation.setEmail(userDTO.getEmailId());
        userRepresentation.setEmailVerified(true);

        // Define Credential
        CredentialRepresentation credentialRepresentation=new CredentialRepresentation();
        credentialRepresentation.setValue(userDTO.getPassword());
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

        return response.getStatus() == 201;
    }
}
