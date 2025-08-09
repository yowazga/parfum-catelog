package com.cataloghakim.perfume.service;

import com.cataloghakim.perfume.dto.CategoryDTO;
import com.cataloghakim.perfume.dto.CategoryRequestDTO;
import com.cataloghakim.perfume.entity.Category;
import com.cataloghakim.perfume.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAllWithBrandsAndPerfumes();
        return categories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<CategoryDTO> getCategoryById(Long id) {
        return categoryRepository.findByIdWithBrandsAndPerfumes(id)
                .map(this::convertToDTO);
    }
    
    public CategoryDTO createCategory(CategoryRequestDTO requestDTO) {
        if (categoryRepository.existsByName(requestDTO.getName())) {
            throw new RuntimeException("Category with name '" + requestDTO.getName() + "' already exists");
        }
        
        Category category = new Category();
        category.setName(requestDTO.getName());
        category.setDescription(requestDTO.getDescription());
        category.setColor(requestDTO.getColor());
        
        Category savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }
    
    public Optional<CategoryDTO> updateCategory(Long id, CategoryRequestDTO requestDTO) {
        Optional<Category> existingCategory = categoryRepository.findById(id);
        if (existingCategory.isEmpty()) {
            return Optional.empty();
        }
        
        Category category = existingCategory.get();
        
        // Check if name is being changed and if new name already exists
        if (!category.getName().equals(requestDTO.getName()) && 
            categoryRepository.existsByName(requestDTO.getName())) {
            throw new RuntimeException("Category with name '" + requestDTO.getName() + "' already exists");
        }
        
        category.setName(requestDTO.getName());
        category.setDescription(requestDTO.getDescription());
        category.setColor(requestDTO.getColor());
        
        Category updatedCategory = categoryRepository.save(category);
        return Optional.of(convertToDTO(updatedCategory));
    }
    
    public boolean deleteCategory(Long id) {
        Optional<Category> category = categoryRepository.findByIdWithBrands(id);
        if (category.isEmpty()) {
            return false;
        }
        
        // Check if category has brands
        if (!category.get().getBrands().isEmpty()) {
            throw new RuntimeException("Cannot delete category with existing brands");
        }
        
        categoryRepository.deleteById(id);
        return true;
    }
    
    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setColor(category.getColor());
        
        // Convert brands to DTOs if they exist
        if (category.getBrands() != null && !category.getBrands().isEmpty()) {
            // This would need BrandService to convert brands to DTOs
            // For now, we'll leave it as null and handle it in the controller
            dto.setBrands(null);
        }
        
        return dto;
    }
}
