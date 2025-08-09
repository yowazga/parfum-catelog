package com.cataloghakim.perfume.repository;

import com.cataloghakim.perfume.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    Optional<Category> findByName(String name);
    
    boolean existsByName(String name);
    
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.brands b LEFT JOIN FETCH b.perfumes")
    List<Category> findAllWithBrandsAndPerfumes();
    
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.brands WHERE c.id = :id")
    Optional<Category> findByIdWithBrands(@Param("id") Long id);
    
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.brands b LEFT JOIN FETCH b.perfumes WHERE c.id = :id")
    Optional<Category> findByIdWithBrandsAndPerfumes(@Param("id") Long id);
}
