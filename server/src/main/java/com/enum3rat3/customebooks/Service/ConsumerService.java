package com.enum3rat3.customebooks.Service;

import com.enum3rat3.customebooks.DTO.BookByIdResponse;
import com.enum3rat3.customebooks.DTO.BookResponse;
import com.enum3rat3.customebooks.Repo.*;
import com.enum3rat3.customebooks.model.*;
import org.apache.fop.apps.*;

import javax.xml.transform.*;
import javax.xml.transform.sax.SAXResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageDestination;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageFitDestination;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.outline.PDDocumentOutline;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.util.*;

@Service
public class ConsumerService {
    @Autowired
    private ChunkRepo chunkRepo;
    @Autowired
    private BookRepo bookRepo;
    @Autowired
    private PublisherRepo publisherRepo;
    @Autowired
    private ConsumerRepo consumerRepo;
    @Autowired
    private CartRepo cartRepo;
    @Autowired
    private OrderRepo orderRepo;
    @Autowired
    private AmazonS3Service amazonS3Service;

    public List<BookResponse> listAllBooks() {
        List<Book> books = bookRepo.findAll();
        List<BookResponse> bookResponses = new ArrayList<>();

        for(Book book : books) {
            int pubid = book.getPubId();
            Publisher pub = publisherRepo.findById(pubid).orElse(null);
            BookResponse br = new BookResponse();
            br.setBid(book.getBid());
            br.setBkName(book.getBkName());
            br.setBkDesc(book.getBkDesc());
            br.setBookPrice(book.getBookPrice());
            br.setBkLocalPath(book.getBkLocalPath());
            br.setBkS3CoverImagePath(book.getBkS3CoverImagePath());
            br.setBkS3Path(book.getBkS3Path());
            br.setPublisher(pub.getFirstName());

            bookResponses.add(br);
        }

        return bookResponses;
    }

    public List<Chunk> listAllChunks(int bookId) {
        List<Chunk> chunks = chunkRepo.findAllByBkId(bookId);
        return chunks;
    }


    @Transactional
    public Order generateBook(String newTitle, String email, List<Integer> chunkIds) throws Exception {
        int totalCost = 0;
        List<String> headings = new ArrayList<>();
        List<String> chunkPath = new ArrayList<>();
        List<String> coverImagesPath = new ArrayList<>();
        for (Integer chunkId : chunkIds) {
            Chunk chunk = chunkRepo.findById(chunkId).orElse(null);
            if (chunk != null) {
                String path = bookRepo.findByBid(chunk.getBkId()).getBkName();
                coverImagesPath.add("src/main/resources/images/" + path.replace(" ", "_") + ".pdf");
                String heading = chunk.getChS3Path().split("/")[1].split("\\.")[0];
                headings.add(heading);
                chunkPath.add(chunk.getChLocalPath());
                totalCost += chunk.getChPrice();
            }
        }

        Consumer consumer = consumerRepo.findByEmail(email);
        String authorName = consumer.getFirstName() + " " + consumer.getLastName();
        String indexFile = createPDF(newTitle, authorName, headings);
        String bookLocalPath  = mergePDF(chunkPath, headings, coverImagesPath, newTitle, indexFile);

        amazonS3Service.uploadChunk(new File(bookLocalPath), newTitle.replace(" ", "_") + ".pdf");
        String bookS3Path = "https://" + amazonS3Service.getBucketName() + ".s3." + amazonS3Service.getEndpointUrl() + "/" + newTitle.replace(" ", "_") + ".pdf";

        Order order = new Order();
        order.setBookName(newTitle);
        order.setConsumerId(consumer.getId());
        order.setBookS3Path(bookS3Path);
        order.setBookLocalPath(bookLocalPath);
        order.setBookPrice(totalCost);
        orderRepo.save(order);

        cartRepo.deleteAllByConsumerId(consumer.getId());

        return order;
    }

    public String createPDF(String title, String authorName, List<String> headings) throws Exception {
        File xmlFile = new File("src/main/resources/xml/index.xml");
        File xsltFile = new File("src/main/resources/xml/stylesheet.xsl");
        File pdfFile = new File("src/main/resources/index-page/" + title + ".pdf");

        XMLGenerator xmlGenerator = new XMLGenerator(xmlFile);
        xmlGenerator.createXML(title, authorName, headings);

        FopFactory fopFactory = FopFactory.newInstance(new File(".").toURI());
        FOUserAgent foUserAgent = fopFactory.newFOUserAgent();

        try (OutputStream out = new FileOutputStream(pdfFile)) {
            Fop fop = fopFactory.newFop(MimeConstants.MIME_PDF, foUserAgent, out);

            TransformerFactory factory = TransformerFactory.newInstance();
            Transformer transformer = factory.newTransformer(new StreamSource(xsltFile));

            Source src = new StreamSource(xmlFile);
            Result res = new SAXResult(fop.getDefaultHandler());

            transformer.transform(src, res);

            return "src/main/resources/index-page/" + title + ".pdf";
        } catch (TransformerException e) {
            throw new RuntimeException(e);
        }
    }

