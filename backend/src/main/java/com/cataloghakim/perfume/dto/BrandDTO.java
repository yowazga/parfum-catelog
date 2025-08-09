package com.cataloghakim.perfume.dto;

import java.util.List;

public class BrandDTO {
    
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
    private List<PerfumeDTO> perfumes;
    
    // Constructors
    public BrandDTO() {}
    
    public BrandDTO(Long id, String name, String description, String imageUrl, Long categoryId, String categoryName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }
    
    public BrandDTO(Long id, String name, String description, String imageUrl, Long categoryId, String categoryName, List<PerfumeDTO> perfumes) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.perfumes = perfumes;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public Long getCategoryId() {
        return categoryId;
    }
    
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
    
    public String getCategoryName() {
        return categoryName;
    }
    
    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
    
    public List<PerfumeDTO> getPerfumes() {
        return perfumes;
    }
    
    public void setPerfumes(List<PerfumeDTO> perfumes) {
        this.perfumes = perfumes;
    }
}
