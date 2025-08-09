package com.cataloghakim.perfume.controller;

import com.cataloghakim.perfume.dto.BrandDTO;
import com.cataloghakim.perfume.dto.BrandRequestDTO;
import com.cataloghakim.perfume.service.BrandService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "*")
public class BrandController {
    
    @Autowired
    private BrandService brandService;
    
    @GetMapping
    public ResponseEntity<List<BrandDTO>> getAllBrands() {
        List<BrandDTO> brands = brandService.getAllBrands();
        return ResponseEntity.ok(brands);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BrandDTO> getBrandById(@PathVariable Long id) {
        Optional<BrandDTO> brand = brandService.getBrandById(id);
        return brand.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<BrandDTO>> getBrandsByCategory(@PathVariable Long categoryId) {
        List<BrandDTO> brands = brandService.getBrandsByCategory(categoryId);
        return ResponseEntity.ok(brands);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BrandDTO> createBrand(@Valid @RequestBody BrandRequestDTO brandRequest) {
        try {
            BrandDTO createdBrand = brandService.createBrand(brandRequest);
            return ResponseEntity.ok(createdBrand);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BrandDTO> updateBrand(@PathVariable Long id, @Valid @RequestBody BrandRequestDTO brandRequest) {
        Optional<BrandDTO> updatedBrand = brandService.updateBrand(id, brandRequest);
        return updatedBrand.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBrand(@PathVariable Long id) {
        try {
            boolean deleted = brandService.deleteBrand(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/public")
    @RequestMapping("/api/public/brands")
    public ResponseEntity<List<BrandDTO>> getPublicBrands() {
        List<BrandDTO> brands = brandService.getAllBrands();
        return ResponseEntity.ok(brands);
    }
    
    @GetMapping("/public/category/{categoryId}")
    @RequestMapping("/api/public/brands/category/{categoryId}")
    public ResponseEntity<List<BrandDTO>> getPublicBrandsByCategory(@PathVariable Long categoryId) {
        List<BrandDTO> brands = brandService.getBrandsByCategory(categoryId);
        return ResponseEntity.ok(brands);
    }
}
