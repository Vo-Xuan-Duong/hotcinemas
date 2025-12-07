package com.example.hotcinemas_be.repositorys;

import com.example.hotcinemas_be.models.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog,Long> {
}
