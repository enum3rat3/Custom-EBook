package com.enum3rat3.customebooks.model;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@Entity
@AllArgsConstructor
@Getter
@Setter
@Table(name = "book")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int bid;

    @Column(name = "bkname")
    private String bkName;

    @Column(name="bkdesc")
    private String bkDesc;

    @Column(name = "bklocalpath")
    private String bkLocalPath;

    @Column(name = "bks3path")
    private String bkS3Path;

    @Column(name="bks3coverimagepath")
    private String bkS3CoverImagePath;

    @Column(name = "bkprice")
    private int bookPrice;

    @Column(name = "pubid")
    private int pubId;

    public Book(String bkName, String bkDesc, String bkLocalPath, String bkS3Path, String bkS3CoverImagePath, int bookPrice, int pubId) {
        this.bkName = bkName;
        this.bkLocalPath = bkLocalPath;
        this.bkS3Path = bkS3Path;
        this.bookPrice = bookPrice;
        this.pubId = pubId;
        this.bkDesc = bkDesc;
        this.bkS3CoverImagePath = bkS3CoverImagePath;
    }
}
