package com.enum3rat3.customebooks.DTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class NewBookDTO {
    private String newTitle;
    private String email;
    private List<Integer> chunkIds;
}
