package com.cataloghakim.perfume.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Category name is required")
    @Size(min = 2, max = 50, message = "Category name must be between 2 and 50 characters")
    @Column(unique = true, nullable = false)
    private String name;
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    @NotBlank(message = "Color is required")
    @Size(max = 20, message = "Color cannot exceed 20 characters")
    private String color;
    
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Brand> brands = new ArrayList<>();
    
    // Constructors
    public Category() {}
    
    public Category(String name, String description, String color) {
        this.name = name;
        this.description = description;
        this.color = color;
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
    
    public List<Brand> getBrands() {
        return brands;
    }
    
    public void setBrands(List<Brand> brands) {
        this.brands = brands;
    }
    
    // Helper methods
    public void addBrand(Brand brand) {
        brands.add(brand);
        brand.setCategory(this);
    }
    
    public void removeBrand(Brand brand) {
        brands.remove(brand);
        brand.setCategory(null);
    }
}
