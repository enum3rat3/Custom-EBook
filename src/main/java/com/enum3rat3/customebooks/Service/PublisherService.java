package com.enum3rat3.customebooks.Service;

import com.enum3rat3.customebooks.Repo.ChunkRepo;
import com.enum3rat3.customebooks.Repo.BookRepo;
import com.enum3rat3.customebooks.model.Book;
import com.enum3rat3.customebooks.model.Chunk;
import jakarta.transaction.Transactional;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.multipdf.Splitter;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class PublisherService {
    private final BookRepo bookRepo;
    private final ChunkRepo chunkRepo;

    public PublisherService(BookRepo bookRepo, ChunkRepo chunkRepo) {
        this.bookRepo = bookRepo;
        this.chunkRepo = chunkRepo;
    }

    // ======================== Upload PDF =====================
    public int uploadPDF(MultipartFile book, String bookName, int bookPrice) throws IOException {
        File file = new File("src/main/resources/upload/" + bookName + ".pdf");
        file.createNewFile();

        try (OutputStream os = new FileOutputStream(file)) {
            os.write(book.getBytes());
        }

        Book book1 = new Book(bookName, file.getAbsoluteFile().toString(), bookPrice, 1);

        book1 = bookRepo.save(book1);

        return book1.getBid();
    }

    // ======================== Chunk PDF =====================
    public void chunkPDF(int bookId, int startPage, int endPage, int chPrice) throws IOException {
        Book bk = bookRepo.findById(bookId).orElse(null);

        if(bk != null) {
            String filePath = bk.getBkPath();
            System.out.println("FilePath: " + filePath);
            String chunkPath = "/home/jaimin/Desktop/SEM-2/Project/Custom-eBooks/src/main/resources/splitted-folder/" + bk.getBkName() + "-" + startPage + "-" + endPage + ".pdf";
            File file = new File(filePath);

            // Loading PDF
            PDDocument document = Loader.loadPDF(file);
            // ============== Splitting PDF into multiple pages ===============
            Splitter splitter = new Splitter();
            splitter.setSplitAtPage(endPage - startPage + 1);
            splitter.setStartPage(startPage);
            splitter.setEndPage(endPage);

            Iterable<PDDocument> page = splitter.split(document);
            for (PDDocument pdDocument : page) {
                pdDocument.save(chunkPath);
            }

            Chunk ch = new Chunk(bookId, startPage, endPage, chPrice, chunkPath);

            chunkRepo.save(ch);
        }
    }

    // ======================== List of Books by Publisher ID =====================
    public List<Book> listBook(int pubId) {
        List<Book> books = bookRepo.findAllByPubId(pubId);
        return books;
    }

    public List<Chunk> listChunk(int bookId) {
        List<Chunk> chunkList = new ArrayList<>();

        chunkList = chunkRepo.findAllByBkId(bookId);

        return chunkList;
    }

    // ====================== Remove Book & All its chunks ========================
    @Transactional
    public void deleteBook(int bookId) {
        Book bk = bookRepo.findById(bookId).orElse(null);

        if(bk != null) {
            String bookPath = bk.getBkPath();
            File file = new File(bookPath);
            file.delete();

            bookRepo.deleteById(bookId);

            List<Chunk> chunks = chunkRepo.findAllByBkId(bookId);
            for(Chunk chunk : chunks) {
                String chunkPath = chunk.getChPath();
                File file1 = new File(chunkPath);
                file1.delete();
            }
            chunkRepo.deleteAllByBkId(bookId);

        }
    }

    // =================== Delete Particular Chunk =========================
    public void deleteChunk(int chunkId) {
        Chunk chunk = chunkRepo.findById(chunkId).orElse(null);

        if(chunk != null) {
            String chunkPath = chunk.getChPath();
            File file1 = new File(chunkPath);
            file1.delete();
            chunkRepo.deleteById(chunkId);
        }
    }
}
