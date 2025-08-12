package com.cataloghakim.perfume.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PerfumeRequestDTO {
    
    @NotBlank(message = "Perfume name is required")
    @Size(min = 2, max = 100, message = "Perfume name must be between 2 and 100 characters")
    private String name;
    
    @NotBlank(message = "Perfume number is required")
    @Size(min = 1, max = 20, message = "Perfume number must be between 1 and 20 characters")
    private String number;
    
    @NotNull(message = "Brand ID is required")
    private Long brandId;
    
    // Constructors
    public PerfumeRequestDTO() {}
    
    public PerfumeRequestDTO(String name, String number, Long brandId) {
        this.name = name;
        this.number = number;
        this.brandId = brandId;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getNumber() {
        return number;
    }
    
    public void setNumber(String number) {
        this.number = number;
    }
    
    public Long getBrandId() {
        return brandId;
    }
    
    public void setBrandId(Long brandId) {
        this.brandId = brandId;
    }
}
