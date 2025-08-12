package com.cataloghakim.perfume.controller;

import com.cataloghakim.perfume.dto.UserProfileDTO;
import com.cataloghakim.perfume.dto.ChangePasswordDTO;
import com.cataloghakim.perfume.dto.UserUpdateDTO;
import com.cataloghakim.perfume.entity.User;
import com.cataloghakim.perfume.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/profile")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<?> getCurrentUserProfile(Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userService.getUserByUsername(username);
            
            UserProfileDTO profileDTO = new UserProfileDTO(user.getUsername(), user.getEmail(), user.getRoles());
            return ResponseEntity.ok(profileDTO);
            
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to get profile: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UserProfileDTO profileDTO, 
                                         Authentication authentication) {
        try {
            String currentUsername = authentication.getName();
            User updatedUser = userService.updateProfile(currentUsername, profileDTO);
            
            UserProfileDTO responseDTO = new UserProfileDTO(updatedUser.getUsername(), updatedUser.getEmail());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("user", responseDTO);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to update profile: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordDTO passwordDTO,
                                          Authentication authentication) {
        try {
            String username = authentication.getName();
            userService.changePassword(username, passwordDTO);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to change password: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
            
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to get users: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User created successfully");
            response.put("user", createdUser);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to create user: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @Valid @RequestBody UserUpdateDTO user) {
        try {
            User updatedUser = userService.updateUser(userId, user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User updated successfully");
            response.put("user", updatedUser);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to update user: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "User deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to delete user: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
