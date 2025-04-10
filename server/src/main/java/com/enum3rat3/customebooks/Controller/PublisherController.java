package com.enum3rat3.customebooks.Controller;

import com.enum3rat3.customebooks.DTO.LocalS3DTO;
import com.enum3rat3.customebooks.Service.PublisherService;
import com.enum3rat3.customebooks.model.Book;
import com.enum3rat3.customebooks.model.Chunk;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/publisher")
public class PublisherController {
    @Autowired
    private PublisherService publisherService;

    @PostMapping("/create")
    public ResponseEntity<?> createBook(@RequestParam String bookName, @RequestParam String localPath, @RequestParam String s3path,@RequestParam int bookPrice)
    {

        try {
           publisherService.createBook(bookName, localPath, s3path,bookPrice);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.ok().body("successfully created book");
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadBook(@RequestParam String bookName, @RequestParam MultipartFile book)
    {
        LocalS3DTO localS3DTO;
        try {
            localS3DTO = publisherService.uploadBook(book,bookName);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.ok().body(localS3DTO);
    }

    @PostMapping("/book/chunks")
    public ResponseEntity<?> chunkPDF(@RequestParam int bookId, @RequestParam int startPage, @RequestParam int endPage, @RequestParam int chPrice) throws IOException {
        String response = publisherService.chunkPDF(bookId, startPage, endPage, chPrice);

        return ResponseEntity.ok().body(response);
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
