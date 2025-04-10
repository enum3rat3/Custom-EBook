package com.enum3rat3.customebooks.DTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class RegisterDTO {
    private String userName;
    private String emailId;
    private String password;
    private String firstName;
    private String lastName;
}