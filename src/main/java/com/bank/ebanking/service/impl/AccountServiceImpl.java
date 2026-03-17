package com.bank.ebanking.service.impl;

import com.bank.ebanking.dto.AccountDTO;
import com.bank.ebanking.entity.Account;
import com.bank.ebanking.entity.User;
import com.bank.ebanking.repository.AccountRepository;
import com.bank.ebanking.repository.UserRepository;
import com.bank.ebanking.service.AccountService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountServiceImpl(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    private String generateAccountNumber() {
        return "BNK" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }

    private AccountDTO convertToDTO(Account account) {
        AccountDTO dto = new AccountDTO();
        dto.setId(account.getId());
        dto.setAccountNumber(account.getAccountNumber());
        dto.setAccountType(account.getAccountType());
        dto.setBalance(account.getBalance());
        dto.setCurrency(account.getCurrency());
        dto.setStatus(account.getStatus());
        dto.setCreatedAt(account.getCreatedAt());
        if (account.getUser() != null) {
            dto.setUserId(account.getUser().getId());
        }
        return dto;
    }

    @Override
    @Transactional
    public AccountDTO createAccount(String username, AccountDTO accountDTO) {
        System.out.println("Création de compte pour: " + username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + username));

        Account account = new Account();
        account.setAccountNumber(generateAccountNumber());
        account.setAccountType(accountDTO.getAccountType());
        account.setBalance(accountDTO.getBalance() != null ? accountDTO.getBalance() : BigDecimal.ZERO);
        account.setCurrency(accountDTO.getCurrency() != null ? accountDTO.getCurrency() : "XOF");
        account.setStatus("ACTIVE");
        account.setCreatedAt(LocalDateTime.now());
        account.setUser(user);

        Account savedAccount = accountRepository.save(account);
        System.out.println("Compte créé avec ID: " + savedAccount.getId() + " - Numéro: " + savedAccount.getAccountNumber());
        
        return convertToDTO(savedAccount);
    }

    @Override
    public List<AccountDTO> getAccountsByUsername(String username) {
        System.out.println("Recherche des comptes pour: " + username);
        
        User user = userRepository.findByUsername(username).orElse(null);
        
        if (user == null) {
            System.out.println("⚠️ Utilisateur non trouvé: " + username);
            return new ArrayList<>();
        }
        
        System.out.println("Utilisateur trouvé avec ID: " + user.getId());
        
        List<Account> accounts = accountRepository.findByUserId(user.getId());
        System.out.println("Nombre de comptes trouvés: " + accounts.size());
        
        return accounts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AccountDTO getAccountByIdAndUsername(Long accountId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + username));
        
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé: " + accountId));

        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Ce compte ne vous appartient pas");
        }

        return convertToDTO(account);
    }
}