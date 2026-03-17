package com.bank.ebanking.controller;

import com.bank.ebanking.dto.TransactionDTO;
import com.bank.ebanking.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/deposit/{accountId}")
    public ResponseEntity<TransactionDTO> deposit(
            @PathVariable Long accountId,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false) String description) {
        TransactionDTO transaction = transactionService.deposit(accountId, amount, description);
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/withdraw/{accountId}")
    public ResponseEntity<TransactionDTO> withdraw(
            @PathVariable Long accountId,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false) String description) {
        TransactionDTO transaction = transactionService.withdraw(accountId, amount, description);
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/transfer/{fromAccountId}")
    public ResponseEntity<TransactionDTO> transfer(
            @PathVariable Long fromAccountId,
            @RequestParam String toAccountNumber,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false) String description) {
        TransactionDTO transaction = transactionService.transfer(fromAccountId, toAccountNumber, amount, description);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/history/{accountId}")
    public ResponseEntity<List<TransactionDTO>> getTransactionHistory(@PathVariable Long accountId) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByAccountId(accountId);
        return ResponseEntity.ok(transactions);
    }
}