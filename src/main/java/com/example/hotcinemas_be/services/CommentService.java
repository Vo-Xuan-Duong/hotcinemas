package com.example.hotcinemas_be.services;

import com.example.hotcinemas_be.dtos.comment.request.CommentRequest;
import com.example.hotcinemas_be.dtos.comment.response.CommentResponse;
import com.example.hotcinemas_be.mappers.CommentMapper;
import com.example.hotcinemas_be.models.Comment;
import com.example.hotcinemas_be.models.Movie;
import com.example.hotcinemas_be.models.User;
import com.example.hotcinemas_be.repositorys.CommentRepository;
import com.example.hotcinemas_be.repositorys.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final MovieRepository movieRepository;
    private final AuthService authService;
    private final CommentMapper commentMapper;

    public CommentResponse createComment(CommentRequest commentRequest) {

        User user = authService.getCurrentUser();
        Movie movie = movieRepository.findById(commentRequest.getMovieId()).orElseThrow(
                () -> new RuntimeException("Movie not found")
        );

        Comment parentComment = null;

        if(commentRequest.getParentId() != null){
            parentComment = commentRepository.findById(commentRequest.getParentId()).orElseThrow(
                    () -> new RuntimeException("Parent comment not found")
            );
        }

        Comment comment = Comment.builder()
                .movie(movie)
                .user(user)
                .comment(commentRequest.getComment())
                .rating(commentRequest.getRating())
                .parentComment(parentComment)
                .build();

        Comment savedComment = commentRepository.save(comment);

        return commentMapper.mapToResponse(savedComment);
    }

    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(
                () -> new RuntimeException("Comment not found")
        );
        commentRepository.delete(comment);
    }

    public CommentResponse getCommentById(Long commentId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(
                () -> new RuntimeException("Comment not found")
        );
        return commentMapper.mapToResponse(comment);
    }

    public Page<CommentResponse> getCommentsByMovieId(Long movieId, Pageable pageable) {
        Movie movie = movieRepository.findById(movieId).orElseThrow(
                () -> new RuntimeException("Movie not found")
        );

        Page<Comment> commentsPage = commentRepository.findCommentsByMovieAndParentCommentIsNull(movie, pageable);

        return commentsPage.map(commentMapper::mapToResponse);
    }

    public CommentResponse updateComment(Long commentId, CommentRequest commentRequest) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(
                () -> new RuntimeException("Comment not found")
        );
        comment.setComment(commentRequest.getComment());
        comment.setRating(commentRequest.getRating());
        Comment updatedComment = commentRepository.save(comment);
        return commentMapper.mapToResponse(updatedComment);
    }

    public Double getAverageRatingByMovieId(Long movieId) {
        Movie movie = movieRepository.findById(movieId).orElseThrow(
                () -> new RuntimeException("Movie not found")
        );

        return commentRepository.findCommentsByMovieAndParentCommentIsNull(movie, Pageable.unpaged())
                .stream()
                .mapToInt(Comment::getRating)
                .average()
                .orElse(0.0);
    }

    public Long getCommentCountByMovieId(Long movieId) {
        Movie movie = movieRepository.findById(movieId).orElseThrow(
                () -> new RuntimeException("Movie not found")
        );

        return commentRepository.findCommentsByMovieAndParentCommentIsNull(movie, Pageable.unpaged())
                .getTotalElements();
    }
}
