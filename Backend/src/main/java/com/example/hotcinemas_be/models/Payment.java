package com.example.hotcinemas_be.models;


import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.hotcinemas_be.enums.PaymentMethod;
import com.example.hotcinemas_be.enums.PaymentStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Builder.Default
    @Column(name = "payment_date", nullable = false)
    private LocalDateTime paymentDate = LocalDateTime.now();

    @Column(name = "amount", nullable = false)
    private BigDecimal amount; // DECIMAL(10,2) in DB, Double in Java

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false) // Use custom type
    private PaymentMethod paymentMethod;

    @Column(name = "booking_code", unique = true, length = 100)
    private String bookingCode; // Unique transaction identifier

    @Builder.Default
    @Enumerated(EnumType.STRING) // Map ENUM to String in DB
    @Column(name = "status", nullable = false) // Use custom type
    private PaymentStatus status = PaymentStatus.PENDING;
}
