package com.cataloghakim.perfume.controller;

import com.cataloghakim.perfume.dto.PerfumeDTO;
import com.cataloghakim.perfume.dto.PerfumeRequestDTO;
import com.cataloghakim.perfume.dto.SearchRequestDTO;
import com.cataloghakim.perfume.service.PerfumeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class PerfumeController {
    
    @Autowired
    private PerfumeService perfumeService;
    
    @GetMapping("/perfumes")
    public ResponseEntity<List<PerfumeDTO>> getAllPerfumes() {
        List<PerfumeDTO> perfumes = perfumeService.getAllPerfumes();
        return ResponseEntity.ok(perfumes);
    }
    
    @GetMapping("/perfumes/{id}")
    public ResponseEntity<PerfumeDTO> getPerfumeById(@PathVariable Long id) {
        Optional<PerfumeDTO> perfume = perfumeService.getPerfumeById(id);
        return perfume.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/perfumes/brand/{brandId}")
    public ResponseEntity<List<PerfumeDTO>> getPerfumesByBrand(@PathVariable Long brandId) {
        List<PerfumeDTO> perfumes = perfumeService.getPerfumesByBrand(brandId);
        return ResponseEntity.ok(perfumes);
    }
    
    @GetMapping("/perfumes/category/{categoryId}")
    public ResponseEntity<List<PerfumeDTO>> getPerfumesByCategory(@PathVariable Long categoryId) {
        List<PerfumeDTO> perfumes = perfumeService.getPerfumesByCategory(categoryId);
        return ResponseEntity.ok(perfumes);
    }
    
    @PostMapping("/perfumes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PerfumeDTO> createPerfume(@Valid @RequestBody PerfumeRequestDTO perfumeRequest) {
        try {
            PerfumeDTO createdPerfume = perfumeService.createPerfume(perfumeRequest);
            return ResponseEntity.ok(createdPerfume);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/perfumes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PerfumeDTO> updatePerfume(@PathVariable Long id, @Valid @RequestBody PerfumeRequestDTO perfumeRequest) {
        Optional<PerfumeDTO> updatedPerfume = perfumeService.updatePerfume(id, perfumeRequest);
        return updatedPerfume.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/perfumes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePerfume(@PathVariable Long id) {
        boolean deleted = perfumeService.deletePerfume(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/search")
    public ResponseEntity<List<PerfumeDTO>> searchAndFilter(@RequestBody SearchRequestDTO searchRequest) {
        List<PerfumeDTO> perfumes = perfumeService.searchAndFilter(searchRequest);
        return ResponseEntity.ok(perfumes);
    }
    
    @GetMapping("/search/{searchTerm}")
    public ResponseEntity<List<PerfumeDTO>> searchByNameOrBrand(@PathVariable String searchTerm) {
        List<PerfumeDTO> perfumes = perfumeService.searchByNameOrBrand(searchTerm);
        return ResponseEntity.ok(perfumes);
    }
    
    @GetMapping("/brand-name/{brandName}")
    public ResponseEntity<List<PerfumeDTO>> findByBrandName(@PathVariable String brandName) {
        List<PerfumeDTO> perfumes = perfumeService.findByBrandName(brandName);
        return ResponseEntity.ok(perfumes);
    }
    
    @GetMapping("/number-range")
    public ResponseEntity<List<PerfumeDTO>> findByNumberRange(
            @RequestParam Integer minNumber,
            @RequestParam Integer maxNumber) {
        List<PerfumeDTO> perfumes = perfumeService.findByNumberRange(minNumber, maxNumber);
        return ResponseEntity.ok(perfumes);
    }
    
    // Public endpoints
    @GetMapping("/public/perfumes")
    public ResponseEntity<List<PerfumeDTO>> getPublicPerfumes() {
        List<PerfumeDTO> perfumes = perfumeService.getAllPerfumes();
        return ResponseEntity.ok(perfumes);
    }
    
    @GetMapping("/public/perfumes/brand/{brandId}")
    public ResponseEntity<List<PerfumeDTO>> getPublicPerfumesByBrand(@PathVariable Long brandId) {
        List<PerfumeDTO> perfumes = perfumeService.getPerfumesByBrand(brandId);
        return ResponseEntity.ok(perfumes);
    }
    
    @GetMapping("/public/perfumes/category/{categoryId}")
    public ResponseEntity<List<PerfumeDTO>> getPublicPerfumesByCategory(@PathVariable Long categoryId) {
        List<PerfumeDTO> perfumes = perfumeService.getPerfumesByCategory(categoryId);
        return ResponseEntity.ok(perfumes);
    }
    
    @PostMapping("/public/perfumes/search")
    public ResponseEntity<List<PerfumeDTO>> publicSearchAndFilter(@RequestBody SearchRequestDTO searchRequest) {
        List<PerfumeDTO> perfumes = perfumeService.searchAndFilter(searchRequest);
        return ResponseEntity.ok(perfumes);
    }
}
