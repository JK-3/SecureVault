package com.janhawi.securevault.repository;


import com.janhawi.securevault.model.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
     List<FileMetadata> findByUploadedBy(String uploadedBy);
     void deleteByFileKey(String fileKey);
}

