package com.enum3rat3.customebooks.Controller;

import com.enum3rat3.customebooks.Service.PublisherService;
import com.enum3rat3.customebooks.model.Book;
import com.enum3rat3.customebooks.model.Chunk;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/publish")
public class PublisherController {
    @Autowired
    private PublisherService publisherService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPDF(@RequestParam String bookName, @RequestParam int bookPrice, @RequestParam MultipartFile book)
    {
        int bookId;
        try {
            bookId = publisherService.uploadPDF(book, bookName, bookPrice);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.ok().body(bookId);
    }   

    @PostMapping("/book/chunks")
    public ResponseEntity<?> chunkPDF(@RequestParam int bookId, @RequestParam int startPage, @RequestParam int endPage, @RequestParam int chPrice) throws IOException {
        publisherService.chunkPDF(bookId, startPage, endPage, chPrice);

        return ResponseEntity.ok().body("Chunk");
    }

    @DeleteMapping("/book/{bookId}")
    public ResponseEntity<?> deleteBook(@PathVariable int bookId) {
        publisherService.deleteBook(bookId);

        return ResponseEntity.ok().body("Book Deleted: " + bookId);
    }

    @GetMapping("/book/{authorId}")
    public ResponseEntity<?> listBooks(@PathVariable int authorId) {
        List<Book> bookList = new ArrayList<>();

        bookList = publisherService.listBook(authorId);

        return ResponseEntity.ok().body(bookList);
    }

    @GetMapping("/chunk/{bookId}")
    public ResponseEntity<?> listChunks(@PathVariable int bookId) {
        List<Chunk> chunkList = new ArrayList<>();

        chunkList = publisherService.listChunk(bookId);

        return ResponseEntity.ok().body(chunkList);
    }

    @DeleteMapping("/chunk/{chunkId}")
    public ResponseEntity<?> deleteChunk(@PathVariable int chunkId) {
        publisherService.deleteChunk(chunkId);

        return ResponseEntity.ok().body("Chunk Deleted: " + chunkId);
    }
}
