package com.bank.ebanking.controller;

import com.bank.ebanking.dto.AccountDTO;
import com.bank.ebanking.service.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    public ResponseEntity<?> createAccount(@RequestBody AccountDTO accountDTO) {
        try {
            System.out.println("========== CRÉATION DE COMPTE ==========");
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null) {
                return ResponseEntity.status(401).body("Non authentifié");
            }

            Object principal = authentication.getPrincipal();
            String username;
            
            if (principal instanceof String) {
                username = (String) principal;
            } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                username = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
            } else {
                return ResponseEntity.status(401).body("Principal non reconnu");
            }

            System.out.println("Création de compte pour: " + username);
            
            AccountDTO createdAccount = accountService.createAccount(username, accountDTO);
            return ResponseEntity.ok(createdAccount);
            
        } catch (Exception e) {
            System.out.println("ERREUR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-accounts")
    public ResponseEntity<?> getMyAccounts() {
        try {
            System.out.println("========== REQUÊTE /my-accounts ==========");
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null) {
                return ResponseEntity.status(401).body("Non authentifié");
            }

            Object principal = authentication.getPrincipal();
            System.out.println("Principal type: " + (principal != null ? principal.getClass().getName() : "null"));
            
            String username;
            if (principal instanceof String) {
                username = (String) principal;
                System.out.println("Username (String): " + username);
            } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                username = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
                System.out.println("Username (UserDetails): " + username);
            } else {
                return ResponseEntity.status(401).body("Principal non reconnu: " + 
                    (principal != null ? principal.getClass().getName() : "null"));
            }
            
            List<AccountDTO> accounts = accountService.getAccountsByUsername(username);
            System.out.println("Nombre de comptes trouvés: " + accounts.size());
            
            return ResponseEntity.ok(accounts);
            
        } catch (Exception e) {
            System.out.println("ERREUR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<?> getAccountById(@PathVariable Long accountId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null) {
                return ResponseEntity.status(401).body("Non authentifié");
            }

            Object principal = authentication.getPrincipal();
            String username;
            
            if (principal instanceof String) {
                username = (String) principal;
            } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                username = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
            } else {
                return ResponseEntity.status(401).body("Principal non reconnu");
            }
            
            AccountDTO account = accountService.getAccountByIdAndUsername(accountId, username);
            return ResponseEntity.ok(account);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}