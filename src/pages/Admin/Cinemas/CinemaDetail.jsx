import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CinemaDetail.css';
import SeatManager from '../../../components/SeatManager';
import cinemaService from '../../../services/cinemaService'; // Import cinemaService

const CinemaDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cinema, setCinema] = useState(null);
    const [rooms, setRooms] = useState([]); // Changed from screens to rooms for clarity
    const [loading, setLoading] = useState(true);
    const [showAddRoom, setShowAddRoom] = useState(false); // Changed from showAddScreen
    const [showEditRoom, setShowEditRoom] = useState(false); // Changed from showEditScreen
    const [showSeatManager, setShowSeatManager] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null); // Changed from selectedScreen
    const [roomForm, setRoomForm] = useState({ // Changed from screenForm
        name: '',
        capacity: '',
        type: '2D',
        description: '',
        facilities: [],
        seatLayout: {
            rows: 10,
            seatsPerRow: 12,
            vipRows: []
        }
    });

    useEffect(() => {
        loadCinemaDetail();
    }, [id]);

    const loadCinemaDetail = async () => {
        setLoading(true);
        try {
            const response = await cinemaService.getCinemaById(id);
            setCinema(response.data);
            setRooms(response.data.rooms || []);
        } catch (error) {
            console.error('Error loading cinema detail:', error);
            // Optionally, show an error message to the user
        } finally {
            setLoading(false);
        }
    };

    const handleAddRoom = () => { // Changed from handleAddScreen
        setRoomForm({
            name: '',
            capacity: '',
            type: '2D',
            description: '',
            facilities: [],
            seatLayout: {
                rows: 10,
                seatsPerRow: 12,
                vipRows: []
            }
        });
        setShowAddRoom(true);
    };

    const handleEditRoom = (room) => { // Changed from handleEditScreen
        setSelectedRoom(room);
        setRoomForm({
            name: room.name || '',
            capacity: room.capacity || '',
            type: room.type || '2D',
            description: room.description || '',
            facilities: room.facilities || [],
            seatLayout: room.seatLayout || {
                rows: 10,
                seatsPerRow: 12,
                vipRows: []
            }
        });
        setShowEditRoom(true);
    };

    const handleDeleteRoom = async (roomId) => { // Changed from handleDeleteScreen
        if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
            try {
                await cinemaService.deleteRoom(id, roomId);
                await loadCinemaDetail(); // Reload data
            } catch (error) {
                console.error('Error deleting room:', error);
                alert('Xóa phòng thất bại. Vui lòng thử lại.');
            }
        }
    };

    const handleSubmitRoom = async (e) => { // Changed from handleSubmitScreen
        e.preventDefault();

        try {
            if (showEditRoom) {
                await cinemaService.updateRoom(id, selectedRoom.id, roomForm);
            } else {
                await cinemaService.addRoom(id, roomForm);
            }
            setShowAddRoom(false);
            setShowEditRoom(false);
            setSelectedRoom(null);
            await loadCinemaDetail(); // Reload data
        } catch (error) {
            console.error('Error saving room:', error);
            alert('Lưu thông tin phòng thất bại. Vui lòng thử lại.');
        }
    };

    const addFacility = () => {
        setRoomForm({
            ...roomForm,
            facilities: [...roomForm.facilities, '']
        });
    };

    const removeFacility = (index) => {
        const newFacilities = roomForm.facilities.filter((_, i) => i !== index);
        setRoomForm({
            ...roomForm,
            facilities: newFacilities
        });
    };

    const updateFacility = (index, value) => {
        const newFacilities = [...roomForm.facilities];
        newFacilities[index] = value;
        setRoomForm({
            ...roomForm,
            facilities: newFacilities
        });
    };

    const addVipRow = () => {
        const newVipRows = [...(roomForm.seatLayout.vipRows || []), ''];
        setRoomForm({
            ...roomForm,
            seatLayout: {
                ...roomForm.seatLayout,
                vipRows: newVipRows
            }
        });
    };

    const removeVipRow = (index) => {
        const newVipRows = roomForm.seatLayout.vipRows.filter((_, i) => i !== index);
        setRoomForm({
            ...roomForm,
            seatLayout: {
                ...roomForm.seatLayout,
                vipRows: newVipRows
            }
        });
    };

    const updateVipRow = (index, value) => {
        const newVipRows = [...roomForm.seatLayout.vipRows];
        newVipRows[index] = value;
        setRoomForm({
            ...roomForm,
            seatLayout: {
                ...roomForm.seatLayout,
                vipRows: newVipRows
            }
        });
    };

    const handleManageSeats = (room) => { // Changed from handleManageSeats
        setSelectedRoom(room);
        setShowSeatManager(true);
    };

    const saveSeatLayout = async (seatLayoutData) => { // Changed from saveSeatLayout
        if (!selectedRoom) return;

        const updatedRoom = { ...selectedRoom, seatLayout: seatLayoutData };

        try {
            await cinemaService.updateRoom(id, selectedRoom.id, updatedRoom);
            setShowSeatManager(false);
            setSelectedRoom(null);
            await loadCinemaDetail(); // Reload data
        } catch (error) {
            console.error('Error saving seat layout:', error);
            alert('Lưu sơ đồ ghế thất bại. Vui lòng thử lại.');
        }
    };

    if (loading) {
        return <div className="admin-loading">Đang tải...</div>;
    }

    if (!cinema) {
        return <div className="admin-error">Không tìm thấy rạp phim</div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div className="header-left">
                    <button className="btn-back" onClick={() => navigate('/admin/cinemas')}>
                        ← Quay lại
                    </button>
                    <div>
                        <h1 className="admin-title">Chi tiết rạp: {cinema.name}</h1>
                        <p className="admin-subtitle">{cinema.address}</p>
                    </div>
                </div>
                <div className="header-right">
                    <button className="btn btn-primary" onClick={handleAddRoom}>+ Thêm phòng chiếu</button>
                </div>
            </div>

            <div className="admin-content">
                <div className="cinema-screens-list">
                    <h2>Danh sách phòng chiếu</h2>
                    {rooms.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Tên phòng</th>
                                    <th>Loại</th>
                                    <th>Sức chứa</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map(room => (
                                    <tr key={room.id}>
                                        <td>{room.name}</td>
                                        <td>{room.type}</td>
                                        <td>{room.capacity}</td>
                                        <td>
                                            <button className="btn-action btn-edit" onClick={() => handleEditRoom(room)}>Sửa</button>
                                            <button className="btn-action btn-delete" onClick={() => handleDeleteRoom(room.id)}>Xóa</button>
                                            <button className="btn-action btn-manage-seats" onClick={() => handleManageSeats(room)}>Quản lý ghế</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Chưa có phòng chiếu nào.</p>
                    )}
                </div>
            </div>

            {(showAddRoom || showEditRoom) && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <form onSubmit={handleSubmitRoom}>
                            <h2>{showEditRoom ? 'Sửa phòng chiếu' : 'Thêm phòng chiếu'}</h2>

                            <div className="form-group">
                                <label>Tên phòng</label>
                                <input
                                    type="text"
                                    value={roomForm.name}
                                    onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Sức chứa</label>
                                <input
                                    type="number"
                                    value={roomForm.capacity}
                                    onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Loại phòng</label>
                                <select
                                    value={roomForm.type}
                                    onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                                >
                                    <option value="2D">2D</option>
                                    <option value="3D">3D</option>
                                    <option value="IMAX">IMAX</option>
                                    <option value="4DX">4DX</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Mô tả</label>
                                <textarea
                                    value={roomForm.description}
                                    onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Tiện ích</label>
                                {roomForm.facilities.map((facility, index) => (
                                    <div key={index} className="facility-input">
                                        <input
                                            type="text"
                                            value={facility}
                                            onChange={(e) => updateFacility(index, e.target.value)}
                                        />
                                        <button type="button" onClick={() => removeFacility(index)}>Xóa</button>
                                    </div>
                                ))}
                                <button type="button" onClick={addFacility}>+ Thêm tiện ích</button>
                            </div>

                            <div className="form-group">
                                <label>Sơ đồ ghế</label>
                                <div className="seat-layout-inputs">
                                    <div>
                                        <label>Số hàng</label>
                                        <input
                                            type="number"
                                            value={roomForm.seatLayout.rows}
                                            onChange={(e) => setRoomForm({ ...roomForm, seatLayout: { ...roomForm.seatLayout, rows: parseInt(e.target.value) } })}
                                        />
                                    </div>
                                    <div>
                                        <label>Ghế mỗi hàng</label>
                                        <input
                                            type="number"
                                            value={roomForm.seatLayout.seatsPerRow}
                                            onChange={(e) => setRoomForm({ ...roomForm, seatLayout: { ...roomForm.seatLayout, seatsPerRow: parseInt(e.target.value) } })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Hàng ghế VIP (ví dụ: A,B,C)</label>
                                {(roomForm.seatLayout.vipRows || []).map((row, index) => (
                                    <div key={index} className="vip-row-input">
                                        <input
                                            type="text"
                                            value={row}
                                            onChange={(e) => updateVipRow(index, e.target.value)}
                                            placeholder="Nhập ký tự hàng (vd: A)"
                                        />
                                        <button type="button" onClick={() => removeVipRow(index)}>Xóa</button>
                                    </div>
                                ))}
                                <button type="button" onClick={addVipRow}>+ Thêm hàng VIP</button>
                            </div>


                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">Lưu</button>
                                <button type="button" className="btn" onClick={() => { setShowAddRoom(false); setShowEditRoom(false); }}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showSeatManager && selectedRoom && (
                <SeatManager
                    screen={selectedRoom}
                    onSave={saveSeatLayout}
                    onClose={() => setShowSeatManager(false)}
                />
            )}
        </div>
    );
};

export default CinemaDetail;
