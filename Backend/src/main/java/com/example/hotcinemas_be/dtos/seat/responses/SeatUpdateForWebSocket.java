package com.example.hotcinemas_be.dtos.seat.responses;

import com.example.hotcinemas_be.enums.SeatStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SeatUpdateForWebSocket {
    private long seatId;
    private long lockedByUserId;
    private SeatStatus status;

}
