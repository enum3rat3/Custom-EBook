package com.enum3rat3.customebooks.Repo;

import com.enum3rat3.customebooks.model.Consumer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsumerRepo extends JpaRepository<Consumer, Integer> {
    boolean findByEmail(String email);
}
