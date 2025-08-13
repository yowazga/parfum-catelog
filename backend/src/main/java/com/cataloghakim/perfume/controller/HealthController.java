package com.cataloghakim.perfume.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "Perfume Catalog API",
            "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }
    
    @GetMapping("/api/health")
    public ResponseEntity<Map<String, String>> apiHealth() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "Perfume Catalog API",
            "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }
}
