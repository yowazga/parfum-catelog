package com.cataloghakim.perfume.controller;

import com.cataloghakim.perfume.dto.LoginRequestDTO;
import com.cataloghakim.perfume.dto.LoginResponseDTO;
import com.cataloghakim.perfume.service.JwtService;
import com.cataloghakim.perfume.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtService jwtService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(userDetails);
            
            // Get user details for response
            var user = userService.findByUsername(userDetails.getUsername());
            String email = user.map(u -> u.getEmail()).orElse("");
            
            LoginResponseDTO response = new LoginResponseDTO(
                    token,
                    userDetails.getUsername(),
                    email,
                    "Login successful"
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            LoginResponseDTO response = new LoginResponseDTO(
                    null,
                    null,
                    null,
                    "Invalid username or password"
            );
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<LoginResponseDTO> register(@Valid @RequestBody LoginRequestDTO registerRequest) {
        try {
            // Check if user already exists
            if (userService.findByUsername(registerRequest.getUsername()).isPresent()) {
                LoginResponseDTO response = new LoginResponseDTO(
                        null,
                        null,
                        null,
                        "Username already exists"
                );
                return ResponseEntity.badRequest().body(response);
            }
            
            // Create new user with USER role
            var user = userService.createUser(
                    registerRequest.getUsername(),
                    registerRequest.getPassword(),
                    registerRequest.getUsername() + "@example.com", // Default email
                    java.util.Set.of("USER")
            );
            
            // Generate token for new user
            UserDetails userDetails = userService.loadUserByUsername(user.getUsername());
            String token = jwtService.generateToken(userDetails);
            
            LoginResponseDTO response = new LoginResponseDTO(
                    token,
                    user.getUsername(),
                    user.getEmail(),
                    "Registration successful"
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            LoginResponseDTO response = new LoginResponseDTO(
                    null,
                    null,
                    null,
                    "Registration failed: " + e.getMessage()
            );
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            boolean isValid = jwtService.isTokenValid(jwt);
            return ResponseEntity.ok(isValid);
        }
        return ResponseEntity.ok(false);
    }

}
