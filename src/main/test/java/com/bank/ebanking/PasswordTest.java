package com.bank.ebanking;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Le hash que tu as dans la base
        String storedHash = "$2a$10$dXJ3SW6G7P50IGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG";
        
        // Liste des mots de passe à tester
        String[] passwordsToTest = {
            "password",
            "password123",
            "admin",
            "admin123",
            "test",
            "test2",
            "123456",
            "P@ssw0rd",
            "pass123",
            "root"
        };
        
        System.out.println("Test du hash: " + storedHash);
        System.out.println("----------------------------------------");
        
        for (String pwd : passwordsToTest) {
            boolean matches = encoder.matches(pwd, storedHash);
            System.out.println("Mot de passe '" + pwd + "': " + (matches ? "✅ CORRESPOND" : "❌ ne correspond pas"));
        }
    }
}