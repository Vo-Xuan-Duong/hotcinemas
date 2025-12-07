package com.example.hotcinemas_be.services;

import com.example.hotcinemas_be.dtos.voucher.requests.VoucherRequest;
import com.example.hotcinemas_be.dtos.voucher.responses.VoucherResponse;
import com.example.hotcinemas_be.enums.VoucherType;
import com.example.hotcinemas_be.exceptions.ErrorCode;
import com.example.hotcinemas_be.exceptions.ErrorException;
import com.example.hotcinemas_be.mappers.VoucherMapper;
import com.example.hotcinemas_be.models.Voucher;
import com.example.hotcinemas_be.repositorys.VoucherRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
public class VoucherService {

    private final VoucherRepository voucherRepository;
    private final VoucherMapper voucherMapper;

    public VoucherService(VoucherRepository voucherRepository,
                          VoucherMapper voucherMapper) {
        this.voucherRepository = voucherRepository;
        this.voucherMapper = voucherMapper;
    }

    public VoucherResponse createVoucher(VoucherRequest voucherRequest) {
        Voucher voucher = new Voucher();
        voucher.setCode(voucherRequest.getCode());
        voucher.setDescription(voucherRequest.getDescription());
        voucher.setQuantity(voucherRequest.getQuantity());
        voucher.setStartDate(voucherRequest.getStartDate());
        voucher.setEndDate(voucherRequest.getEndDate());
        voucher.setDiscountValue(BigDecimal.valueOf(voucherRequest.getDiscountValue()));
        voucher.setMinOrderAmount(toBigDecimal(voucherRequest.getMinOrderAmount()));
        voucher.setMaxDiscountAmount(toBigDecimal(voucherRequest.getMaxDiscountAmount()));
        voucher.setVoucherType(voucherRequest.getVoucherType());

        return voucherMapper.mapToResponse(voucherRepository.save(voucher));
    }

    public VoucherResponse getVoucherById(Long id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ErrorException("Voucher not found with id: " + id,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        return voucherMapper.mapToResponse(voucher);
    }

    public VoucherResponse updateVoucher(Long id, VoucherRequest voucherRequest) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ErrorException("Voucher not found with id: " + id,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        voucher.setCode(voucherRequest.getCode());
        voucher.setDescription(voucherRequest.getDescription());
        voucher.setQuantity(voucherRequest.getQuantity());
        voucher.setDiscountValue(BigDecimal.valueOf(voucherRequest.getDiscountValue()));
        voucher.setStartDate(voucherRequest.getStartDate());
        voucher.setEndDate(voucherRequest.getEndDate());
        voucher.setMinOrderAmount(toBigDecimal(voucherRequest.getMinOrderAmount()));
        voucher.setMaxDiscountAmount(toBigDecimal(voucherRequest.getMaxDiscountAmount()));
        voucher.setVoucherType(voucherRequest.getVoucherType());

        return voucherMapper.mapToResponse(voucherRepository.save(voucher));
    }

    public void deleteVoucher(Long id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ErrorException("Voucher not found with id: " + id,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        voucherRepository.delete(voucher);
    }

    public VoucherResponse getVoucherByCode(String code) {
        Voucher voucher = voucherRepository.findVoucherByCode(code)
                .orElseThrow(() -> new ErrorException("Voucher not found with code: " + code,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        return voucherMapper.mapToResponse(voucher);
    }

    public Page<VoucherResponse> getAllVouchers(Pageable pageable) {
        Page<Voucher> vouchers = voucherRepository.findAll(pageable);
        if (vouchers.getTotalElements() == 0) {
            throw new ErrorException("No vouchers found", ErrorCode.ERROR_MODEL_NOT_FOUND);
        }
        return vouchers.map(voucherMapper::mapToResponse);
    }

    public void activateVoucher(Long id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ErrorException("Voucher not found with id: " + id,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        voucher.setIsActive(true);
        voucherRepository.save(voucher);
    }

    public void deactivateVoucher(Long id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ErrorException("Voucher not found with id: " + id,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        voucher.setIsActive(false);
        voucherRepository.save(voucher);
    }

    private void useVoucher(Voucher voucher) {
        if (voucher.getQuantity() != null && voucher.getQuantity() > 0) {
            voucher.setQuantity(voucher.getQuantity() - 1);
            voucherRepository.save(voucher);
        } else {
            throw new ErrorException("Voucher is out of stock", ErrorCode.ERROR_VOUCHER_OUT_OF_STOCK);
        }
    }

    public Page<VoucherResponse> getActiveVouchers(Pageable pageable) {
        Page<Voucher> vouchers = voucherRepository.findVouchersByIsActive(true, pageable);
        if (vouchers.getTotalElements() == 0) {
            throw new ErrorException("No active vouchers found", ErrorCode.ERROR_MODEL_NOT_FOUND);
        }
        return vouchers.map(voucherMapper::mapToResponse);
    }

    public BigDecimal calculateDiscount(String code, BigDecimal totalAmount) {
        if (code == null || code.isBlank() || totalAmount == null) {
            return BigDecimal.ZERO;
        }

        Voucher voucher = voucherRepository.findVoucherByCode(code)
                .orElseThrow(() -> new ErrorException("Voucher not found", ErrorCode.ERROR_VOUCHER_NOT_FOUND));

        useVoucher(voucher);

        if (Boolean.FALSE.equals(voucher.getIsActive()))
            return BigDecimal.ZERO;
        if (totalAmount.compareTo(BigDecimal.ZERO) <= 0)
            return BigDecimal.ZERO;

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(voucher.getStartDate()) || now.isAfter(voucher.getEndDate()))
            return BigDecimal.ZERO;
        if (voucher.getQuantity() != null && voucher.getQuantity() <= 0)
            return BigDecimal.ZERO;
        if (voucher.getMinOrderAmount() != null && totalAmount.compareTo(voucher.getMinOrderAmount()) < 0)
            return BigDecimal.ZERO;

        BigDecimal discount;
        BigDecimal discountValue = voucher.getDiscountValue();

        if (discountValue == null || discountValue.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ErrorException("Invalid discount value", ErrorCode.ERROR_VOUCHER_INVALID);
        }

        VoucherType type = voucher.getVoucherType();
        if (type == null) {
            throw new ErrorException("Voucher type is required", ErrorCode.ERROR_VOUCHER_INVALID);
        }

        switch (type) {
            case PERCENTAGE -> {
                if (discountValue.compareTo(BigDecimal.valueOf(100)) > 0) {
                    throw new ErrorException("Percent must be <= 100", ErrorCode.ERROR_VOUCHER_INVALID);
                }
                discount = totalAmount
                        .multiply(discountValue)
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            }
            case FIXED_AMOUNT -> {
                discount = discountValue.setScale(2, RoundingMode.HALF_UP);
                if (discount.compareTo(totalAmount) > 0) {
                    discount = totalAmount;
                }
            }
            default -> throw new ErrorException("Unsupported voucher type", ErrorCode.ERROR_VOUCHER_INVALID);
        }

        if (voucher.getMaxDiscountAmount() != null) {
            BigDecimal cap = voucher.getMaxDiscountAmount().setScale(2, RoundingMode.HALF_UP);
            discount = discount.min(cap);
        }

        return discount.max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
    }
    private BigDecimal toBigDecimal(Double value) {
        return value != null ? BigDecimal.valueOf(value) : null;
    }
}
