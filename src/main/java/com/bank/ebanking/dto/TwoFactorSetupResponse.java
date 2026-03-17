package com.bank.ebanking.dto;

public class TwoFactorSetupResponse {
    private String message;
    private String secret;
    private String qrCodeUrl;

    public TwoFactorSetupResponse(String message, String secret, String qrCodeUrl) {
        this.message = message;
        this.secret = secret;
        this.qrCodeUrl = qrCodeUrl;
    }

    // Getters et Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }
    public String getQrCodeUrl() { return qrCodeUrl; }
    public void setQrCodeUrl(String qrCodeUrl) { this.qrCodeUrl = qrCodeUrl; }
}