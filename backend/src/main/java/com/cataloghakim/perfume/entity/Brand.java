package com.cataloghakim.perfume.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "brands")
public class Brand {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Brand name is required")
    @Size(min = 2, max = 100, message = "Brand name must be between 2 and 100 characters")
    @Column(nullable = false)
    private String name;
    
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
    
    private String imageUrl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @NotNull(message = "Category is required")
    private Category category;
    
    @OneToMany(mappedBy = "brand", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Perfume> perfumes = new ArrayList<>();
    
    // Constructors
    public Brand() {}
    
    public Brand(String name, String description, String imageUrl, Category category) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.category = category;
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
    
    public Category getCategory() {
        return category;
    }
    
    public void setCategory(Category category) {
        this.category = category;
    }
    
    public List<Perfume> getPerfumes() {
        return perfumes;
    }
    
    public void setPerfumes(List<Perfume> perfumes) {
        this.perfumes = perfumes;
    }
    
    // Helper methods
    public void addPerfume(Perfume perfume) {
        perfumes.add(perfume);
        perfume.setBrand(this);
    }
    
    public void removePerfume(Perfume perfume) {
        perfumes.remove(perfume);
        perfume.setBrand(null);
    }
}
