package com.enum3rat3.customebooks.Controller;

import com.enum3rat3.customebooks.Service.ConsumerService;
import com.enum3rat3.customebooks.model.Book;
import com.enum3rat3.customebooks.model.Chunk;
import com.enum3rat3.customebooks.DTO.NewBookDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/consumer")
public class ConsumerController {

    @Autowired
    private ConsumerService consumerService;

    @GetMapping("/books")
    public ResponseEntity<?> listAllBooks() {
        List<Book> listBooks = new ArrayList<>();

        listBooks = consumerService.listAllBooks();

        return ResponseEntity.ok(listBooks);
    }

    @GetMapping("/book/{bookId}")
    @PreAuthorize("hasRole('consumer')")
    public ResponseEntity<?> listAllChunks(@PathVariable int bookId) {
        List<Chunk> chunkList = new ArrayList<>();
        chunkList = consumerService.listAllChunks(bookId);

        return ResponseEntity.ok(chunkList);
    }

    @PostMapping("/generate-book")
    @PreAuthorize("hasRole('consumer')")
    public ResponseEntity<?> generateBook(@RequestBody NewBookDTO newBookDTO) throws Exception {
        int totalCost = consumerService.generateBook(newBookDTO.getNewTitle(), newBookDTO.getAuthorName(), newBookDTO.getChunkIds());

        return ResponseEntity.ok("New Book Generated, Pay: " + totalCost + "Rs to download the book");
    }
}
