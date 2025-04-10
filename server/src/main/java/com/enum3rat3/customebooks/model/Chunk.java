package com.enum3rat3.customebooks.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table
@AllArgsConstructor
@NoArgsConstructor
public class Chunk {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int chId;

    @Column
    private int startPage;

    @Column
    private int endPage;

    @Column
    private int chPrice;

    @Column
    private String chS3Path;

    @Column
    private String chLocalPath;

    @Column
    private int bkId;


    public Chunk(int bookId, int startPage, int endPage, int chPrice, String chS3Path, String chLocalPath) {
        this.startPage = startPage;
        this.endPage = endPage;
        this.chPrice = chPrice;
        this.bkId = bookId;
        this.chS3Path = chS3Path;
        this.chLocalPath = chLocalPath;
    }
}
