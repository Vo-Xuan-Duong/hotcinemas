package com.example.hotcinemas_be.enums;

public enum SeatType {
    // Định nghĩa các giá trị kèm tham số
    NORMAL("Ghế thường", 0.0),
    VIP("Ghế VIP", 20000.0),
    COUPLE("Ghế đôi", 50000.0);

    // Các thuộc tính
    private final String displayName;
    private final Double defaultSurcharge; // Phụ thu mặc định

    // Constructor (Enum bắt buộc private)
    SeatType(String displayName, Double defaultSurcharge) {
        this.displayName = displayName;
        this.defaultSurcharge = defaultSurcharge;
    }

    // Getters
    public String getDisplayName() {
        return displayName;
    }

    public Double getDefaultSurcharge() {
        return defaultSurcharge;
    }
}
