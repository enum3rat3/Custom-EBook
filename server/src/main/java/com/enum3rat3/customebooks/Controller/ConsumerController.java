package com.enum3rat3.customebooks.Controller;

import com.enum3rat3.customebooks.DTO.BookByIdResponse;
import com.enum3rat3.customebooks.DTO.BookResponse;
import com.enum3rat3.customebooks.Service.ConsumerService;
import com.enum3rat3.customebooks.model.Book;
import com.enum3rat3.customebooks.model.Cart;
import com.enum3rat3.customebooks.model.Chunk;
import com.enum3rat3.customebooks.DTO.NewBookDTO;
import com.enum3rat3.customebooks.model.Order;
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

    @PostMapping("/add-to-cart")
    public ResponseEntity<?> addToCart(@RequestParam int chunkId, @RequestParam String email) {
        Chunk chunk = consumerService.addToCart(chunkId, email);
        return ResponseEntity.ok(chunk);
    }

    @PostMapping("/remove-from-cart")
    public ResponseEntity<?> removeFromCart(@RequestParam int chunkId, @RequestParam String email) {
        int cartSize = consumerService.removeFromCart(chunkId, email);
        return ResponseEntity.ok(cartSize);
    }

    @GetMapping("/view-cart")
    public ResponseEntity<?> viewCart(@RequestParam String email) {
        List<Chunk> chunkList = consumerService.viewCart(email);
        return ResponseEntity.ok(chunkList);
    }

    @GetMapping("/orders")
    public ResponseEntity<?> myOrders(@RequestParam String email) {
        List<Order> orderList = consumerService.myOrder(email);
        return ResponseEntity.ok(orderList);
    }

    @PostMapping("/generate-book")
    public ResponseEntity<?> generateBook(@RequestBody NewBookDTO newBookDTO) throws Exception {
        Order order = consumerService.generateBook(newBookDTO.getNewTitle(), newBookDTO.getConsumerId(), newBookDTO.getChunkIds());
        return ResponseEntity.ok(order);
    }
}
