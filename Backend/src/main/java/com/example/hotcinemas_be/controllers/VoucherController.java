package com.example.hotcinemas_be.controllers;

import com.example.hotcinemas_be.dtos.common.ResponseData;
import com.example.hotcinemas_be.dtos.voucher.requests.VoucherRequest;
import com.example.hotcinemas_be.services.VoucherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/vouchers")
@Tag(name = "Vouchers", description = "API for managing vouchers")
public class VoucherController {

    private final VoucherService voucherService;

    public VoucherController(VoucherService voucherService) {
        this.voucherService = voucherService;
    }

    @Operation(summary = "Create a new voucher", description = "Allows an admin to create a new voucher.")
    @PostMapping
    public ResponseEntity<?> createVoucher(@RequestBody VoucherRequest voucherRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(201)
                .message("Voucher has been successfully created")
                .data(voucherService.createVoucher(voucherRequest))
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(201).body(responseData);
    }

    @Operation(summary = "Get all vouchers", description = "Retrieves all vouchers.")
    @GetMapping
    public ResponseEntity<?> getAllVouchers(Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Vouchers retrieved successfully")
                .data(voucherService.getAllVouchers(pageable))
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get a voucher by ID", description = "Retrieves a voucher by its ID.")
    @GetMapping("/{id}")
    public ResponseEntity<?> getVoucherById(@PathVariable Long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Voucher retrieved successfully")
                .data(voucherService.getVoucherById(id))
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Update a voucher", description = "Allows an admin to update an existing voucher.")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVoucher(@PathVariable Long id, @RequestBody VoucherRequest voucherRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Voucher has been successfully updated")
                .data(voucherService.updateVoucher(id, voucherRequest))
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Delete a voucher", description = "Allows an admin to delete a voucher by its ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVoucher(@PathVariable Long id) {
        voucherService.deleteVoucher(id);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Voucher has been successfully deleted")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Activate a voucher", description = "Allows an admin to activate a voucher by its ID.")
    @PostMapping("/{id}/activate")
    public ResponseEntity<?> activateVoucher(@PathVariable Long id) {
        voucherService.activateVoucher(id);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Voucher has been successfully activated")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Deactivate a voucher", description = "Allows an admin to deactivate a voucher by its ID.")
    @PostMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateVoucher(@PathVariable Long id) {
        voucherService.deactivateVoucher(id);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Voucher has been successfully deactivated")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get a voucher by code", description = "Retrieves a voucher by its code.")
    @GetMapping("/code/{code}")
    public ResponseEntity<?> getVoucherByCode(@PathVariable String code) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Voucher retrieved successfully")
                .data(voucherService.getVoucherByCode(code))
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get all active vouchers", description = "Retrieves all active vouchers.")
    @GetMapping("/active")
    public ResponseEntity<?> getAllActiveVouchers(Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Active vouchers retrieved successfully")
                .data(voucherService.getActiveVouchers(pageable))
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(responseData);
    }
}
