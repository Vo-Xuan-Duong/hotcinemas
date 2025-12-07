package com.example.hotcinemas_be.enums;

import lombok.Getter;

@Getter
public enum MovieFormat {
    // --- NHÓM 2D ---
    TWO_D_SUB("2D Phụ đề", false, false),
    TWO_D_DUB("2D Lồng tiếng", false, false),
    TWO_D_VIET("2D Tiếng Việt", false, false), // Phim Việt gốc

    // --- NHÓM 3D ---
    THREE_D_SUB("3D Phụ đề", true, false),
    THREE_D_DUB("3D Lồng tiếng", true, false),

    // --- NHÓM CAO CẤP (IMAX / 4DX) ---
    IMAX_2D("IMAX 2D", false, true),
    IMAX_3D("IMAX 3D", true, true),
    FOUR_DX("4DX", false, false); // Tùy logic có coi 4DX là 3D hay không

    // Các thuộc tính đi kèm
    private final String label;    // Tên hiển thị ra Frontend
    private final boolean is3D;    // Để tính phụ thu kính 3D
    private final boolean isImax;  // Để tính phụ thu phòng IMAX

    // Constructor
    MovieFormat(String label, boolean is3D, boolean isImax) {
        this.label = label;
        this.is3D = is3D;
        this.isImax = isImax;
    }

    /**
     * Method tiện ích: Tính phí phụ thu dựa trên định dạng
     * Ví dụ: Vé gốc 80k. Nếu là 3D cộng 20k, IMAX cộng 50k.
     */
    public int calculateSurcharge() {
        int surcharge = 0;
        if (this.is3D) surcharge += 20000;
        if (this.isImax) surcharge += 50000;
        return surcharge;
    }

    // Method tìm Enum từ String (phòng khi Frontend gửi string bậy bạ)
    public static MovieFormat fromString(String text) {
        for (MovieFormat format : MovieFormat.values()) {
            if (format.name().equalsIgnoreCase(text)) {
                return format;
            }
        }
        return TWO_D_SUB; // Giá trị mặc định nếu không tìm thấy
    }
}