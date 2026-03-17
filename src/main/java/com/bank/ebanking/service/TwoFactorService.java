package com.bank.ebanking.service;

import com.bank.ebanking.entity.User;
import com.bank.ebanking.repository.UserRepository;
import dev.samstevens.totp.code.*;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

import static dev.samstevens.totp.util.Utils.getDataUriForImage;

@Service
public class TwoFactorService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JavaMailSender mailSender;
    
    private final Random random = new SecureRandom();
    
    /**
     * OPTION 1: Configuration TOTP (Google Authenticator)
     */
    @Transactional
    public String generateTotpSecret(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Générer un secret
        SecretGenerator secretGenerator = new DefaultSecretGenerator();
        String secret = secretGenerator.generate();
        
        user.setFa2Secret(secret);
        user.setFa2Enabled(true);
        userRepository.save(user);
        
        System.out.println("✅ Secret TOTP généré pour " + username + ": " + secret);
        
        return secret;
    }
    
    public String generateQrCodeUri(String username, String secret) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        QrData data = new QrData.Builder()
            .label("eBanking:" + username)
            .secret(secret)
            .issuer("eBanking")
            .algorithm(HashingAlgorithm.SHA1)
            .digits(6)
            .period(30)
            .build();
        
        try {
            QrGenerator generator = new ZxingPngQrGenerator();
            byte[] imageData = generator.generate(data);
            String mimeType = generator.getImageMimeType();
            return getDataUriForImage(imageData, mimeType);
        } catch (QrGenerationException e) {
            throw new RuntimeException("Erreur génération QR code", e);
        }
    }
    
    public boolean verifyTotpCode(String username, String code) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (user.getFa2Enabled() == null || !user.getFa2Enabled() || user.getFa2Secret() == null) {
            System.out.println("❌ TOTP: 2FA non activée pour " + username);
            return false;
        }
        
        TimeProvider timeProvider = new SystemTimeProvider();
        CodeGenerator codeGenerator = new DefaultCodeGenerator();
        CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
        
        boolean valid = verifier.isValidCode(user.getFa2Secret(), code);
        System.out.println("🔍 TOTP vérification pour " + username + ": " + (valid ? "✅" : "❌"));
        
        return valid;
    }
    
    /**
     * OPTION 2: OTP par email (avec logs détaillés)
     */
    @Transactional
    public String generateAndSendOtp(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Générer un code à 6 chiffres
        int otp = 100000 + random.nextInt(900000);
        String otpCode = String.valueOf(otp);
        
        // Stocker le code avec expiration (5 minutes)
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);
        user.setOtpCode(otpCode);
        user.setOtpExpiry(expiryTime);
        userRepository.save(user);
        
        // Afficher le code dans la console de manière très visible
        System.out.println("\n" + "=".repeat(60));
        System.out.println("🔐 CODE 2FA POUR " + username + ": " + otpCode);
        System.out.println("⏰ Généré à: " + LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_TIME));
        System.out.println("⏰ Expire à: " + expiryTime.format(DateTimeFormatter.ISO_LOCAL_TIME));
        System.out.println("=".repeat(60) + "\n");
        
        // Optionnel: essayer d'envoyer un email si l'adresse existe
        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            try {
                sendOtpEmail(user.getEmail(), otpCode);
                System.out.println("📧 Email envoyé à: " + user.getEmail());
            } catch (Exception e) {
                System.out.println("⚠️ Impossible d'envoyer l'email: " + e.getMessage());
            }
        } else {
            System.out.println("⚠️ Pas d'email configuré pour " + username);
        }
        
        return otpCode;
    }
    
    private void sendOtpEmail(String email, String otpCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Code de vérification eBanking");
            message.setText("Votre code de vérification est: " + otpCode + "\n\nCe code expire dans 5 minutes.");
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("❌ Erreur envoi email: " + e.getMessage());
            // Ne pas propager l'exception pour ne pas bloquer la connexion
        }
    }
    
    /**
     * Vérification OTP avec logs détaillés
     */
    public boolean verifyOtp(String username, String code) {
    System.out.println("\n" + "🔥".repeat(30));
    System.out.println("🔥 DÉBUT VÉRIFICATION 2FA POUR " + username + " À " + LocalDateTime.now());
    System.out.println("🔥".repeat(30));
    
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    
    System.out.println("1️⃣ Utilisateur trouvé: " + user.getUsername());
    System.out.println("2️⃣ Code reçu du frontend: '" + code + "'");
    System.out.println("   - Longueur: " + code.length());
    System.out.println("   - Premier caractère: '" + code.charAt(0) + "' (code ASCII: " + (int)code.charAt(0) + ")");
    
    if (user.getOtpCode() == null) {
        System.out.println("3️⃣ ❌ ERREUR: Aucun code stocké en base!");
        System.out.println("🔥".repeat(30));
        return false;
    }
    
    System.out.println("3️⃣ Code stocké en base: '" + user.getOtpCode() + "'");
    System.out.println("   - Longueur: " + user.getOtpCode().length());
    System.out.println("   - Premier caractère: '" + user.getOtpCode().charAt(0) + "' (code ASCII: " + (int)user.getOtpCode().charAt(0) + ")");
    
    if (user.getOtpExpiry() == null) {
        System.out.println("4️⃣ ❌ ERREUR: Pas de date d'expiration!");
        System.out.println("🔥".repeat(30));
        return false;
    }
    
    System.out.println("4️⃣ Expiration: " + user.getOtpExpiry());
    System.out.println("5️⃣ Heure actuelle: " + LocalDateTime.now());
    
    // Vérifier expiration
    boolean isExpired = LocalDateTime.now().isAfter(user.getOtpExpiry());
    System.out.println("6️⃣ Code expiré? " + (isExpired ? "OUI ❌" : "NON ✅"));
    
    if (isExpired) {
        System.out.println("🔥".repeat(30));
        return false;
    }
    
    // Comparaison caractère par caractère
    System.out.println("\n7️⃣ COMPARAISON CARACTÈRE PAR CARACTÈRE:");
    String stored = user.getOtpCode();
    boolean allMatch = true;
    
    for (int i = 0; i < 6; i++) {
        char storedChar = (i < stored.length()) ? stored.charAt(i) : '?';
        char receivedChar = (i < code.length()) ? code.charAt(i) : '?';
        
        boolean match = (i < stored.length() && i < code.length() && storedChar == receivedChar);
        
        System.out.println("   Position " + i + ":");
        System.out.println("      Stocké: '" + storedChar + "' (ASCII: " + (int)storedChar + ")");
        System.out.println("      Reçu:   '" + receivedChar + "' (ASCII: " + (int)receivedChar + ")");
        System.out.println("      Correspondance: " + (match ? "✅" : "❌"));
        
        if (!match) allMatch = false;
    }
    
    // Différentes méthodes de comparaison
    System.out.println("\n8️⃣ RÉSULTATS COMPARAISON:");
    
    boolean exactMatch = stored.equals(code);
    System.out.println("   equals exact: " + (exactMatch ? "✅" : "❌"));
    
    boolean ignoreCaseMatch = stored.equalsIgnoreCase(code);
    System.out.println("   equals ignore case: " + (ignoreCaseMatch ? "✅" : "❌"));
    
    boolean trimMatch = stored.trim().equals(code.trim());
    System.out.println("   trim puis equals: " + (trimMatch ? "✅" : "❌"));
    
    // Nettoyer tout caractère non numérique
    String cleanStored = stored.replaceAll("[^0-9]", "");
    String cleanCode = code.replaceAll("[^0-9]", "");
    boolean cleanMatch = cleanStored.equals(cleanCode);
    System.out.println("   seulement chiffres: " + (cleanMatch ? "✅" : "❌"));
    
    if (cleanMatch && !exactMatch) {
        System.out.println("   ⚠️  Les codes sont identiques après nettoyage!");
        System.out.println("      Stocké nettoyé: '" + cleanStored + "'");
        System.out.println("      Reçu nettoyé:   '" + cleanCode + "'");
    }
    
    boolean valid = stored.equals(code);
    
    if (valid) {
        System.out.println("\n9️⃣ ✅ VICTOIRE! CODE VALIDE!");
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
        System.out.println("   Code effacé de la base");
    } else {
        System.out.println("\n9️⃣ ❌ ÉCHEC! CODE INVALIDE");
    }
    
    System.out.println("🔥".repeat(30) + "\n");
    
    return valid;
}
    /**
     * Désactiver la 2FA
     */
    @Transactional
    public void disableTwoFactor(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        user.setFa2Enabled(false);
        user.setFa2Secret(null);
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
        
        System.out.println("🔴 2FA désactivée pour " + username);
    }
}