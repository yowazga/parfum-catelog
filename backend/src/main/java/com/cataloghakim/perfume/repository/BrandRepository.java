package com.cataloghakim.perfume.repository;

import com.cataloghakim.perfume.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    
    List<Brand> findByCategoryId(Long categoryId);
    
    Optional<Brand> findByNameAndCategoryId(String name, Long categoryId);
    
    boolean existsByNameAndCategoryId(String name, Long categoryId);
    
    @Query("SELECT b FROM Brand b LEFT JOIN FETCH b.perfumes WHERE b.id = :id")
    Optional<Brand> findByIdWithPerfumes(@Param("id") Long id);
    
    @Query("SELECT b FROM Brand b LEFT JOIN FETCH b.perfumes WHERE b.category.id = :categoryId")
    List<Brand> findByCategoryIdWithPerfumes(@Param("categoryId") Long categoryId);
    
    @Query("SELECT DISTINCT b FROM Brand b LEFT JOIN FETCH b.perfumes")
    List<Brand> findAllWithPerfumes();
}
