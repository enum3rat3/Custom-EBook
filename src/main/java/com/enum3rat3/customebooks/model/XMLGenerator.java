package com.enum3rat3.customebooks.model;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.*;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.*;
import java.util.List;

public class XMLGenerator {
    private File file;
    private DocumentBuilder builder;

    public XMLGenerator(File file) throws ParserConfigurationException {
        this.file = file;
        builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
    }

    public void createXML(String title, String author, List<String> headings) throws TransformerException, IOException {
        Document doc = builder.newDocument();


        Element root = doc.createElement("doc");
        doc.appendChild(root);

        // Title Tag
        Element titleTag = doc.createElement("title");
        titleTag.appendChild(doc.createTextNode(title));
        root.appendChild(titleTag);

        // Author Tag
        Element authorTag = doc.createElement("author");
        authorTag.appendChild(doc.createTextNode(author));
        root.appendChild(authorTag);

        // Content Tag
        Element contextTag = doc.createElement("content");
        root.appendChild(contextTag);

        for (String heading : headings) {
            Element headingTag = doc.createElement("heading");
            headingTag.appendChild(doc.createTextNode(heading));
            contextTag.appendChild(headingTag);

            String bookText = getText(heading);
            Element bookTextTag = doc.createElement("bookText");
            bookTextTag.appendChild(doc.createTextNode(bookText));
            contextTag.appendChild(bookTextTag);
        }

        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
        transformer.setOutputProperty(OutputKeys.INDENT, "yes");
        DOMSource source = new DOMSource(doc);
        StreamResult result = new StreamResult(file);
        transformer.transform(source, result);
    }

    public  String sanitizeXML(String text) {
        if (text == null) {
            return "";
        }
        return text.replaceAll("[\\x00-\\x1F\\x7F]", "");
    }

    public String getText(String heading) throws IOException {
        String path = "src/main/resources/chunks/" + heading + ".pdf";
        File file = new File(path);

        PDDocument document = Loader.loadPDF(file);
        PDFTextStripper stripper = new PDFTextStripper();

        return sanitizeXML(stripper.getText(document));
    }
}