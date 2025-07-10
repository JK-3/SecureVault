package com.janhawi.securevault.controller;

import com.janhawi.securevault.model.FileMetadata;
import com.janhawi.securevault.repository.FileMetadataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import com.janhawi.securevault.service.S3Service;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class S3Controller {

    private final S3Service s3Service;

    private final FileMetadataRepository fileMetadataRepository;
    // Only ADMIN can upload files
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String key = s3Service.uploadFile(file);
            return ResponseEntity.ok("File uploaded successfully with key: " + key);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<String>> listFiles() {
        try {
            List<String> files = s3Service.listAllFiles();
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Delete a file by key (ADMIN only)
    @DeleteMapping("/delete/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteFile(@PathVariable String key) {
        try {
            s3Service.deleteFile(key);
            return ResponseEntity.ok("File deleted successfully: " + key);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to delete file: " + e.getMessage());
        }
    }

     // Admin can view all uploaded files
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<FileMetadata> getAllFiles() {
        return fileMetadataRepository.findAll();
    }

    // Any user can view their own uploaded files
    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public List<FileMetadata> getMyFiles() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return fileMetadataRepository.findByUploadedBy(userEmail);
    }


    // Any authenticated user can download files (customize as needed)
    @GetMapping("/download/{key}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String key) {
        try {
            byte[] fileBytes = s3Service.downloadFile(key);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + key)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(fileBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
}
