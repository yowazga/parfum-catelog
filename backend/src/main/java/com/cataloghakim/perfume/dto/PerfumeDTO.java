package com.cataloghakim.perfume.dto;

public class PerfumeDTO {
    
    private Long id;
    private String name;
    private Integer number;
    private Long brandId;
    private String brandName;
    private Long categoryId;
    private String categoryName;
    
    // Constructors
    public PerfumeDTO() {}
    
    public PerfumeDTO(Long id, String name, Integer number, Long brandId, String brandName) {
        this.id = id;
        this.name = name;
        this.number = number;
        this.brandId = brandId;
        this.brandName = brandName;
    }
    
    public PerfumeDTO(Long id, String name, Integer number, Long brandId, String brandName, Long categoryId, String categoryName) {
        this.id = id;
        this.name = name;
        this.number = number;
        this.brandId = brandId;
        this.brandName = brandName;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
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
    
    public Integer getNumber() {
        return number;
    }
    
    public void setNumber(Integer number) {
        this.number = number;
    }
    
    public Long getBrandId() {
        return brandId;
    }
    
    public void setBrandId(Long brandId) {
        this.brandId = brandId;
    }
    
    public String getBrandName() {
        return brandName;
    }
    
    public void setBrandName(String brandName) {
        this.brandName = brandName;
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
}
