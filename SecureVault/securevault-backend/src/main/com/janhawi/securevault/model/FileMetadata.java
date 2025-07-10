package com.janhawi.securevault.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileKey;         // Unique key stored in S3
    private String originalName;    // Original uploaded filename
    private String contentType;     // MIME type
    private Long size;              // Size in bytes
    private String uploadedBy;      // Email or username of uploader
    private Instant uploadedAt;     // Timestamp
}


