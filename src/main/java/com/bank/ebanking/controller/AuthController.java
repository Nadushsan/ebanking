package com.bank.ebanking.controller;

import com.bank.ebanking.dto.*;
import com.bank.ebanking.service.AuthService;
import com.bank.ebanking.service.TwoFactorService;
import com.bank.ebanking.util.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final TwoFactorService twoFactorService;
    private final JwtUtils jwtUtils;

    public AuthController(AuthService authService, TwoFactorService twoFactorService, JwtUtils jwtUtils) {
        this.authService = authService;
        this.twoFactorService = twoFactorService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            String message = authService.register(request);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Object response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<?> verifyTwoFactor(@RequestParam String username, @RequestBody TwoFactorVerifyRequest request) {
        System.out.println("\n🔥🔥🔥 VERIFY-2FA APPELÉ 🔥🔥🔥");
        System.out.println("Username: " + username);
        System.out.println("Code reçu: " + request.getCode());
        
        try {
            boolean valid = twoFactorService.verifyOtp(username, request.getCode());
            System.out.println("Résultat vérification: " + valid);
            
            if (!valid) {
                return ResponseEntity.badRequest().body("Code invalide ou expiré");
            }
            
            String token = authService.generateTokenAfter2FA(username);
            
            return ResponseEntity.ok(new JwtResponse(
                token, 
                1L,
                username, 
                username + "@email.com"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    @PostMapping("/setup-2fa")
    public ResponseEntity<?> setupTwoFactor(@RequestParam String username) {
        System.out.println("\n========== SETUP 2FA ==========");
        System.out.println("📱 Configuration 2FA pour: " + username);
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("🔐 Authentication: " + authentication);
            
            if (authentication == null) {
                return ResponseEntity.status(401).body("Non authentifié");
            }
            
            String secret = twoFactorService.generateTotpSecret(username);
            String qrCodeUri = twoFactorService.generateQrCodeUri(username, secret);
            
            System.out.println("✅ 2FA activée avec succès pour: " + username);
            
            return ResponseEntity.ok(new TwoFactorSetupResponse(
                "2FA activée avec succès", 
                secret, 
                qrCodeUri
            ));
        } catch (Exception e) {
            System.err.println("❌ Erreur: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    @DeleteMapping("/disable-2fa")
    public ResponseEntity<?> disableTwoFactor(@RequestParam String username) {
        try {
            twoFactorService.disableTwoFactor(username);
            return ResponseEntity.ok("2FA désactivée avec succès");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend-2fa")
    public ResponseEntity<?> resendTwoFactorCode(@RequestParam String username) {
        try {
            String code = twoFactorService.generateAndSendOtp(username);
            return ResponseEntity.ok("Code renvoyé avec succès");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/public-test")
    public String publicTest() {
        return "✅ Le backend fonctionne !";
    }

    @GetMapping("/test-token")
    public ResponseEntity<?> testToken() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("\n========== TEST TOKEN ==========");
            System.out.println("🔐 Authentication: " + authentication);
            
            if (authentication == null) {
                return ResponseEntity.status(401).body("Non authentifié");
            }
            
            Object principal = authentication.getPrincipal();
            System.out.println("👤 Principal: " + principal);
            
            String username;
            if (principal instanceof String) {
                username = (String) principal;
            } else if (principal instanceof UserDetails) {
                username = ((UserDetails) principal).getUsername();
            } else {
                return ResponseEntity.status(401).body("Principal non reconnu");
            }
            
            return ResponseEntity.ok("✅ Token valide pour: " + username);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }
}