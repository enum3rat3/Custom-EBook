package com.enum3rat3.customebooks.DTO;

import com.enum3rat3.customebooks.model.Chunk;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookByIdResponse {

    private int bid;
    private String bkName;
    private String bkDesc;
    private String bkLocalPath;
    private String bkS3Path;
    private String bkS3CoverImagePath;
    private int bookPrice;
    private String  publisher;
    private List<Chunk> chunks;
}
