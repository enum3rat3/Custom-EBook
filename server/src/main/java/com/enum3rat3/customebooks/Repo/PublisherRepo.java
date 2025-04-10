package com.enum3rat3.customebooks.Repo;

import com.enum3rat3.customebooks.model.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Map;

public interface PublisherRepo extends JpaRepository<Publisher, Integer> {
    boolean findByEmail(String email);
}
