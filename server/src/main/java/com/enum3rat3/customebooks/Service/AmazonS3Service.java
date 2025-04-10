package com.enum3rat3.customebooks.Service;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
@Getter
public class AmazonS3Service {
    private AmazonS3 amazonS3;

    @Value("${aws.s3.endPointURL}")
    private String endpointUrl;

    @Value("${aws.s3.bucketName}")
    private String bucketName;

    @Value("${aws.s3.accessKey}")
    private String accessKey;

    @Value("${aws.s3.secretKey}")
    private String secretKey;

    @PostConstruct
    private void initializeAmazon() {
        AWSCredentials credentials = new BasicAWSCredentials(this.accessKey, this.secretKey);
        this.amazonS3 = new AmazonS3Client(credentials);
    }

    public void uploadBook(MultipartFile multipartFile, String fileName) throws IOException
    {
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, fileName + ".pdf", multipartFile.getInputStream(), null).withCannedAcl(CannedAccessControlList.PublicRead);
        PutObjectResult putObjectResult = amazonS3.putObject(putObjectRequest);
    }

    public void uploadChunk(File file, String fileName) throws IOException
    {
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, fileName, file).withCannedAcl(CannedAccessControlList.PublicRead);
        PutObjectResult putObjectResult = amazonS3.putObject(putObjectRequest);
    }

    public void deleteBookAndChunk(String path) {
        String name = path.substring(path.lastIndexOf("/") + 1);
        System.out.println(name);
        amazonS3.deleteObject(new DeleteObjectRequest(bucketName, name));

    }
}
