package com.bank.ebanking.config;

import com.bank.ebanking.util.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    @Lazy
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();
        
        logger.info("========== JwtAuthenticationFilter ==========");
        logger.info("🔍 Requête: {} {}", method, path);

        // Ignorer les requêtes OPTIONS (préflight CORS)
        if (method.equals("OPTIONS")) {
            logger.info("➡️ Requête OPTIONS ignorée");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String jwt = parseJwt(request);
            logger.info("🔑 Header Authorization: {}", request.getHeader("Authorization"));
            logger.info("🔑 Token présent: {}", jwt != null ? "OUI" : "NON");
            
            if (jwt != null) {
                logger.info("🔑 Token (début): {}", jwt.length() > 20 ? jwt.substring(0, 20) + "..." : jwt);
                
                if (jwtUtils.validateJwtToken(jwt)) {
                    String username = jwtUtils.getUserNameFromJwtToken(jwt);
                    logger.info("✅ Token JWT valide pour l'utilisateur: {}", username);

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    logger.info("👤 UserDetails chargé: {} avec rôles: {}", 
                        userDetails.getUsername(), userDetails.getAuthorities());

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.info("🔐 Authentification placée dans le contexte");
                } else {
                    logger.warn("❌ Token JWT invalide");
                }
            } else {
                logger.warn("⚠️ Aucun token trouvé dans la requête");
            }
        } catch (Exception e) {
            logger.error("❌ Erreur lors de l'authentification: {}", e.getMessage());
            e.printStackTrace();
        }

        logger.info("➡️ Passage au filtre suivant");
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}