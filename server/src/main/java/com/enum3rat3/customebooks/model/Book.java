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

    @Column(name = "bklocalpath")
    private String bkLocalPath;

    @Column(name = "bks3path")
    private String bkS3Path;

    @Column(name = "bkprice")
    private int bookPrice;

    @Column(name = "pubid")
    private int pubId;

    public Book(String bkName, String bkLocalPath, String bkS3Path, int bookPrice, int pubId) {
        this.bkName = bkName;
        this.bkLocalPath = bkLocalPath;
        this.bkS3Path = bkS3Path;
        this.bookPrice = bookPrice;
        this.pubId = pubId;
    }
}
