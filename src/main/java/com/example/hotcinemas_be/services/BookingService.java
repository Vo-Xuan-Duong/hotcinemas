package com.example.hotcinemas_be.services;

import com.example.hotcinemas_be.dtos.booking.requests.BookingRequest;
import com.example.hotcinemas_be.dtos.booking.responses.BookingDetailResponse;
import com.example.hotcinemas_be.dtos.seat.SeatSnapshot;
import com.example.hotcinemas_be.enums.BookingStatus;
import com.example.hotcinemas_be.enums.SeatType;
import com.example.hotcinemas_be.exceptions.ErrorCode;
import com.example.hotcinemas_be.exceptions.ErrorException;
import com.example.hotcinemas_be.mappers.BookingMapper;
import com.example.hotcinemas_be.models.*;
import com.example.hotcinemas_be.repositorys.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final ShowtimeRepository showtimeRepository;
    private final VoucherRepository voucherRepository;
    private final BookingMapper bookingMapper;
    private final AuthService authService;
    private final VoucherService voucherService;

    public BookingDetailResponse createBooking(BookingRequest bookingRequest) {
        log.info("Creating booking for showtime: {} with seats: {}",
                bookingRequest.getShowtimeId(), bookingRequest.getSeatIds());

        User currentUser = authService.getCurrentUser();

        Showtime showtime = showtimeRepository.findById(bookingRequest.getShowtimeId())
                .orElseThrow(() -> new ErrorException("Showtime not found", ErrorCode.ERROR_SHOWTIME_NOT_FOUND));

        BigDecimal originalPrice = totalAmountSeats(bookingRequest.getSeatIds(), showtime);

        Voucher voucher = null;
        BigDecimal discountAmount = BigDecimal.ZERO;
        String voucherCode = bookingRequest.getVoucherCode();
        if (voucherCode != null && !voucherCode.isBlank()) {
            voucher = voucherRepository.findVoucherByCode(voucherCode)
                    .orElseThrow(() -> new ErrorException("Voucher not found", ErrorCode.ERROR_VOUCHER_NOT_FOUND));
            discountAmount = voucherService.calculateDiscount(voucherCode, originalPrice);
        }
        BigDecimal totalAmount = originalPrice.subtract(discountAmount);

        List<SeatSnapshot> seatSnapshots = bookingRequest.getSeatIds().stream().map(
                seatId -> {
                    Seat seat = seatRepository.findById(seatId)
                            .orElseThrow(() -> new ErrorException("Seat not found", ErrorCode.ERROR_SEAT_NOT_FOUND));
                    return SeatSnapshot.builder()
                            .seatId(seat.getId())
                            .seatName(seat.getName())
                            .price(getPriceForSeat(seat, showtime))
                            .seatType(seat.getSeatType().getDisplayName())
                            .build();
                }
        ).toList();

        Booking booking = Booking.builder()
                .user(currentUser)
                .showtime(showtime)
                .bookingCode(generateBookingCode())
                .bookingDate(LocalDateTime.now())
                .originalPrice(originalPrice)
                .discountAmount(discountAmount)
                .totalAmount(totalAmount)
                .bookingStatus(BookingStatus.PENDING)
                .seatSnapshots(seatSnapshots)
                .voucher(voucher)
                .voucherCode(voucherCode)
                .build();
        booking = bookingRepository.save(booking);

        try{
            return bookingMapper.mapToResponse(booking);
        } catch (Exception e) {
            throw new ErrorException("Error mapping booking to response", ErrorCode.ERROR_BOOKING_NOT_FOUND);
        }
    }

    @Transactional(readOnly = true)
    public BookingDetailResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ErrorException("Booking not found", ErrorCode.ERROR_BOOKING_NOT_FOUND));
        try{
            return bookingMapper.mapToResponse(booking);
        } catch (Exception e) {
            throw new ErrorException("Error mapping booking to response", ErrorCode.ERROR_BOOKING_NOT_FOUND);
        }
    }

    @Transactional(readOnly = true)
    public BookingDetailResponse getBookingByCode(String bookingCode) {
        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new ErrorException("Booking not found", ErrorCode.ERROR_BOOKING_NOT_FOUND));
        try{
            return bookingMapper.mapToResponse(booking);
        } catch (Exception e) {
            throw new ErrorException("Error mapping booking to response", ErrorCode.ERROR_BOOKING_NOT_FOUND);
        }
    }

    @Transactional(readOnly = true)
    public Page<BookingDetailResponse> getAllBookings(Pageable pageable) {
        Page<Booking> bookings = bookingRepository.findAll(pageable);
        return bookings.map(
                booking -> {
                    try {
                        return bookingMapper.mapToResponse(booking);
                    } catch (Exception e) {
                        throw new ErrorException("Error mapping booking to response", ErrorCode.ERROR_BOOKING_NOT_FOUND);
                    }
                }
        );
    }

    @Transactional(readOnly = true)
    public List<BookingDetailResponse> getBookingsByUserId(Long userId) {
        List<Booking> bookings = bookingRepository.findBookingsByUserId(userId);
        return bookings.stream().map(
                booking -> {
                    try {
                        return bookingMapper.mapToResponse(booking);
                    } catch (Exception e) {
                        throw new ErrorException("Error mapping booking to response", ErrorCode.ERROR_BOOKING_NOT_FOUND);
                    }
                }
        ).toList();
    }

    @Transactional(readOnly = true)
    public List<BookingDetailResponse> getBookingsByShowtimeId(Long showtimeId) {
        List<Booking> bookings = bookingRepository.findBookingsByShowtimeId(showtimeId);
        return bookings.stream().map(
                booking -> {
                    try {
                        return bookingMapper.mapToResponse(booking);
                    } catch (Exception e) {
                        throw new ErrorException("Error mapping booking to response", ErrorCode.ERROR_BOOKING_NOT_FOUND);
                    }
                }
        ).toList();
    }

    @Transactional(readOnly = true)
    public List<BookingDetailResponse> getBookingsByStatus(BookingStatus status) {
        List<Booking> bookings = bookingRepository.findBookingsByBookingStatus(status);
        return bookings.stream().map(
                booking -> {
                    try {
                        return bookingMapper.mapToResponse(booking);
                    } catch (Exception e) {
                        throw new ErrorException("Error mapping booking to response", ErrorCode.ERROR_BOOKING_NOT_FOUND);
                    }
                }
        ).toList();
    }

    private BigDecimal totalAmountSeats(List<Long> seatIds, Showtime showtime) {
        List<Seat> seats = seatRepository.findAllById(seatIds);
        BigDecimal total = BigDecimal.ZERO;
        for (Seat seat : seats) {
            total = total.add(getPriceForSeat(seat, showtime));
        }
        return total;
    }

    public BigDecimal getPriceForSeat(Seat seat, Showtime showtime) {
        if(seat.getSeatType() == SeatType.COUPLE) {
            return showtime.getTicketPrice().multiply(BigDecimal.valueOf(2));
        } else if(seat.getSeatType() == SeatType.VIP) {
            BigDecimal price = showtime.getTicketPrice();
            return price.multiply(new BigDecimal("1.1"));
        } else {
            return showtime.getTicketPrice();
        }
    }

    private String generateBookingCode() {
        long timestamp = System.currentTimeMillis() / 1000;

        String timeCode = Long.toString(timestamp, 36).toUpperCase();

        int randomPart = (int) (Math.random() * 90 + 10);

        return "BK" + timeCode + randomPart; // Kết quả ví dụ: BK1Z4F9825
    }

    public BookingDetailResponse updateBookingStatus(Long id, BookingStatus status) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new ErrorException("Booking not found", ErrorCode.ERROR_BOOKING_NOT_FOUND));
        if (booking.getBookingStatus() != BookingStatus.PENDING) {
            throw new ErrorException("Cannot update booking status", ErrorCode.ERROR_INVALID_REQUEST);
        }
        booking.setBookingStatus(status);
        booking = bookingRepository.save(booking);
        log.info("Booking {} updated successfully", booking.getId());
        try{
            return bookingMapper.mapToResponse(booking);
        } catch (Exception e) {
            throw new ErrorException("Error mapping booking to response", ErrorCode.ERROR_BOOKING_NOT_FOUND);
        }
    }

    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new ErrorException("Booking not found", ErrorCode.ERROR_BOOKING_NOT_FOUND));
        bookingRepository.delete(booking);
    }
}