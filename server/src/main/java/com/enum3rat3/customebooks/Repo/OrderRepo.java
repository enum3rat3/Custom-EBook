package com.enum3rat3.customebooks.Repo;

import com.enum3rat3.customebooks.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Integer> {
    List<Order> findAllByConsumerId(int id);
}
