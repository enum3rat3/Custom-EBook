package com.enum3rat3.customebooks.Service;

import com.enum3rat3.customebooks.Config.Credentials;
import com.enum3rat3.customebooks.DTO.UserDTO;
import lombok.AllArgsConstructor;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

import static com.enum3rat3.customebooks.Config.KeycloakConfig.getInstance;

@Service
@AllArgsConstructor
public class KeyCloakService {
    public void addUser(UserDTO userDTO){
        CredentialRepresentation credential = Credentials.createPasswordCredentials(userDTO.getPassword());
        UserRepresentation user = new UserRepresentation();
        user.setUsername(userDTO.getUserName());
        user.setFirstName(userDTO.getFirstname());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmailId());
        user.setCredentials(Collections.singletonList(credential));
        user.setEnabled(true);

        UsersResource instance = (UsersResource) getInstance();
        instance.create(user);
    }

    public void updateUser(String userId, UserDTO userDTO){
        CredentialRepresentation credential = Credentials.createPasswordCredentials(userDTO.getPassword());
        UserRepresentation user = new UserRepresentation();
        user.setUsername(userDTO.getUserName());
        user.setFirstName(userDTO.getFirstname());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmailId());
        user.setCredentials(Collections.singletonList(credential));

        UsersResource usersResource = (UsersResource) getInstance();
        usersResource.get(userId).update(user);
    }

    public void deleteUser(String userId){
        UsersResource usersResource = (UsersResource) getInstance();
        usersResource.get(userId).remove();
    }

    public List<UserRepresentation> getUser(String userName) {
        UsersResource usersResource = (UsersResource) getInstance();
        List<UserRepresentation> user = usersResource.search(userName, true);
        return user;
    }
}
