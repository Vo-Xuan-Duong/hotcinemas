package com.example.hotcinemas_be.mappers;

import com.example.hotcinemas_be.dtos.booking.responses.BookingDetailResponse;
import com.example.hotcinemas_be.models.Booking;
import com.example.hotcinemas_be.services.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingMapper {

    public BookingDetailResponse mapToResponse(Booking booking) throws  Exception {
        if (booking == null) {
            return null;
        }

        return BookingDetailResponse.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .status(booking.getBookingStatus())
                .userId(booking.getUser() != null ? booking.getUser().getId() : null)
                .userName(booking.getUser() != null ? booking.getUser().getFullName() : null)
                .userEmail(booking.getUser() != null ? booking.getUser().getEmail() : null)
                .showtimeId(booking.getShowtime() != null ?  booking.getShowtime().getId() : null)
                .movieFormat(booking.getShowtime() != null && booking.getShowtime().getMovieFormat() != null ? booking.getShowtime().getMovieFormat().getLabel() : null)
                .movieTitle(booking.getShowtime() != null && booking.getShowtime().getMovie() != null ? booking.getShowtime().getMovie().getTitle() : null)
                .moviePosterUrl(booking.getShowtime() != null && booking.getShowtime().getMovie() != null ? booking.getShowtime().getMovie().getPosterPath() : null)
                .cinemaName(booking.getShowtime() != null && booking.getShowtime().getRoom() != null && booking.getShowtime().getRoom().getCinema() != null ? booking.getShowtime().getRoom().getCinema().getName() : null)
                .cinemaAddress(booking.getShowtime() != null && booking.getShowtime().getRoom() != null && booking.getShowtime().getRoom().getCinema() != null ? booking.getShowtime().getRoom().getCinema().getAddress() : null)
                .roomName(booking.getShowtime() != null && booking.getShowtime().getRoom() != null ? booking.getShowtime().getRoom().getName() : null)
                .showtimeDateTime(booking.getShowtime() != null ? booking.getShowtime().getDate() : null)
                .showtimeStartTime(booking.getShowtime() != null ? booking.getShowtime().getStartTime() : null)
                .showtimeEndTime(booking.getShowtime() != null ? booking.getShowtime().getEndTime() : null)
                .totalPrice(booking.getTotalAmount())
                .originalPrice(booking.getOriginalPrice())
                .discountAmount(booking.getDiscountAmount())
                .seats(booking.getSeatSnapshots())
                .bookingDate(booking.getBookingDate())
                .build();
    }
}
