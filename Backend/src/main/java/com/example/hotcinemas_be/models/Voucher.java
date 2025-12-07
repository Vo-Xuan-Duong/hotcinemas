package com.example.hotcinemas_be.models;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.hotcinemas_be.enums.VoucherType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vouchers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code", unique = true, nullable = false, length = 50)
    private String code;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "discount_value", nullable = false)
    private BigDecimal discountValue; // DECIMAL(5,2) in DB, Double in Java

    @Column(name = "voucher_type", nullable = false)
    @jakarta.persistence.Enumerated(jakarta.persistence.EnumType.STRING) // Map ENUM to
    private VoucherType voucherType;

    @Column(name = "quantity") // Nullable, Integer in DB
    private Integer quantity; // Nullable, Integer in Java

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "min_order_amount", nullable = false)
    private BigDecimal minOrderAmount ; // DECIMAL(10,2) in DB, Double in Java

    @Column(name = "max_discount_amount")
    private BigDecimal maxDiscountAmount; // Nullable, DECIMAL(10,2) in DB, Double in Java

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
