package com.enum3rat3.customebooks.DTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class BookDTO {
    private int bookID;
    private String bookPath;
}
