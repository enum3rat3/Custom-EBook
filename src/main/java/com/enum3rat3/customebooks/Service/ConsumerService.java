package com.enum3rat3.customebooks.Service;

import com.enum3rat3.customebooks.Repo.BookRepo;
import com.enum3rat3.customebooks.Repo.ChunkRepo;
import com.enum3rat3.customebooks.model.Book;
import com.enum3rat3.customebooks.model.Chunk;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ConsumerService {
    @Autowired
    private ChunkRepo chunkRepo;

    @Autowired
    private BookRepo bookRepo;

    public List<Book> listAllBooks() {
        List<Book> books = new ArrayList<>();

        books = bookRepo.findAll();

        return books;
    }

    public List<Chunk> listAllChunks(int bookId) {
        List<Chunk> chunks;

        chunks = chunkRepo.findAllByBkId(bookId);

        return chunks;
    }


    public int generateBook(String newTitle, List<Integer> chunkIds) throws IOException {
        PDFMergerUtility pdfMergerUtility = new PDFMergerUtility();
        pdfMergerUtility.setDestinationFileName("/home/jaimin/Desktop/SEM-2/Project/Custom-eBooks/src/main/resources/merged-pdf/" + newTitle + ".pdf");

        int totalCost = 0;
        for (Integer chunkId : chunkIds) {
            Chunk chunk = chunkRepo.findById(chunkId).orElse(null);
            if(chunk != null) {
                pdfMergerUtility.addSource(chunk.getChLocalPath());
                totalCost += chunk.getChPrice();
            }
        }
        pdfMergerUtility.mergeDocuments(null);
        return totalCost;
    }
}
