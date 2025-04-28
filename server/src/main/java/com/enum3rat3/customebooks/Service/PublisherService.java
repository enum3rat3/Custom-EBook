package com.enum3rat3.customebooks.Service;

import com.enum3rat3.customebooks.DTO.BookDTO;
import com.enum3rat3.customebooks.DTO.LocalS3DTO;
import com.enum3rat3.customebooks.Repo.ChunkRepo;
import com.enum3rat3.customebooks.Repo.BookRepo;
import com.enum3rat3.customebooks.Repo.PublisherRepo;
import com.enum3rat3.customebooks.model.Book;
import com.enum3rat3.customebooks.model.Chunk;
import com.enum3rat3.customebooks.model.Publisher;
import jakarta.transaction.Transactional;
import org.apache.pdfbox.multipdf.Splitter;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
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
    private final PublisherRepo publisherRepo;

    public PublisherService(BookRepo bookRepo, ChunkRepo chunkRepo, AmazonS3Service amazonS3Service, PublisherRepo publisherRepo) {
        this.bookRepo = bookRepo;
        this.chunkRepo = chunkRepo;
        this.amazonS3Service = amazonS3Service;
        this.publisherRepo = publisherRepo;
    }

    // ======================== Upload PDF =====================
    public void createBook(String bookName,String description,String localPath,  String s3Path,String s3CoverImagePath, int bookPrice,String email) throws IOException {

        // Upload Book in Cloud
//        amazonS3Service.uploadBook(book, bookName.replace(" ", "_"));
//        String s3Path = amazonS3Service.getBucketName() + ".s3." + amazonS3Service.getEndpointUrl() + "/" + bookName.replace(" ", "_") + ".pdf";
//
//        // Local Save
//        String localPath = "src/main/resources/upload/" + bookName.replace(" ", "_") + ".pdf";
//        OutputStream os = new FileOutputStream(new File(localPath));
//        os.write(book.getBytes());

        // Save Details


        Publisher publisher=publisherRepo.findByEmail(email);

        Book book1 = new Book(bookName, description, localPath, s3Path, s3CoverImagePath, bookPrice, publisher.getId());
        book1 = bookRepo.save(book1);
        System.out.println(book1.toString());
    }

    public LocalS3DTO uploadBook(MultipartFile book,MultipartFile image,String bookName) throws IOException {
        String s3CoverImagePath=amazonS3Service.uploadBook(book, image,bookName.replace(" ", "_"));
        String s3Path = amazonS3Service.getBucketName() + ".s3." + amazonS3Service.getEndpointUrl() + "/" + bookName.replace(" ", "_") + ".pdf";;
        generateCoverImagePDF(bookName, image);

        String folderPath = "uploads/";
        String fileName = bookName.replace(" ", "_") + ".pdf";
        String localPath = folderPath + fileName;

        File directory = new File(folderPath);
        if (!directory.exists()) {
            directory.mkdirs(); // create the directory (and parents) if it doesn't exist
        }

        File file = new File(localPath);
        try (OutputStream os = new FileOutputStream(file)) {
            os.write(book.getBytes());
        }

        return new LocalS3DTO(localPath, s3Path,s3CoverImagePath);
    }

    public void generateCoverImagePDF(String bookName, MultipartFile image) throws IOException {
        byte[] imageBytes = image.getBytes();
        PDDocument document = new PDDocument();
        PDPage page = new PDPage(PDRectangle.A4);
        document.addPage(page);

        PDImageXObject pdImage = PDImageXObject.createFromByteArray(document, imageBytes, "uploaded-image");
        PDRectangle pageSize = page.getMediaBox();
        float pageWidth = pageSize.getWidth();
        float pageHeight = pageSize.getHeight();

        float imageWidth = pdImage.getWidth();
        float imageHeight = pdImage.getHeight();

        // Calculate scale to fit the image completely inside the page
        float widthScale = pageWidth / imageWidth;
        float heightScale = pageHeight / imageHeight;
        float scale = Math.min(widthScale, heightScale); // Fit without cropping

        float scaledWidth = imageWidth * scale;
        float scaledHeight = imageHeight * scale;

        // Center the image
        float x = (pageWidth - scaledWidth) / 2;
        float y = (pageHeight - scaledHeight) / 2;

        PDPageContentStream contentStream = new PDPageContentStream(document, page);
        contentStream.drawImage(pdImage, x, y, scaledWidth, scaledHeight);
        contentStream.close();
        document.save("src/main/resources/images/" + bookName + ".pdf");

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        document.save(outputStream);
    }

    // ======================== Chunk PDF =====================
    public Chunk chunkPDF(int bookId, int startPage, int endPage, int chPrice) throws IOException {
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
            return ch;
        }

        return null;
    }

    // ======================== List of Books by Publisher ID =====================
    public List<Book> listBook(String email) {
        Publisher publisher=publisherRepo.findByEmail(email);
        List<Book> books = bookRepo.findAllByPubId(publisher.getId());

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

    public Book getBookById(int bookId) {
        return bookRepo.findByBid(bookId);
    }
}
