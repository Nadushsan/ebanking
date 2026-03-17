package com.bank.ebanking.service;

import com.bank.ebanking.dto.JwtResponse;
import com.bank.ebanking.dto.LoginRequest;
import com.bank.ebanking.dto.LoginResponse;
import com.bank.ebanking.dto.RegisterRequest;
import com.bank.ebanking.entity.User;
import com.bank.ebanking.repository.UserRepository;
import com.bank.ebanking.security.UserDetailsImpl;
import com.bank.ebanking.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private TwoFactorService twoFactorService;

    @Autowired
    private UserDetailsService userDetailsService;

    public Object login(LoginRequest request) {
        try {
            // Première étape : authentification normale
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            
            User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            
            // Vérifier si l'utilisateur a activé la 2FA
            if (user.getFa2Enabled() != null && user.getFa2Enabled()) {
                // Envoyer un code OTP par email
                String otp = twoFactorService.generateAndSendOtp(request.getUsername());
                
                // Retourner une réponse indiquant que la 2FA est requise
                return new LoginResponse(true, "Code de vérification envoyé par email");
            }
            
            // Pas de 2FA, générer le token directement
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            return new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail());
            
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Nom d'utilisateur ou mot de passe incorrect");
        }
    }

    public String register(RegisterRequest request) {
        // Vérifier si l'utilisateur existe déjà
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Ce nom d'utilisateur existe déjà");
        }
        
        // Créer un nouvel utilisateur
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setFa2Enabled(false); // 2FA désactivée par défaut
        
        userRepository.save(user);
        
        return "Utilisateur enregistré avec succès";
    }

    public String generateTokenAfter2FA(String username) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        UsernamePasswordAuthenticationToken authentication = 
            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtUtils.generateJwtToken(authentication);
    }
}