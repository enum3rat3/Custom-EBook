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
    private String chPath;

    @Column
    private int bkId;


    public Chunk(int bookId, int startPage, int endPage, int chPrice, String chunkPath) {
        this.startPage = startPage;
        this.endPage = endPage;
        this.chPrice = chPrice;
        this.bkId = bookId;
        this.chPath = chunkPath;
    }
}
