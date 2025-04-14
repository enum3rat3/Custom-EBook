package com.enum3rat3.customebooks.Repo;

import com.enum3rat3.customebooks.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Order, Integer> {
    List<Order> findAllByConsumerId(int id);
}
