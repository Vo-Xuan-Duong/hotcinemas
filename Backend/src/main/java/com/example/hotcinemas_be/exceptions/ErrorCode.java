package com.example.hotcinemas_be.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    ERROR_UNCATEGORIZED("CINEMA_001", "Error Unauthorized Access", HttpStatus.INTERNAL_SERVER_ERROR),
    ERROR_INVALID_REQUEST("CINEMA_002", "Invalid request", HttpStatus.BAD_REQUEST),
    ERROR_BAD_CREDENTIALS("CINEMA_003", "Bad credentials", HttpStatus.UNAUTHORIZED),
    ERROR_TOKEN_EXPIRED("CINEMA_004", "Token expired", HttpStatus.UNAUTHORIZED),
    ERROR_TOKEN_NOT_FOUND("CINEMA_005", "Token not found", HttpStatus.UNAUTHORIZED),
    ERROR_INVALID_TOKEN("CINEMA_006", "Invalid token", HttpStatus.UNAUTHORIZED),

    ERROR_MODEL_NOT_FOUND("CINEMA_010", "Model not found", HttpStatus.NOT_FOUND),
    ERROR_MODEL_ALREADY_EXISTS("CINEMA_011", "Model already exists", HttpStatus.CONFLICT),
    PASSWORD_NOT_MATCH("CINEMA_012", "Password does not match", HttpStatus.BAD_REQUEST),
    CONFIRM_PASSWORD_AND_PASSWORD_NOT_MATCH("CINEMA_013", "Confirm password and password does not match",
            HttpStatus.BAD_REQUEST),
    ERROR_REGISTRATION_FAILED("CINEMA_014", "Registration failed", HttpStatus.BAD_REQUEST),
    ERROR_UNAUTHORIZED("CINEMA_015", "Unauthorized access", HttpStatus.UNAUTHORIZED),
    ERROR_ACCESS_DENIED("CINEMA_016", "Access denied", HttpStatus.FORBIDDEN),
    ERROR_FORBIDDEN_OPERATION("CINEMA_017", "Forbidden operation", HttpStatus.FORBIDDEN),
    ERROR_RESOURCE_CONFLICT("CINEMA_018", "Resource conflict", HttpStatus.CONFLICT),
    ERROR_METHOD_NOT_ALLOWED("CINEMA_019", "Method not allowed", HttpStatus.METHOD_NOT_ALLOWED),
    ERROR_NOT_IMPLEMENTED("CINEMA_020", "Not implemented", HttpStatus.NOT_IMPLEMENTED),
    ERROR_SERVICE_UNAVAILABLE("CINEMA_021", "Service unavailable", HttpStatus.SERVICE_UNAVAILABLE),
    ERROR_DATABASE_ERROR("CINEMA_022", "Database error", HttpStatus.INTERNAL_SERVER_ERROR),
    ERROR_VALIDATION_FAILED("CINEMA_023", "Validation failed", HttpStatus.BAD_REQUEST),
    ERROR_RATE_LIMITED("CINEMA_024", "Too many requests", HttpStatus.TOO_MANY_REQUESTS),
    ERROR_FILE_UPLOAD_FAILED("CINEMA_025", "File upload failed", HttpStatus.BAD_REQUEST),
    ERROR_CLOUDINARY_UPLOAD_FAILED("CINEMA_026", "Cloudinary upload failed", HttpStatus.INTERNAL_SERVER_ERROR),
    ERROR_REDIS_OPERATION_FAILED("CINEMA_027", "Redis operation failed", HttpStatus.INTERNAL_SERVER_ERROR),
    ERROR_PERMISSION_NOT_FOUND("CINEMA_028", "Permission not found", HttpStatus.NOT_FOUND),
    ERROR_ROLE_NOT_FOUND("CINEMA_029", "Role not found", HttpStatus.NOT_FOUND),
    ERROR_MOVIE_NOT_FOUND("CINEMA_030", "Movie not found", HttpStatus.NOT_FOUND),
    ERROR_CINEMA_NOT_FOUND("CINEMA_031", "Cinema not found", HttpStatus.NOT_FOUND),
    ERROR_ROOM_NOT_FOUND("CINEMA_032", "Room not found", HttpStatus.NOT_FOUND),
    ERROR_SEAT_NOT_FOUND("CINEMA_033", "Seat not found", HttpStatus.NOT_FOUND),
    ERROR_SHOWTIME_NOT_FOUND("CINEMA_034", "Showtime not found", HttpStatus.NOT_FOUND),
    ERROR_BOOKING_NOT_FOUND("CINEMA_035", "Booking not found", HttpStatus.NOT_FOUND),
    ERROR_PAYMENT_FAILED("CINEMA_036", "Payment failed", HttpStatus.BAD_REQUEST),
    ERROR_TICKET_NOT_FOUND("CINEMA_037", "Ticket not found", HttpStatus.NOT_FOUND),
    ERROR_VOUCHER_NOT_FOUND("CINEMA_038", "Voucher not found", HttpStatus.NOT_FOUND),
    ERROR_GENRE_NOT_FOUND("CINEMA_039", "Genre not found", HttpStatus.NOT_FOUND),
    ERROR_REVIEW_NOT_FOUND("CINEMA_040", "Review not found", HttpStatus.NOT_FOUND),
    ERROR_DUPLICATE_RESOURCE("CINEMA_041", "Duplicate resource", HttpStatus.CONFLICT),
    ERROR_REFRESH_TOKEN_EXPIRED("CINEMA_042", "Refresh token expired", HttpStatus.UNAUTHORIZED),
    ERROR_REFRESH_TOKEN_REVOKED("CINEMA_043", "Refresh token revoked", HttpStatus.UNAUTHORIZED),
    ERROR_ACCOUNT_INACTIVE("CINEMA_044", "Account is inactive", HttpStatus.FORBIDDEN),
    ERROR_ACCOUNT_LOCKED("CINEMA_045", "Account is locked", HttpStatus.LOCKED),
    ERROR_PASSWORD_WEAK("CINEMA_046", "Weak password", HttpStatus.BAD_REQUEST),
    ERROR_JSON_PARSE("CINEMA_047", "Malformed JSON request", HttpStatus.BAD_REQUEST),
    ERROR_MEDIA_TYPE_NOT_SUPPORTED("CINEMA_048", "Unsupported media type", HttpStatus.UNSUPPORTED_MEDIA_TYPE),
    ERROR_REQUEST_TIMEOUT("CINEMA_049", "Request timeout", HttpStatus.REQUEST_TIMEOUT),
    ERROR_DEPENDENCY_FAILURE("CINEMA_050", "Downstream dependency failure", HttpStatus.FAILED_DEPENDENCY),
    ERROR_CINEMA_CLUSTER_NOT_FOUND("CINEMA_051", "Cinema cluster not found", HttpStatus.NOT_FOUND),
    ERROR_SHOWTIME_CONFLICT("CINEMA_052", "Showtime overlaps with an existing showtime in the same room", HttpStatus.CONFLICT),
    ERROR_INVALID_OPERATION("CINEMA_053", "Invalid operation" , HttpStatus.BAD_REQUEST),
    ERROR_MOVIE_CONFLICT("CINEMA_054", "Movie conflict", HttpStatus.CONFLICT),

    ERROR_VOUCHER_INVALID("CINEMA_055", "", HttpStatus.BAD_REQUEST),
    ERROR_VOUCHER_OUT_OF_STOCK("CINEMA_056", "", HttpStatus.BAD_REQUEST),
    ERROR_SEAT_ALREADY_LOCKED("CINEMA_057","" , HttpStatus.CONFLICT )
    ;

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }

}
