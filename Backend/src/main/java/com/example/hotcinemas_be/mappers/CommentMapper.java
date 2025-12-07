package com.example.hotcinemas_be.mappers;

import com.example.hotcinemas_be.dtos.comment.response.CommentResponse;
import com.example.hotcinemas_be.models.Comment;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {
    public CommentResponse mapToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .comment(comment.getComment())
                .rating(comment.getRating() != 0 ? comment.getRating() : null)
                .userId(comment.getUser().getId())
                .userName(comment.getUser().getFullName())
                .userAvatarUrl(comment.getUser().getAvatarUrl())
                .createdAt(comment.getCreatedAt())
                .replies(comment.getReplies() != null ? comment.getReplies().stream().map(this::mapToResponse).toList() : null)
                .build();
    }
}
