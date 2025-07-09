import React, { useState } from 'react';
import './Admin.css';
import { mockMovies } from '../../utils/movieData';

const PAGE_SIZE = 2;

const AdminMovies = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(mockMovies.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const moviesPage = mockMovies.slice(startIdx, endIdx);

  return (
    <div className="admin-page">
      <h2>Quản lý phim</h2>
      <button className="admin-add-btn">+ Thêm phim</button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên phim</th>
            <th>Thể loại</th>
            <th>Năm</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {moviesPage.map(m => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.title}</td>
              <td>{m.genre}</td>
              <td>{m.releaseDate ? m.releaseDate.split('.').pop() : ''}</td>
              <td>
                <button className="admin-edit-btn">Sửa</button>
                <button className="admin-delete-btn">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="admin-pagination">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Trước</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i+1}
            className={currentPage === i+1 ? 'active' : ''}
            onClick={() => setCurrentPage(i+1)}
          >{i+1}</button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Sau</button>
      </div>
    </div>
  );
};

export default AdminMovies; 