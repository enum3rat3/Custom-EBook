package com.enum3rat3.customebooks.Controller;

import com.enum3rat3.customebooks.DTO.UserDTO;
import com.enum3rat3.customebooks.Service.KeyCloakService;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class KeyCloakController {

    @Autowired
    private KeyCloakService service;

    @PostMapping
    public String addUser(@RequestBody UserDTO userDTO)
    {
        service.addUser(userDTO);
        return "User Added Successfully.";
    }

    @GetMapping(path = "/{userName}")
    public List<UserRepresentation> getUser(@PathVariable("userName") String userName)
    {
        List<UserRepresentation> user = service.getUser(userName);
        return user;
    }

    @PutMapping(path = "/update/{userId}")
    public String updateUser(@PathVariable("userId") String userId, @RequestBody UserDTO userDTO)
    {
        service.updateUser(userId, userDTO);
        return "User Details Updated Successfully.";
    }

    @DeleteMapping(path = "/{userId}")
    public String deleteUser(@PathVariable("userId") String userId)
    {
        service.deleteUser(userId);
        return "User Deleted Successfully.";
    }
}
