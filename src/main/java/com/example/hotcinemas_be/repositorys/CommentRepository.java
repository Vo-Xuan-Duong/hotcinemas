package com.example.hotcinemas_be.repositorys;

import com.example.hotcinemas_be.models.Comment;
import com.example.hotcinemas_be.models.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment,Long> {
    Page<Comment> findCommentsByMovie(Movie movie, Pageable pageable);

    Page<Comment> findCommentsByMovieAndParentCommentIsNull(Movie movie, Pageable pageable);
}
