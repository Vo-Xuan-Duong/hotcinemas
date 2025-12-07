package com.example.hotcinemas_be.services;

import com.example.hotcinemas_be.dtos.booking.responses.BookingDetailResponse;
import com.example.hotcinemas_be.dtos.seat.SeatSnapshot;
import com.example.hotcinemas_be.dtos.ticket.response.TicketResponse;
import com.example.hotcinemas_be.models.User;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SupportService {

    private final TemplateEngine templateEngine;
    private final BookingService bookingService;
    private final TicketService ticketService;
    private final JavaMailSender mailSender;
    private final AuthService authService;

    public String generateQRCodeBase64(String text, int width, int height){
        try{
            QRCodeWriter qrCodeWriter = new QRCodeWriter();

            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);

            byte[] pngData = pngOutputStream.toByteArray();
            return Base64.getEncoder().encodeToString(pngData);
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }


    public byte[] generateTicketPdf(List<TicketResponse> tickets) {
        List<Map<String, Object>> ticketDatas = new ArrayList<>();

        for (TicketResponse ticket : tickets) {
            Map<String, Object> ticketData = new HashMap<>();

            ticketData.put("movieName", ticket.getMovieTitle());
            ticketData.put("moviePosterUrl", ticket.getMoviePosterUrl());
            ticketData.put("cinemaName", ticket.getCinemaName());
            ticketData.put("cinemaAddress", ticket.getCinemaAddress());
            ticketData.put("roomName", ticket.getRoomName());
            ticketData.put("ticketCode", ticket.getTicketCode());

            String formattedTime = "";
            if (ticket.getShowtimeStartTime() != null && ticket.getShowtimeDateTime() != null) {
                DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("HH:mm");
                DateTimeFormatter dateFmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                formattedTime = ticket.getShowtimeStartTime().format(timeFmt) + " - " + ticket.getShowtimeDateTime().format(dateFmt);
            }
            ticketData.put("showTime", formattedTime);

            ticketData.put("seatName", ticket.getSeatName() != null ? ticket.getSeatName() : "Chưa chọn ghế");

            if (ticket.getTicketCode() != null) {
                try {
                    String qrBase64 = generateQRCodeBase64(ticket.getTicketCode(), 150, 150);
                    ticketData.put("qrCodeBase64", qrBase64);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            ticketDatas.add(ticketData);
        }

        // 2. Render PDF
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Context context = new Context();
            context.setVariable("ticketList", ticketDatas);

            String htmlContent = templateEngine.process("ticket", context);

            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();

            //            builder.useFont(() -> {
//                try {
//                    return new ClassPathResource("fonts/Roboto_Condensed-Regular.ttf").getInputStream();
//                } catch (IOException e) {
//                    return null;
//                }
//            }, "Roboto");
//            builder.useFont(() -> {
//                try {
//                    return new ClassPathResource("fonts/Roboto_Condensed-Bold.ttf").getInputStream();
//                } catch (IOException e) {
//                    return null;
//                }
//            }, "Roboto", 700, PdfRendererBuilder.FontStyle.NORMAL, true);
            builder.useFont(() -> {
                try {
                    return new ClassPathResource("fonts/NotoSansKR-Regular.ttf").getInputStream();
                } catch (IOException e) {
                    return null;
                }
            }, "NotoSansKR");

            builder.useFont(() -> {
                try {
                    return new ClassPathResource("fonts/NotoSansKR-Bold.ttf").getInputStream();
                } catch (IOException e) {
                    return null;
                }
            }, "NotoSansKR", 700, PdfRendererBuilder.FontStyle.NORMAL, true);

            builder.withHtmlContent(htmlContent, null);
            builder.toStream(outputStream);
            builder.run();

            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo file PDF: " + e.getMessage(), e);
        }
    }


    public byte[] generateBookingPdf(Long bookingId) {

        BookingDetailResponse booking = bookingService.getBookingById(bookingId);
        List<TicketResponse> ticketResponse = ticketService.getTicketsByBookingId(bookingId);

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            Map<String, Object> bookingData = new HashMap<>();

            bookingData.put("movieName", booking.getMovieTitle());
            bookingData.put("movieFormat", booking.getMovieFormat());
            bookingData.put("cinemaName", booking.getCinemaName());
            bookingData.put("roomName", booking.getRoomName());
            bookingData.put("bookingCode", booking.getBookingCode());

            String formattedTime1 = "";
            if (booking.getShowtimeStartTime() != null && booking.getShowtimeDateTime() != null) {
                DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("HH:mm");
                DateTimeFormatter dateFmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                formattedTime1 = booking.getShowtimeStartTime().format(timeFmt)
                        + " - "
                        + booking.getShowtimeDateTime().format(dateFmt);
            }
            bookingData.put("showTime", formattedTime1);

            String seatListStr = (booking.getSeats() != null && !booking.getSeats().isEmpty())
                    ? booking.getSeats().stream().map(SeatSnapshot::getSeatName).collect(Collectors.joining(", "))
                    : "Chưa chọn ghế";
            bookingData.put("seatList", seatListStr);

            bookingData.put("totalPrice", booking.getTotalPrice() != null ? formatCurrency(booking.getTotalPrice()) : "0đ");

            if (booking.getBookingCode() != null) {
                String qrBase64 = generateQRCodeBase64(booking.getBookingCode(), 400, 400);
                bookingData.put("qrCodeBase64", qrBase64);
            }

            String posterUrl = booking.getMoviePosterUrl();
            if (posterUrl != null && !posterUrl.isBlank()) {
                try {
                    // Hàm này phải trả về đầy đủ "data:image/jpg;base64,..."
                    String posterDataUri = fetchImageAsDataUri(posterUrl);
                    bookingData.put("moviePosterUrl", posterDataUri);
                } catch (Exception ex) {
                    System.err.println("Lỗi tải ảnh poster: " + ex.getMessage());
                    bookingData.put("moviePosterUrl", null); // Để HTML ẩn đi hoặc hiện ảnh default
                }
            } else {
                bookingData.put("moviePosterUrl", null);
            }

            List<Map<String, Object>> ticketDatas = new ArrayList<>();

            for (TicketResponse ticket : ticketResponse) {
                Map<String, Object> ticketData = new HashMap<>();

                ticketData.put("movieName", ticket.getMovieTitle());
                ticketData.put("moviePosterUrl", ticket.getMoviePosterUrl());
                ticketData.put("cinemaName", ticket.getCinemaName());
                ticketData.put("cinemaAddress", ticket.getCinemaAddress());
                ticketData.put("roomName", ticket.getRoomName());
                ticketData.put("ticketCode", ticket.getTicketCode());

                String formattedTime = "";
                if (ticket.getShowtimeStartTime() != null && ticket.getShowtimeDateTime() != null) {
                    DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("HH:mm");
                    DateTimeFormatter dateFmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                    formattedTime = ticket.getShowtimeStartTime().format(timeFmt) + " - " + ticket.getShowtimeDateTime().format(dateFmt);
                }
                ticketData.put("showTime", formattedTime);

                ticketData.put("seatName", ticket.getSeatName() != null ? ticket.getSeatName() : "Chưa chọn ghế");

                if (ticket.getTicketCode() != null) {
                    try {
                        String qrBase64 = generateQRCodeBase64(ticket.getTicketCode(), 150, 150);
                        ticketData.put("qrCodeBase64", qrBase64);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                ticketDatas.add(ticketData);
                log.info("Added ticket data for ticket code: " + ticket.getTicketCode());
            }

            Context context = new Context();
            context.setVariable("booking", bookingData);
            context.setVariable("ticketList", ticketDatas);
            String htmlContent = templateEngine.process("booking", context);

            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();

            builder.useFont(() -> {
                try {
                    return new ClassPathResource("fonts/NotoSansKR-Regular.ttf").getInputStream();
                } catch (IOException e) {
                    return null;
                }
            }, "NotoSansKR");

            builder.useFont(() -> {
                try {
                    return new ClassPathResource("fonts/NotoSansKR-Bold.ttf").getInputStream();
                } catch (IOException e) {
                    return null;
                }
            }, "NotoSansKR", 700, PdfRendererBuilder.FontStyle.NORMAL, true);

            builder.withHtmlContent(htmlContent, null);
            builder.toStream(outputStream);
            builder.run();

            return outputStream.toByteArray();

        } catch (Exception e) {
            e.printStackTrace(); // In lỗi ra console để debug
            throw new RuntimeException("Error creating PDF: " + e.getMessage(), e);
        }
    }

    private String formatCurrency(java.math.BigDecimal amount) {
        if (amount == null) return "0₫";
        Locale localeVN = new Locale("vi", "VN");
        NumberFormat currencyVN = NumberFormat.getCurrencyInstance(localeVN);
        return currencyVN.format(amount);
    }

    /**
     * Tải image từ URL (http/https) và trả về dạng data:image/<type>;base64,<base64data>
     * Sử dụng Java 11 HttpClient
     */
    private String fetchImageAsDataUri(String urlString) throws Exception {
        java.net.URL url = new java.net.URL(urlString);
        try (java.io.InputStream is = url.openStream();
             ByteArrayOutputStream os = new ByteArrayOutputStream()) {

            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = is.read(buffer)) != -1) {
                os.write(buffer, 0, bytesRead);
            }

            byte[] imageBytes = os.toByteArray();
            String base64 = Base64.getEncoder().encodeToString(imageBytes);

            // Đơn giản hóa: Giả sử poster luôn là JPEG hoặc PNG
            // Tốt nhất là check đuôi file, nhưng thường rạp phim là JPG
            return "data:image/jpeg;base64," + base64;
        }
    }

    public void sendTicketEmail(Long bookingId) {
        try{
            BookingDetailResponse booking = bookingService.getBookingById(bookingId);

            String subject = "Vé xem phim HotCinemas - Mã: " + booking.getBookingCode();
            String body = "<h3>Cảm ơn bạn đã đặt vé!</h3>"
                    + "<p>Thông tin vé của bạn được đính kèm trong email này.</p>"
                    + "<p>Vui lòng đưa mã QR cho nhân viên soát vé.</p>"
                    + "<br/><i>HotCinemas Team</i>";

            // Tạo MimeMessage
            MimeMessage message = mailSender.createMimeMessage();

            // 2. Sử dụng Helper để xử lý file đính kèm và encoding
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setFrom("hotcinemas.vn@gmail.com");
            helper.setTo(booking.getUserEmail());
            helper.setSubject(subject);
            helper.setText(body, true); // true = gửi dưới dạng HTML

            ByteArrayResource pdfResource = new ByteArrayResource(generateBookingPdf(bookingId));

            String attachmentFilename = "Ve_Xem_Phim_" + booking.getBookingCode() + ".pdf";

            helper.addAttachment(attachmentFilename, pdfResource);

            // 4. Gửi mail
            mailSender.send(message);
            System.out.println("Đã gửi mail vé thành công tới: " + booking.getUserEmail());

        }catch (Exception e){
            throw new RuntimeException("Error preparing email content: " + e.getMessage(), e);
        }
    }
}
