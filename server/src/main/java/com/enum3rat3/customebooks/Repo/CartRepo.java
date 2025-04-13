package com.enum3rat3.customebooks.Repo;

import com.enum3rat3.customebooks.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface CartRepo extends JpaRepository<Cart, Integer> {
    void deleteAllByConsumerId(int id);

    List<Cart> findAllByConsumerId(int id);

    void deleteByChunkId(int chunkId);
}
