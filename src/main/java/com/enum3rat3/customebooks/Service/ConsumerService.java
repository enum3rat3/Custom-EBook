package com.enum3rat3.customebooks.Service;

import com.enum3rat3.customebooks.Repo.BookRepo;
import com.enum3rat3.customebooks.Repo.ChunkRepo;
import com.enum3rat3.customebooks.model.Book;
import com.enum3rat3.customebooks.model.Chunk;
import com.enum3rat3.customebooks.model.XMLGenerator;
import org.apache.fop.apps.*;

import javax.xml.transform.*;
import javax.xml.transform.sax.SAXResult;
import javax.xml.transform.stream.StreamSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

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


    public int generateBook(String newTitle, String authorName, List<Integer> chunkIds) throws Exception {
        int totalCost = 0;
        List<String> headings = new ArrayList<>();
        for (Integer chunkId : chunkIds) {
            Chunk chunk = chunkRepo.findById(chunkId).orElse(null);
            if (chunk != null) {
                String heading = chunk.getChS3Path().split("/")[1].split("\\.")[0];
                headings.add(heading);
                totalCost += chunk.getChPrice();
            }
        }

        createPdf(newTitle, authorName, headings);
        return totalCost;
    }

    public void createPdf(String title, String authorName, List<String> headings) throws Exception {
        File xmlFile = new File("src/main/resources/xml/test.xml");
        File xsltFile = new File("src/main/resources/xml/stylesheet.xsl");
        File pdfFile = new File("src/main/resources/merged-pdf/" + title + ".pdf");

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
        } catch (TransformerException e) {
            throw new RuntimeException(e);
        }
    }}
