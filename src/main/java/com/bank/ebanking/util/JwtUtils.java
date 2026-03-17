package com.bank.ebanking.util;

import com.bank.ebanking.security.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExpirationMs;

    private Key key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        String token = Jwts.builder()
                .setSubject((userPrincipal.getUsername()))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
        
        System.out.println("\n========== GÉNÉRATION TOKEN ==========");
        System.out.println("✅ Token généré pour: " + userPrincipal.getUsername());
        System.out.println("🔑 Clé secrète utilisée: " + jwtSecret);
        System.out.println("📝 Token complet: " + token);
        System.out.println("📝 Token (début): " + token.substring(0, Math.min(30, token.length())) + "...");
        System.out.println("=====================================\n");
        
        return token;
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            System.out.println("\n========== VALIDATION TOKEN ==========");
            System.out.println("🔑 Clé secrète utilisée: " + jwtSecret);
            System.out.println("🔍 Token à valider: " + authToken.substring(0, Math.min(30, authToken.length())) + "...");
            System.out.println("📝 Token complet: " + authToken);
            
            // Afficher la clé encodée en Base64 pour vérification
            byte[] keyBytes = jwtSecret.getBytes();
            String encodedKey = Base64.getEncoder().encodeToString(keyBytes);
            System.out.println("🔑 Clé (Base64): " + encodedKey);
            
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            System.out.println("✅ Token JWT valide");
            System.out.println("=====================================\n");
            return true;
            
        } catch (MalformedJwtException e) {
            System.out.println("❌ Token JWT malformé: " + e.getMessage());
            System.out.println("📝 Exception: " + e.getClass().getName());
            e.printStackTrace();
        } catch (ExpiredJwtException e) {
            System.out.println("❌ Token JWT expiré: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.out.println("❌ Token JWT non supporté: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("❌ Token JWT vide: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("❌ Erreur inconnue: " + e.getMessage());
            e.printStackTrace();
        }
        System.out.println("=====================================\n");
        return false;
    }
}