package com.enum3rat3.customebooks.Service;

import com.enum3rat3.customebooks.DTO.BookDTO;
import com.enum3rat3.customebooks.Repo.ChunkRepo;
import com.enum3rat3.customebooks.Repo.BookRepo;
import com.enum3rat3.customebooks.model.Book;
import com.enum3rat3.customebooks.model.Chunk;
import jakarta.transaction.Transactional;
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
    private final AmazonS3Service amazonS3Service;

    public PublisherService(BookRepo bookRepo, ChunkRepo chunkRepo, AmazonS3Service amazonS3Service) {
        this.bookRepo = bookRepo;
        this.chunkRepo = chunkRepo;
        this.amazonS3Service = amazonS3Service;
    }

    // ======================== Upload PDF =====================
    public BookDTO uploadPDF(MultipartFile book, String bookName, int bookPrice) throws IOException {

        // Upload Book in Cloud
        amazonS3Service.uploadBook(book, bookName.replace(" ", "_"));
        String s3Path = amazonS3Service.getBucketName() + ".s3." + amazonS3Service.getEndpointUrl() + "/" + bookName.replace(" ", "_") + ".pdf";

        // Local Save
        String localPath = "src/main/resources/upload/" + bookName.replace(" ", "_") + ".pdf";
        OutputStream os = new FileOutputStream(new File(localPath));
        os.write(book.getBytes());

        // Save Details
        Book book1 = new Book(bookName, localPath, s3Path, bookPrice, 1);
        book1 = bookRepo.save(book1);

        BookDTO bookDTO = new BookDTO();
        bookDTO.setBookID(book1.getBid());
        bookDTO.setBookPath(book1.getBkS3Path());
        return bookDTO;
    }

    // ======================== Chunk PDF =====================
    public String chunkPDF(int bookId, int startPage, int endPage, int chPrice) throws IOException {
        Book bk = bookRepo.findById(bookId).orElse(null);

        if(bk != null) {

            String filePath = bk.getBkLocalPath();
            String chunkS3Path = amazonS3Service.getBucketName() + ".s3." + amazonS3Service.getEndpointUrl() + "/" + bk.getBkName().replace(" ", "_") + "_" + startPage + "_" + endPage + ".pdf";
            String chunkLocalPath = "src/main/resources/chunks/" + bk.getBkName().replace(" ", "_") + "_" + startPage + "_" + endPage + ".pdf";

            // Loading PDF
            File file = new File(filePath);
            PDDocument document = PDDocument.load(file);

            // ============== Splitting PDF into multiple pages ===============
            Splitter splitter = new Splitter();
            splitter.setSplitAtPage(endPage - startPage + 1);
            splitter.setStartPage(startPage);
            splitter.setEndPage(endPage);

            Iterable<PDDocument> page = splitter.split(document);
            for (PDDocument pdDocument : page) {
                pdDocument.save(chunkLocalPath);
            }

            amazonS3Service.uploadChunk(new File(chunkLocalPath), bk.getBkName().replace(" ", "_") + "_" + startPage + "_" + endPage + ".pdf");
            Chunk ch = new Chunk(bookId, startPage, endPage, chPrice, chunkS3Path, chunkLocalPath);

            chunkRepo.save(ch);
            return chunkS3Path;
        }

        return "Book not found";
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
            amazonS3Service.deleteBookAndChunk(bk.getBkS3Path());
            bookRepo.deleteById(bookId);

            String bookPath = bk.getBkLocalPath();
            File file = new File(bookPath);
            file.delete();

            List<Chunk> chunks = chunkRepo.findAllByBkId(bookId);
            for(Chunk chunk : chunks) {
                amazonS3Service.deleteBookAndChunk(chunk.getChS3Path());
                String chunkPath = chunk.getChLocalPath();
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
            String chunkPath = chunk.getChLocalPath();
            amazonS3Service.deleteBookAndChunk(chunk.getChS3Path());
            File file1 = new File(chunkPath);
            file1.delete();
            chunkRepo.deleteById(chunkId);
        }
    }
}
