package com.enum3rat3.customebooks.Repo;

import com.enum3rat3.customebooks.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepo extends JpaRepository<Book, Integer> {
    Book findByBkName(String bkName);

    List<Book> findAllByPubId(int pubId);

    void deleteByBid(int bookId);

    Book findByBid(int bookId);
}
