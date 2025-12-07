package com.example.hotcinemas_be.config;

import com.example.hotcinemas_be.models.Role;
import com.example.hotcinemas_be.models.User;
import com.example.hotcinemas_be.repositorys.RoleRepository;
import com.example.hotcinemas_be.repositorys.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableAsync
@EnableScheduling
public class AppInitConfig {
    private final PasswordEncoder passwordEncoder;

    public AppInitConfig() {
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // Tạm thời comment để tránh lỗi khi database chưa có bảng
    @Bean
    public ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
            Role adminRole;
            if (roleRepository.findByName("Admin").isEmpty()) {
                adminRole = new Role();
                adminRole.setCode("ADMIN");
                adminRole.setName("Admin");
                adminRole.setDescription("Admin");
                roleRepository.save(adminRole);
                System.out.println("ROLE 'admin' has been created");
            } else {
                adminRole = roleRepository.findByName("Admin").get();
            }

            if (userRepository.findByUsername("admin").isEmpty()) {
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setPassword(passwordEncoder.encode("admin123")); // This should be
                // encoded in a real application
                adminUser.setEmail("admin@gmail.com");
                adminUser.setFullName("Admin User");
                adminUser.setPhone("1234567890");
                adminUser.setAddress("Localhost");
                adminUser.setAvatarUrl("https://example.com/avatar.png");
                adminUser.setIsActive(true);
                adminUser.setRole(adminRole);
                userRepository.save(adminUser);
                System.out.println("Admin user has been created with roles: " + adminRole);
            } else {
                System.out.println("Admin user already exists.");
            }
            System.out.println("Application initialization logic goes here.");
        };
    }
}
