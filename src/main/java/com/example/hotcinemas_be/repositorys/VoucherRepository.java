package com.example.hotcinemas_be.repositorys;

import com.example.hotcinemas_be.models.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    Optional<Voucher> findVoucherByCode(String code);

    Page<Voucher> findVouchersByIsActive(Boolean isActive, Pageable pageable);
}
