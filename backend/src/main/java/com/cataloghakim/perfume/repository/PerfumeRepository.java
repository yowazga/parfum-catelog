package com.cataloghakim.perfume.repository;

import com.cataloghakim.perfume.entity.Perfume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PerfumeRepository extends JpaRepository<Perfume, Long> {
    
    List<Perfume> findByBrandId(Long brandId);
    
    List<Perfume> findByBrandCategoryId(Long categoryId);
    
    @Query("SELECT p FROM Perfume p JOIN p.brand b WHERE " +
           "(:searchTerm IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "(:brandName IS NULL OR LOWER(b.name) LIKE LOWER(CONCAT('%', :brandName, '%'))) AND " +
           "(:minNumber IS NULL OR p.number >= :minNumber) AND " +
           "(:maxNumber IS NULL OR p.number <= :maxNumber)")
    List<Perfume> searchAndFilter(@Param("searchTerm") String searchTerm,
                                  @Param("brandName") String brandName,
                                  @Param("minNumber") Integer minNumber,
                                  @Param("maxNumber") Integer maxNumber);
    
    @Query("SELECT p FROM Perfume p JOIN p.brand b WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Perfume> searchByNameOrBrand(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT p FROM Perfume p JOIN p.brand b WHERE b.name = :brandName")
    List<Perfume> findByBrandName(@Param("brandName") String brandName);
    
    @Query("SELECT p FROM Perfume p WHERE p.number BETWEEN :minNumber AND :maxNumber")
    List<Perfume> findByNumberRange(@Param("minNumber") Integer minNumber, @Param("maxNumber") Integer maxNumber);
}
