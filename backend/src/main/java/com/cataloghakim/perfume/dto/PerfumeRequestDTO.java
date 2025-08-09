package com.cataloghakim.perfume.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;

public class PerfumeRequestDTO {
    
    @NotBlank(message = "Perfume name is required")
    @Size(min = 2, max = 100, message = "Perfume name must be between 2 and 100 characters")
    private String name;
    
    @NotNull(message = "Perfume number is required")
    @Min(value = 1, message = "Perfume number must be at least 1")
    private Integer number;
    
    @NotNull(message = "Brand ID is required")
    private Long brandId;
    
    // Constructors
    public PerfumeRequestDTO() {}
    
    public PerfumeRequestDTO(String name, Integer number, Long brandId) {
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
}
