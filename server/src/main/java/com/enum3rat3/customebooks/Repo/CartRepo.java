package com.enum3rat3.customebooks.Repo;

import com.enum3rat3.customebooks.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CartRepo extends JpaRepository<Cart, Integer> {
    void deleteAllByConsumerId(int id);

    List<Cart> findAllByConsumerId(int id);

    void deleteByChunkId(int chunkId);

    void deleteAllByChunkId(int chunkId);
}
