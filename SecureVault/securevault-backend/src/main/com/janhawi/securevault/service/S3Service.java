package com.janhawi.securevault.service;

import com.janhawi.securevault.model.FileMetadata;
import com.janhawi.securevault.repository.FileMetadataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;
    private final FileMetadataRepository fileMetadataRepository;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    /**
     * Checks if the bucket already exists in S3.
     */
    public boolean bucketExists(String bucketName) {
        try {
            ListBucketsResponse response = s3Client.listBuckets();
            return response.buckets().stream()
                    .anyMatch(b -> b.name().equals(bucketName));
        } catch (S3Exception e) {
            System.err.println("Error checking bucket: " + e.awsErrorDetails().errorMessage());
            return false;
        }
    }

    /**
     * Creates the S3 bucket if it doesn't already exist.
     */
    public void createBucketIfNotExists() {
        if (!bucketExists(bucketName)) {
            CreateBucketRequest createBucketRequest = CreateBucketRequest.builder()
                    .bucket(bucketName)
                    .build();
            s3Client.createBucket(createBucketRequest);
            System.out.println("✅ Bucket created: " + bucketName);
        } else {
            System.out.println("ℹ️ Bucket already exists: " + bucketName);
        }
    }
    /**
     * Uploads file to S3 with a unique key and stores metadata in DB.
     */
    public String uploadFile(MultipartFile file) throws IOException {
        String key = UUID.randomUUID() + "_" + file.getOriginalFilename();

        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putRequest, RequestBody.fromBytes(file.getBytes()));

        FileMetadata metadata = FileMetadata.builder()
                .fileKey(key)
                .originalName(file.getOriginalFilename())
                .contentType(file.getContentType())
                .size(file.getSize())
                .uploadedBy(getCurrentUserEmail())
                .uploadedAt(Instant.now())
                .build();

        fileMetadataRepository.save(metadata);
        return key;
    }

    /**
     * Downloads a file from S3 and returns it as byte[].
     */
    public byte[] downloadFile(String key) throws IOException {
        Path tempFile = Files.createTempFile("s3-download-", key);

        s3Client.getObject(
                GetObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build(),
                tempFile
        );

        return Files.readAllBytes(tempFile);
    }


    /**
     * Lists all file keys in the configured S3 bucket.
     */
    public List<String> listAllFiles() {
        ListObjectsV2Request request = ListObjectsV2Request.builder()
                .bucket(bucketName)
                .build();

        ListObjectsV2Response response = s3Client.listObjectsV2(request);
        return response.contents().stream()
                .map(S3Object::key)
                .collect(Collectors.toList());
    }

    /**
     * Deletes a file from S3 using its key.
     */
    public void deleteFile(String key) {
        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        fileMetadataRepository.deleteByFileKey(key);
        s3Client.deleteObject(deleteRequest);
    }

    /**
     * Gets current logged-in user's email from Spring Security context.
     */
    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