    public String mergePDF(List<String> chunkPaths, List<String> headings, List<String> coverImagesPath, String title, String indexFile)
    {
        try {
            String tempPdf = "src/main/resources/merged-pdf/temp.pdf";

            PDFMergerUtility mergerUtility = new PDFMergerUtility();
            mergerUtility.setDestinationFileName(tempPdf);

            for(int i = 0; i < chunkPaths.size(); i++)
            {
                mergerUtility.addSource(coverImagesPath.get(i));
                mergerUtility.addSource(chunkPaths.get(i));
            }
            mergerUtility.mergeDocuments(null);


            PDDocument mergedDocument = PDDocument.load(new File(tempPdf));
            PDDocumentOutline documentOutline = new PDDocumentOutline();

            int pageOffset = 0, i = 0;
            for (String chunkPath : chunkPaths) {
                PDDocument inputDocument = PDDocument.load(new File(chunkPath));
                int noOfPages = inputDocument.getNumberOfPages();

                PDOutlineItem bookmark = new PDOutlineItem();
                bookmark.setTitle((i + 1)+ ". " + headings.get(i++));
                PDPageDestination pageDestination = new PDPageFitDestination();
                pageDestination.setPage(mergedDocument.getPage(pageOffset));
                bookmark.setDestination(pageDestination);

                documentOutline.addLast(bookmark);

                pageOffset += noOfPages + 1; // adding 1 for cover-image

                inputDocument.close();
            }

            mergedDocument.getDocumentCatalog().setDocumentOutline(documentOutline);
            mergedDocument.save(tempPdf);
            mergedDocument.close();

            System.out.println("PDFs merged and bookmarks added successfully!");


            PDFMergerUtility mergerUtility1 = new PDFMergerUtility();
            mergerUtility1.setDestinationFileName("src/main/resources/merged-pdf/" + title + ".pdf");
            mergerUtility1.addSource(indexFile);
            mergerUtility1.addSource(tempPdf);
            mergerUtility1.mergeDocuments(null);

            return "src/main/resources/merged-pdf/" + title + ".pdf";
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }

    public BookByIdResponse BookById(int bookId) {
        List<Chunk>chunkList=listAllChunks(bookId);
        Book book = bookRepo.findByBid(bookId);
        Publisher pub=publisherRepo.findById(book.getPubId()).orElse(null);
        BookByIdResponse br = new BookByIdResponse();
        br.setBid(book.getBid());
        br.setBkName(book.getBkName());
        br.setBkDesc(book.getBkDesc());
        br.setBookPrice(book.getBookPrice());
        br.setBkLocalPath(book.getBkLocalPath());
        br.setBkS3CoverImagePath(book.getBkS3CoverImagePath());
        br.setBkS3Path(book.getBkS3Path());
        br.setPublisher(pub.getFirstName());
        br.setChunks(chunkList);

        return br;
    }

    public Chunk addToCart(int chunkId, String email) {
        Consumer consumer = consumerRepo.findByEmail(email);
        Cart cart = new Cart();
        cart.setChunkId(chunkId);
        cart.setConsumerId(consumer.getId());
        cartRepo.save(cart);

        Chunk chunk = chunkRepo.findById(chunkId).orElse(null);
        return chunk;
    }

    public List<Chunk> viewCart(String email) {
        Consumer consumer = consumerRepo.findByEmail(email);
        List<Chunk> chunkList = new ArrayList<>();
        List<Cart> cartList = cartRepo.findAllByConsumerId(consumer.getId());

        for (Cart cart : cartList) {
            Chunk chunk = chunkRepo.findById(cart.getChunkId()).orElse(null);
            chunkList.add(chunk);
        }

        return chunkList;
    }

    @Transactional
    public int removeFromCart(int chunkId, String email) {
        Consumer consumer = consumerRepo.findByEmail(email);
        cartRepo.deleteAllByChunkId(chunkId);
        return cartRepo.findAllByConsumerId(consumer.getId()).size();
    }

    public List<Order> myOrder(String email) {
        Consumer consumer = consumerRepo.findByEmail(email);
        return orderRepo.findAllByConsumerId(consumer.getId());
    }
}
