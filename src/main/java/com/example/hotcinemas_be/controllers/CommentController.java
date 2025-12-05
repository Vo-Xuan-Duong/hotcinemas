package com.example.hotcinemas_be.controllers;

import com.example.hotcinemas_be.dtos.comment.request.CommentRequest;
import com.example.hotcinemas_be.dtos.common.ResponseData;
import com.example.hotcinemas_be.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody CommentRequest commentRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Comment added successfully")
                .data(commentService.createComment(commentRequest))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable Long commentId, @RequestBody CommentRequest commentRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Comment updated successfully")
                .data(commentService.updateComment(commentId, commentRequest))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Comment deleted successfully")
                .build();
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<?> getComment(@PathVariable Long commentId) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Comment retrieved successfully")
                .data(commentService.getCommentById(commentId))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<?> getCommentsByMovie(@PathVariable Long movieId, @PageableDefault(size = 5, page = 0) Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Comments retrieved successfully")
                .data(commentService.getCommentsByMovieId(movieId, pageable))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/average-rating/{movieId}")
    public ResponseEntity<?> getAverageRating(@PathVariable Long movieId) {
        Double averageRating = commentService.getAverageRatingByMovieId(movieId);
        Long countRating = commentService.getCommentCountByMovieId(movieId);
        Map<String, Object> ratingMap = new HashMap<>();
        ratingMap.put("averageRating", averageRating);
        ratingMap.put("countRating", countRating);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Average rating retrieved successfully")
                .data(ratingMap)
                .build();
        return ResponseEntity.ok(responseData);
    }
}
