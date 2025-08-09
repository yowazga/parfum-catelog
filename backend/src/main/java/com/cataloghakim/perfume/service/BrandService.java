package com.cataloghakim.perfume.service;

import com.cataloghakim.perfume.dto.BrandDTO;
import com.cataloghakim.perfume.dto.BrandRequestDTO;
import com.cataloghakim.perfume.entity.Brand;
import com.cataloghakim.perfume.entity.Category;
import com.cataloghakim.perfume.repository.BrandRepository;
import com.cataloghakim.perfume.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BrandService {
    
    @Autowired
    private BrandRepository brandRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    public List<BrandDTO> getAllBrands() {
        List<Brand> brands = brandRepository.findAllWithPerfumes();
        return brands.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<BrandDTO> getBrandsByCategory(Long categoryId) {
        List<Brand> brands = brandRepository.findByCategoryIdWithPerfumes(categoryId);
        return brands.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<BrandDTO> getBrandById(Long id) {
        return brandRepository.findByIdWithPerfumes(id)
                .map(this::convertToDTO);
    }
    
    public BrandDTO createBrand(BrandRequestDTO requestDTO) {
        // Validate category exists
        Category category = categoryRepository.findById(requestDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + requestDTO.getCategoryId()));
        
        // Check if brand name already exists in this category
        if (brandRepository.existsByNameAndCategoryId(requestDTO.getName(), requestDTO.getCategoryId())) {
            throw new RuntimeException("Brand with name '" + requestDTO.getName() + "' already exists in this category");
        }
        
        Brand brand = new Brand();
        brand.setName(requestDTO.getName());
        brand.setDescription(requestDTO.getDescription());
        brand.setImageUrl(requestDTO.getImageUrl());
        brand.setCategory(category);
        
        Brand savedBrand = brandRepository.save(brand);
        return convertToDTO(savedBrand);
    }
    
    public Optional<BrandDTO> updateBrand(Long id, BrandRequestDTO requestDTO) {
        Optional<Brand> existingBrand = brandRepository.findById(id);
        if (existingBrand.isEmpty()) {
            return Optional.empty();
        }
        
        Brand brand = existingBrand.get();
        
        // Validate category exists
        Category category = categoryRepository.findById(requestDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + requestDTO.getCategoryId()));
        
        // Check if brand name already exists in the new category (if category changed)
        if (!brand.getCategory().getId().equals(requestDTO.getCategoryId()) &&
            brandRepository.existsByNameAndCategoryId(requestDTO.getName(), requestDTO.getCategoryId())) {
            throw new RuntimeException("Brand with name '" + requestDTO.getName() + "' already exists in this category");
        }
        
        brand.setName(requestDTO.getName());
        brand.setDescription(requestDTO.getDescription());
        brand.setImageUrl(requestDTO.getImageUrl());
        brand.setCategory(category);
        
        Brand updatedBrand = brandRepository.save(brand);
        return Optional.of(convertToDTO(updatedBrand));
    }
    
    public boolean deleteBrand(Long id) {
        Optional<Brand> brand = brandRepository.findByIdWithPerfumes(id);
        if (brand.isEmpty()) {
            return false;
        }
        
        // Check if brand has perfumes
        if (!brand.get().getPerfumes().isEmpty()) {
            throw new RuntimeException("Cannot delete brand with existing perfumes");
        }
        
        brandRepository.deleteById(id);
        return true;
    }
    
    private BrandDTO convertToDTO(Brand brand) {
        BrandDTO dto = new BrandDTO();
        dto.setId(brand.getId());
        dto.setName(brand.getName());
        dto.setDescription(brand.getDescription());
        dto.setImageUrl(brand.getImageUrl());
        dto.setCategoryId(brand.getCategory().getId());
        dto.setCategoryName(brand.getCategory().getName());
        
        // Convert perfumes to DTOs if they exist
        if (brand.getPerfumes() != null && !brand.getPerfumes().isEmpty()) {
            // This would need PerfumeService to convert perfumes to DTOs
            // For now, we'll leave it as null and handle it in the controller
            dto.setPerfumes(null);
        }
        
        return dto;
    }
}
