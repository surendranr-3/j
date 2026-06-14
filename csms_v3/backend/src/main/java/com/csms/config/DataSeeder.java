package com.csms.config;

import com.csms.entity.User;
import com.csms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@csms.com")) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@csms.com");
            admin.setPassword("admin123");
            admin.setPhone("9999999999");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
        }
    }
}