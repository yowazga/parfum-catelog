package com.cataloghakim.perfume.dto;

public class SearchRequestDTO {
    
    private String searchTerm;
    private String brandName;
    private Integer minNumber;
    private Integer maxNumber;
    
    // Constructors
    public SearchRequestDTO() {}
    
    public SearchRequestDTO(String searchTerm, String brandName, Integer minNumber, Integer maxNumber) {
        this.searchTerm = searchTerm;
        this.brandName = brandName;
        this.minNumber = minNumber;
        this.maxNumber = maxNumber;
    }
    
    // Getters and Setters
    public String getSearchTerm() {
        return searchTerm;
    }
    
    public void setSearchTerm(String searchTerm) {
        this.searchTerm = searchTerm;
    }
    
    public String getBrandName() {
        return brandName;
    }
    
    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }
    
    public Integer getMinNumber() {
        return minNumber;
    }
    
    public void setMinNumber(Integer minNumber) {
        this.minNumber = minNumber;
    }
    
    public Integer getMaxNumber() {
        return maxNumber;
    }
    
    public void setMaxNumber(Integer maxNumber) {
        this.maxNumber = maxNumber;
    }
}
