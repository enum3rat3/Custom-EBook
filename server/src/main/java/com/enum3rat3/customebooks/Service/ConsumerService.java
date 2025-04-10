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

import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageDestination;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageFitDestination;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.outline.PDDocumentOutline;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem;
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
        List<Book> books = bookRepo.findAll();
        return books;
    }

    public List<Chunk> listAllChunks(int bookId) {
        List<Chunk> chunks = chunkRepo.findAllByBkId(bookId);
        return chunks;
    }


    public int generateBook(String newTitle, String authorName, List<Integer> chunkIds) throws Exception {
        int totalCost = 0;
        List<String> headings = new ArrayList<>();
        List<String> chunkPath = new ArrayList<>();
        for (Integer chunkId : chunkIds) {
            Chunk chunk = chunkRepo.findById(chunkId).orElse(null);
            if (chunk != null) {
                String heading = chunk.getChS3Path().split("/")[1].split("\\.")[0];
                headings.add(heading);
                chunkPath.add(chunk.getChLocalPath());
                totalCost += chunk.getChPrice();
            }
        }

        String indexFile = createPDF(newTitle, authorName, headings);
        mergePDF(chunkPath, headings, newTitle, indexFile);
        return totalCost;
    }

    public String createPDF(String title, String authorName, List<String> headings) throws Exception {
        File xmlFile = new File("src/main/resources/xml/test.xml");
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

    public static void mergePDF(List<String> chunkPaths, List<String> headings, String title, String indexFile)
    {
        try {
            String tempPdf = "src/main/resources/merged-pdf/temp.pdf";

            PDFMergerUtility mergerUtility = new PDFMergerUtility();
            mergerUtility.setDestinationFileName(tempPdf);
            
            for(String chunkPath: chunkPaths)
            {
                mergerUtility.addSource(chunkPath);
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

                pageOffset += noOfPages;

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

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
