package com.cataloghakim.perfume.service;

import com.cataloghakim.perfume.dto.PerfumeDTO;
import com.cataloghakim.perfume.dto.PerfumeRequestDTO;
import com.cataloghakim.perfume.dto.SearchRequestDTO;
import com.cataloghakim.perfume.entity.Perfume;
import com.cataloghakim.perfume.entity.Brand;
import com.cataloghakim.perfume.repository.PerfumeRepository;
import com.cataloghakim.perfume.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PerfumeService {
    
    @Autowired
    private PerfumeRepository perfumeRepository;
    
    @Autowired
    private BrandRepository brandRepository;
    
    public List<PerfumeDTO> getAllPerfumes() {
        List<Perfume> perfumes = perfumeRepository.findAll();
        return perfumes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PerfumeDTO> getPerfumesByBrand(Long brandId) {
        List<Perfume> perfumes = perfumeRepository.findByBrandId(brandId);
        return perfumes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PerfumeDTO> getPerfumesByCategory(Long categoryId) {
        List<Perfume> perfumes = perfumeRepository.findByBrandCategoryId(categoryId);
        return perfumes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<PerfumeDTO> getPerfumeById(Long id) {
        return perfumeRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    public PerfumeDTO createPerfume(PerfumeRequestDTO requestDTO) {
        // Validate brand exists
        Brand brand = brandRepository.findById(requestDTO.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found with ID: " + requestDTO.getBrandId()));
        
        Perfume perfume = new Perfume();
        perfume.setName(requestDTO.getName());
        perfume.setNumber(requestDTO.getNumber());
        perfume.setBrand(brand);
        
        Perfume savedPerfume = perfumeRepository.save(perfume);
        return convertToDTO(savedPerfume);
    }
    
    public Optional<PerfumeDTO> updatePerfume(Long id, PerfumeRequestDTO requestDTO) {
        Optional<Perfume> existingPerfume = perfumeRepository.findById(id);
        if (existingPerfume.isEmpty()) {
            return Optional.empty();
        }
        
        Perfume perfume = existingPerfume.get();
        
        // Validate brand exists
        Brand brand = brandRepository.findById(requestDTO.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found with ID: " + requestDTO.getBrandId()));
        
        perfume.setName(requestDTO.getName());
        perfume.setNumber(requestDTO.getNumber());
        perfume.setBrand(brand);
        
        Perfume updatedPerfume = perfumeRepository.save(perfume);
        return Optional.of(convertToDTO(updatedPerfume));
    }
    
    public boolean deletePerfume(Long id) {
        if (!perfumeRepository.existsById(id)) {
            return false;
        }
        
        perfumeRepository.deleteById(id);
        return true;
    }
    
    public List<PerfumeDTO> searchAndFilter(SearchRequestDTO searchRequest) {
        List<Perfume> perfumes = perfumeRepository.searchAndFilter(
            searchRequest.getSearchTerm(),
            searchRequest.getBrandName(),
            searchRequest.getMinNumber(),
            searchRequest.getMaxNumber()
        );
        
        return perfumes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PerfumeDTO> searchByNameOrBrand(String searchTerm) {
        List<Perfume> perfumes = perfumeRepository.searchByNameOrBrand(searchTerm);
        return perfumes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PerfumeDTO> findByBrandName(String brandName) {
        List<Perfume> perfumes = perfumeRepository.findByBrandName(brandName);
        return perfumes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PerfumeDTO> findByNumberRange(Integer minNumber, Integer maxNumber) {
        List<Perfume> perfumes = perfumeRepository.findByNumberRange(minNumber, maxNumber);
        return perfumes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private PerfumeDTO convertToDTO(Perfume perfume) {
        PerfumeDTO dto = new PerfumeDTO();
        dto.setId(perfume.getId());
        dto.setName(perfume.getName());
        dto.setNumber(perfume.getNumber());
        dto.setBrandId(perfume.getBrand().getId());
        dto.setBrandName(perfume.getBrand().getName());
        dto.setCategoryId(perfume.getBrand().getCategory().getId());
        dto.setCategoryName(perfume.getBrand().getCategory().getName());
        
        return dto;
    }
}
