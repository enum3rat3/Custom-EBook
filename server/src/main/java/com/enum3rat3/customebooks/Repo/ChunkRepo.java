package com.enum3rat3.customebooks.Repo;

import com.enum3rat3.customebooks.model.Chunk;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChunkRepo extends JpaRepository<Chunk, Integer> {

    List<Chunk> findAllByBkId(int bookId);

    void deleteByBkId(int bookId);

    void deleteAllByBkId(int bookId);
}
