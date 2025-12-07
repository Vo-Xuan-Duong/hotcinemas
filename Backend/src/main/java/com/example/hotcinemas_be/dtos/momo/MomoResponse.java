package com.example.hotcinemas_be.dtos.momo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MomoResponse {
    private int resultCode;
    private String message;
    private String orderId;
    private String requestId;
    private String payUrl; // for web
    private String deeplink; // for app
    private String qrCodeUrl; // sometimes present
    private String signature;
}
