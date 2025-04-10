package com.enum3rat3.customebooks.Controller;

import com.enum3rat3.customebooks.DTO.RegisterDTO;
import com.enum3rat3.customebooks.Service.KeyCloakService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class KeyCloakController {

    @Autowired
    private KeyCloakService service;

    @PostMapping("/{userRole}")
    public ResponseEntity<String> addUser(@RequestBody RegisterDTO registerDTO, @PathVariable String userRole)
    {
        return service.addUser(registerDTO, userRole);
    }

    @PostMapping("/login")
    public ResponseEntity<String> userLogin(@RequestParam String username, @RequestParam String password, @RequestParam String userRole)
    {
        return service.userLogin(username, password, userRole);
    }
}
