package com.enum3rat3.customebooks.DTO;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {


    private int bid;
    private String bkName;
    private String bkDesc;
    private String bkLocalPath;
    private String bkS3Path;
    private String bkS3CoverImagePath;
    private int bookPrice;
    private String  publisher;

}
