package com.enum3rat3.customebooks.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocalS3DTO {

    private String localPath;
    private String s3Path;
    private String s3CoverImagePath;

}
