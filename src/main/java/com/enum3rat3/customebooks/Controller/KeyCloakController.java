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

    @PostMapping("/{userRole}")
    public String addUser(@RequestBody UserDTO userDTO, @PathVariable String userRole)
    {
        boolean status = service.addUser(userDTO, userRole);
        return status ? "User Added Successfully." : "User Not Added Successfully.";
    }
}
