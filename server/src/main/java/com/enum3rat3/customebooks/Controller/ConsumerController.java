package com.enum3rat3.customebooks.Controller;

import com.enum3rat3.customebooks.DTO.BookByIdResponse;
import com.enum3rat3.customebooks.DTO.BookResponse;
import com.enum3rat3.customebooks.Service.ConsumerService;
import com.enum3rat3.customebooks.model.Book;
import com.enum3rat3.customebooks.model.Chunk;
import com.enum3rat3.customebooks.DTO.NewBookDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/consumer")
public class ConsumerController {

    @Autowired
    private ConsumerService consumerService;

    @GetMapping("/books")
    public ResponseEntity<?> listAllBooks() {
        List<BookResponse> listBooks;
        listBooks = consumerService.listAllBooks();
        return ResponseEntity.ok(listBooks);
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<?> BookById(@PathVariable int bookId) {
        BookByIdResponse bookByIdResponse = consumerService.BookById(bookId);
        return ResponseEntity.ok(bookByIdResponse);
    }

    @PostMapping("/generate-book")
    public ResponseEntity<?> generateBook(@RequestBody NewBookDTO newBookDTO) throws Exception {
        int totalCost = consumerService.generateBook(newBookDTO.getNewTitle(), newBookDTO.getAuthorName(), newBookDTO.getChunkIds());

        return ResponseEntity.ok("New Book Generated, Pay: " + totalCost + "Rs to download the book");
    }
}
