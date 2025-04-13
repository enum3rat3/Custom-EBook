package com.enum3rat3.customebooks.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="order")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column
    private int consumerId;

    @Column
    private String bookName;

    @Column
    private String bookS3Path;

    @Column
    private String bookLocalPath;

    @Column
    private int bookPrice;
}
