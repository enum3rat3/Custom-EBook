package com.enum3rat3.customebooks.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class NewBook {
    private String newTitle;
    private List<Integer> chunkIds;
}
