package com.bank.ebanking.dto;

public class LoginResponse {
    private boolean twoFactorRequired;
    private String message;

    public LoginResponse(boolean twoFactorRequired, String message) {
        this.twoFactorRequired = twoFactorRequired;
        this.message = message;
    }

    public boolean isTwoFactorRequired() { return twoFactorRequired; }
    public void setTwoFactorRequired(boolean twoFactorRequired) { this.twoFactorRequired = twoFactorRequired; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}