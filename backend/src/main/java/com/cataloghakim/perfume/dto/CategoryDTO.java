package com.cataloghakim.perfume.dto;

import java.util.List;

public class CategoryDTO {
    
    private Long id;
    private String name;
    private String description;
    private String color;
    private List<BrandDTO> brands;
    
    // Constructors
    public CategoryDTO() {}
    
    public CategoryDTO(Long id, String name, String description, String color) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.color = color;
    }
    
    public CategoryDTO(Long id, String name, String description, String color, List<BrandDTO> brands) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.color = color;
        this.brands = brands;
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
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    public List<BrandDTO> getBrands() {
        return brands;
    }
    
    public void setBrands(List<BrandDTO> brands) {
        this.brands = brands;
    }
}
