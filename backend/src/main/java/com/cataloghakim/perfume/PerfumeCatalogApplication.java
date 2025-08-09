package com.cataloghakim.perfume;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
public class PerfumeCatalogApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(PerfumeCatalogApplication.class, args);
    }
}
