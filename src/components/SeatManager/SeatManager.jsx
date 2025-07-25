import React, { useState, useEffect } from 'react';
import './SeatManager.css';

const SeatManager = ({
    selectedScreen,
    onSave,
    onClose,
    initialSeatLayout = null
}) => {
    const [seatLayout, setSeatLayout] = useState({
        rows: [],
        totalSeats: 0,
        vipSeats: [],
        blockedSeats: []
    });

    // State for seat editing modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSeat, setEditingSeat] = useState(null);
    const [editingPosition, setEditingPosition] = useState({ rowIndex: -1, seatIndex: -1 });
    const [seatEditForm, setSeatEditForm] = useState({
        id: '',
        number: '',
        type: 'regular',
        status: 'available',
        price: 100000
    });

    // State for bulk operations
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkEditForm, setBulkEditForm] = useState({
        type: 'regular',
        status: 'available',
        price: 100000
    });
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);

    useEffect(() => {
        if (selectedScreen) {
            generateSeatLayout(selectedScreen);
        }
    }, [selectedScreen]);

    const generateSeatLayout = (screen) => {
        const layout = screen.seatLayout || { rows: 10, seatsPerRow: 12, vipRows: [] };
        const rows = [];
        const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (let i = 0; i < layout.rows; i++) {
            const rowLabel = rowLabels[i];
            const seats = [];

            for (let j = 1; j <= layout.seatsPerRow; j++) {
                const seatId = `${rowLabel}${j}`;
                const isVip = layout.vipRows.includes(rowLabel);

                // Check if seat data exists in initial layout
                let existingSeat = null;
                if (layout.seats) {
                    existingSeat = layout.seats.find(seat => seat.id === seatId);
                }

                seats.push({
                    id: seatId,
                    row: rowLabel,
                    number: j,
                    type: existingSeat?.type || (isVip ? 'vip' : 'regular'),
                    status: existingSeat?.status || 'available',
                    price: existingSeat?.price || (isVip ? 150000 : 100000)
                });
            }

            rows.push({
                label: rowLabel,
                seats: seats,
                isVip: layout.vipRows.includes(rowLabel)
            });
        }

        setSeatLayout({
            rows: rows,
            totalSeats: layout.rows * layout.seatsPerRow,
            vipSeats: layout.vipRows,
            blockedSeats: []
        });
    };

    const toggleSeatStatus = (rowIndex, seatIndex) => {
        const newRows = [...seatLayout.rows];
        const currentStatus = newRows[rowIndex].seats[seatIndex].status;

        // Cycle through statuses: available -> blocked -> maintenance -> available
        const statusCycle = {
            'available': 'blocked',
            'blocked': 'maintenance',
            'maintenance': 'available'
        };

        newRows[rowIndex].seats[seatIndex].status = statusCycle[currentStatus];

        setSeatLayout({
            ...seatLayout,
            rows: newRows
        });
    };

    const toggleSeatType = (rowIndex, seatIndex) => {
        const newRows = [...seatLayout.rows];
        const currentType = newRows[rowIndex].seats[seatIndex].type;

        // Cycle through seat types: regular -> vip -> couple -> regular
        const typeCycle = {
            'regular': 'vip',
            'vip': 'couple',
            'couple': 'regular'
        };

        const newType = typeCycle[currentType];

        // Set price based on type
        let newPrice = 100000;
        if (newType === 'vip') newPrice = 150000;
        else if (newType === 'couple') newPrice = 200000;

        newRows[rowIndex].seats[seatIndex].type = newType;
        newRows[rowIndex].seats[seatIndex].price = newPrice;

        // Update row VIP status
        const hasVipSeat = newRows[rowIndex].seats.some(seat => seat.type === 'vip' || seat.type === 'couple');
        newRows[rowIndex].isVip = hasVipSeat;

        setSeatLayout({
            ...seatLayout,
            rows: newRows
        });
    };

    const handleSave = () => {
        // Prepare seat layout data to save
        const seatLayoutData = {
            rows: seatLayout.rows.length,
            seatsPerRow: seatLayout.rows[0]?.seats.length || 0,
            vipRows: seatLayout.rows.filter(row => row.isVip).map(row => row.label),
            seats: seatLayout.rows.flatMap(row => row.seats)
        };

        onSave(seatLayoutData);
    };

    const handleReset = () => {
        if (selectedScreen) {
            generateSeatLayout(selectedScreen);
        }
    };

    // Handle seat editing
    const handleSeatEdit = (seat, rowIndex, seatIndex) => {
        setEditingSeat(seat);
        setEditingPosition({ rowIndex, seatIndex });
        setSeatEditForm({
            id: seat.id,
            number: seat.number,
            type: seat.type,
            status: seat.status,
            price: seat.price
        });
        setShowEditModal(true);
    };

    const handleSeatEditSave = () => {
        const newRows = [...seatLayout.rows];
        const { rowIndex, seatIndex } = editingPosition;

        // Update seat with new information
        newRows[rowIndex].seats[seatIndex] = {
            ...newRows[rowIndex].seats[seatIndex],
            id: seatEditForm.id,
            number: parseInt(seatEditForm.number),
            type: seatEditForm.type,
            status: seatEditForm.status,
            price: parseInt(seatEditForm.price)
        };

        // Update row VIP status if needed
        const hasVipSeat = newRows[rowIndex].seats.some(seat => seat.type === 'vip' || seat.type === 'couple');
        newRows[rowIndex].isVip = hasVipSeat;

        setSeatLayout({
            ...seatLayout,
            rows: newRows
        });

        setShowEditModal(false);
        setEditingSeat(null);
    };

    const handleSeatEditCancel = () => {
        setShowEditModal(false);
        setEditingSeat(null);
        setSeatEditForm({
            id: '',
            number: '',
            type: 'regular',
            status: 'available',
            price: 100000
        });
    };

    // Handle bulk operations
    const handleSeatSelect = (seat, rowIndex, seatIndex) => {
        const seatKey = `${rowIndex}-${seatIndex}`;
        if (selectedSeats.includes(seatKey)) {
            setSelectedSeats(selectedSeats.filter(key => key !== seatKey));
        } else {
            setSelectedSeats([...selectedSeats, seatKey]);
        }
    };

    const handleBulkEdit = () => {
        if (selectedSeats.length === 0) {
            alert('Vui lòng chọn ít nhất một ghế để chỉnh sửa');
            return;
        }
        setShowBulkModal(true);
    };

    const handleBulkSave = () => {
        const newRows = [...seatLayout.rows];

        selectedSeats.forEach(seatKey => {
            const [rowIndex, seatIndex] = seatKey.split('-').map(Number);
            newRows[rowIndex].seats[seatIndex] = {
                ...newRows[rowIndex].seats[seatIndex],
                type: bulkEditForm.type,
                status: bulkEditForm.status,
                price: parseInt(bulkEditForm.price)
            };

            // Update row VIP status
            const hasVipSeat = newRows[rowIndex].seats.some(seat => seat.type === 'vip' || seat.type === 'couple');
            newRows[rowIndex].isVip = hasVipSeat;
        });

        setSeatLayout({
            ...seatLayout,
            rows: newRows
        });

        setShowBulkModal(false);
        setSelectedSeats([]);
        setIsSelectMode(false);
    };

    const handleBulkCancel = () => {
        setShowBulkModal(false);
        setSelectedSeats([]);
        setIsSelectMode(false);
    };

    const toggleSelectMode = () => {
        setIsSelectMode(!isSelectMode);
        setSelectedSeats([]);
    };

    // Handle seat deletion
    const handleSeatDelete = (rowIndex, seatIndex) => {
        if (confirm('Bạn có chắc muốn xóa ghế này?')) {
            const newRows = [...seatLayout.rows];
            newRows[rowIndex].seats.splice(seatIndex, 1);

            // Update row VIP status
            const hasVipSeat = newRows[rowIndex].seats.some(seat => seat.type === 'vip' || seat.type === 'couple');
            newRows[rowIndex].isVip = hasVipSeat;

            setSeatLayout({
                ...seatLayout,
                rows: newRows
            });
        }
    };

    // Handle adding new seat to a row
    const handleAddSeatToRow = (rowIndex) => {
        const newRows = [...seatLayout.rows];
        const row = newRows[rowIndex];
        const newSeatNumber = row.seats.length + 1;
        const newSeatId = `${row.label}${newSeatNumber}`;

        const newSeat = {
            id: newSeatId,
            row: row.label,
            number: newSeatNumber,
            type: 'regular',
            status: 'available',
            price: 100000
        };

        newRows[rowIndex].seats.push(newSeat);

        setSeatLayout({
            ...seatLayout,
            rows: newRows
        });
    };

    // Handle adding new row
    const handleAddRow = () => {
        const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const newRowIndex = seatLayout.rows.length;

        if (newRowIndex >= 26) {
            alert('Không thể thêm quá 26 hàng ghế');
            return;
        }

        const newRowLabel = rowLabels[newRowIndex];
        const seatsPerRow = seatLayout.rows[0]?.seats.length || 12;
        const seats = [];

        for (let j = 1; j <= seatsPerRow; j++) {
            const seatId = `${newRowLabel}${j}`;
            seats.push({
                id: seatId,
                row: newRowLabel,
                number: j,
                type: 'regular',
                status: 'available',
                price: 100000
            });
        }

        const newRow = {
            label: newRowLabel,
            seats: seats,
            isVip: false
        };

        setSeatLayout({
            ...seatLayout,
            rows: [...seatLayout.rows, newRow]
        });
    };

    // Toggle delete mode
    const toggleDeleteMode = () => {
        setIsDeleteMode(!isDeleteMode);
        setSelectedSeats([]);
        setIsSelectMode(false);
    };

    const getSeatStats = () => {
        const totalSeats = seatLayout.rows.reduce((total, row) => total + row.seats.length, 0);
        const vipSeats = seatLayout.rows.reduce((total, row) => {
            return total + row.seats.filter(seat => seat.type === 'vip' || seat.type === 'couple').length;
        }, 0);
        const blockedSeats = seatLayout.rows.reduce((total, row) => {
            return total + row.seats.filter(seat => seat.status === 'blocked').length;
        }, 0);
        const maintenanceSeats = seatLayout.rows.reduce((total, row) => {
            return total + row.seats.filter(seat => seat.status === 'maintenance').length;
        }, 0);

        return { totalSeats, vipSeats, blockedSeats, maintenanceSeats };
    };

    const stats = getSeatStats();

    return (
        <div className="modal-overlay">
            <div className="modal seat-manager-modal">
                <div className="modal-header">
                    <div className="seat-manager-header">
                        <h2>Quản lý ghế - {selectedScreen.name}</h2>
                        <div className="seat-stats">
                            <span>Tổng: {stats.totalSeats}</span>
                            <span>VIP: {stats.vipSeats}</span>
                            <span>Bị chặn: {stats.blockedSeats}</span>
                            <span>Bảo trì: {stats.maintenanceSeats}</span>
                        </div>
                    </div>
                    <button onClick={onClose}>&times;</button>
                </div>

                <div className="seat-layout">
                    <div className="screen-display"></div>

                    <div className="seat-rows">
                        {seatLayout.rows.map((row, rowIndex) => (
                            <div key={row.label} className="seat-row">
                                <div className="row-label">{row.label}</div>
                                {row.seats.map((seat, seatIndex) => {
                                    const seatKey = `${rowIndex}-${seatIndex}`;
                                    const isSelected = selectedSeats.includes(seatKey);

                                    return (
                                        <div
                                            key={seat.id}
                                            className={`seat ${seat.type} ${seat.status} ${isSelected ? 'selected' : ''} ${isDeleteMode ? 'delete-mode' : ''}`}
                                            onClick={() => {
                                                if (isDeleteMode) {
                                                    handleSeatDelete(rowIndex, seatIndex);
                                                } else if (isSelectMode) {
                                                    handleSeatSelect(seat, rowIndex, seatIndex);
                                                } else {
                                                    toggleSeatStatus(rowIndex, seatIndex);
                                                }
                                            }}
                                            onDoubleClick={() => {
                                                if (!isSelectMode && !isDeleteMode) {
                                                    toggleSeatType(rowIndex, seatIndex);
                                                }
                                            }}
                                            onContextMenu={(e) => {
                                                e.preventDefault();
                                                if (!isSelectMode && !isDeleteMode) {
                                                    handleSeatEdit(seat, rowIndex, seatIndex);
                                                }
                                            }}
                                            title={`${seat.id} - ${seat.type} - ${seat.status} - ${seat.price.toLocaleString()}đ\n${isDeleteMode ? 'Click để xóa ghế' :
                                                isSelectMode ? 'Click để chọn/bỏ chọn' :
                                                    'Click phải để chỉnh sửa'
                                                }`}
                                        >
                                            {seat.number}
                                        </div>
                                    );
                                })}

                                {/* Add seat button */}
                                <button
                                    className="add-seat-btn"
                                    onClick={() => handleAddSeatToRow(rowIndex)}
                                    title="Thêm ghế vào hàng này"
                                >
                                    +
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="seat-legend">
                        <div className="legend-item">
                            <div className="legend-seat regular available"></div>
                            <span>🪑 Thường - Trống</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-seat vip available"></div>
                            <span>⭐ VIP - Trống</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-seat couple available"></div>
                            <span>👫 Ghế đôi - Trống</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-seat regular blocked"></div>
                            <span>🚫 Bị chặn</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-seat regular maintenance"></div>
                            <span>🔧 Bảo trì thường</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-seat vip maintenance"></div>
                            <span>🔧 Bảo trì VIP</span>
                        </div>
                    </div>
                </div>

                <div className="seat-controls">
                    <div className="control-group">
                        <label>Chế độ chỉnh sửa:</label>
                        <div className="control-buttons">
                            <button
                                type="button"
                                onClick={toggleSelectMode}
                                className={`btn-toggle ${isSelectMode ? 'active' : ''}`}
                                disabled={isDeleteMode}
                            >
                                {isSelectMode ? 'Thoát chế độ chọn' : 'Chọn nhiều ghế'}
                            </button>
                            <button
                                type="button"
                                onClick={toggleDeleteMode}
                                className={`btn-toggle ${isDeleteMode ? 'active delete-active' : ''}`}
                                disabled={isSelectMode}
                            >
                                {isDeleteMode ? 'Thoát chế độ xóa' : 'Chế độ xóa ghế'}
                            </button>
                            <button
                                type="button"
                                onClick={handleAddRow}
                                className="btn-toggle"
                                disabled={isSelectMode || isDeleteMode}
                                title="Thêm hàng ghế mới"
                            >
                                + Thêm hàng ghế
                            </button>
                            {isSelectMode && (
                                <button
                                    type="button"
                                    onClick={handleBulkEdit}
                                    className="btn-primary"
                                    disabled={selectedSeats.length === 0}
                                >
                                    Chỉnh sửa ({selectedSeats.length})
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="control-group">
                        <label>Hướng dẫn sử dụng:</label>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.3' }}>
                            {isDeleteMode ? (
                                <div>• Click vào ghế để xóa</div>
                            ) : isSelectMode ? (
                                <div>• Click để chọn/bỏ chọn ghế</div>
                            ) : (
                                <>
                                    <div>• Click 1 lần: Đổi trạng thái ghế</div>
                                    <div>• Double-click: Đổi loại ghế (Thường → VIP → Ghế đôi)</div>
                                    <div>• Click phải: Chỉnh sửa thông tin ghế</div>
                                    <div>• Nút (+) cuối mỗi hàng: Thêm ghế vào hàng đó</div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button type="button" onClick={handleReset} className="btn-secondary">
                        Đặt Lại
                    </button>
                    <button type="button" onClick={handleSave} className="btn-primary">
                        Lưu Bố Trí
                    </button>
                </div>
            </div>

            {/* Seat Edit Modal */}
            {showEditModal && (
                <div className="modal-overlay" style={{ zIndex: 1001 }}>
                    <div className="modal seat-edit-modal">
                        <div className="modal-header">
                            <div className="header-content">
                                <div className="seat-icon">
                                    <div className={`seat-preview ${seatEditForm.type} ${seatEditForm.status}`}>
                                        {seatEditForm.number}
                                    </div>
                                </div>
                                <div className="header-text">
                                    <h3>Chỉnh sửa ghế {editingSeat?.id}</h3>
                                    <p>Cập nhật thông tin ghế</p>
                                </div>
                            </div>
                            <button className="close-btn" onClick={handleSeatEditCancel}>
                                <span>&times;</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>
                                        <span className="label-icon">🏷️</span>
                                        Mã ghế
                                    </label>
                                    <input
                                        type="text"
                                        value={seatEditForm.id}
                                        onChange={(e) => setSeatEditForm({
                                            ...seatEditForm,
                                            id: e.target.value
                                        })}
                                        className="form-input"
                                        placeholder="Ví dụ: A1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <span className="label-icon">🔢</span>
                                        Số ghế
                                    </label>
                                    <input
                                        type="number"
                                        value={seatEditForm.number}
                                        onChange={(e) => setSeatEditForm({
                                            ...seatEditForm,
                                            number: e.target.value
                                        })}
                                        className="form-input"
                                        placeholder="1"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <span className="label-icon">🪑</span>
                                    Loại ghế
                                </label>
                                <div className="seat-type-selector">
                                    <div
                                        className={`seat-type-option ${seatEditForm.type === 'regular' ? 'active' : ''}`}
                                        onClick={() => setSeatEditForm({
                                            ...seatEditForm,
                                            type: 'regular',
                                            price: 100000
                                        })}
                                    >
                                        <div className="seat-type-icon regular"></div>
                                        <div className="seat-type-info">
                                            <span className="seat-type-name">Thường</span>
                                            <span className="seat-type-price">100,000đ</span>
                                        </div>
                                    </div>
                                    <div
                                        className={`seat-type-option ${seatEditForm.type === 'vip' ? 'active' : ''}`}
                                        onClick={() => setSeatEditForm({
                                            ...seatEditForm,
                                            type: 'vip',
                                            price: 150000
                                        })}
                                    >
                                        <div className="seat-type-icon vip"></div>
                                        <div className="seat-type-info">
                                            <span className="seat-type-name">VIP</span>
                                            <span className="seat-type-price">150,000đ</span>
                                        </div>
                                    </div>
                                    <div
                                        className={`seat-type-option ${seatEditForm.type === 'couple' ? 'active' : ''}`}
                                        onClick={() => setSeatEditForm({
                                            ...seatEditForm,
                                            type: 'couple',
                                            price: 200000
                                        })}
                                    >
                                        <div className="seat-type-icon couple"></div>
                                        <div className="seat-type-info">
                                            <span className="seat-type-name">Ghế đôi</span>
                                            <span className="seat-type-price">200,000đ</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <span className="label-icon">🔧</span>
                                    Trạng thái
                                </label>
                                <div className="status-selector">
                                    <div
                                        className={`status-option ${seatEditForm.status === 'available' ? 'active' : ''}`}
                                        onClick={() => setSeatEditForm({
                                            ...seatEditForm,
                                            status: 'available'
                                        })}
                                    >
                                        <div className="status-icon available"></div>
                                        <span>Trống</span>
                                    </div>
                                    <div
                                        className={`status-option ${seatEditForm.status === 'blocked' ? 'active' : ''}`}
                                        onClick={() => setSeatEditForm({
                                            ...seatEditForm,
                                            status: 'blocked'
                                        })}
                                    >
                                        <div className="status-icon blocked"></div>
                                        <span>Bị chặn</span>
                                    </div>
                                    <div
                                        className={`status-option ${seatEditForm.status === 'maintenance' ? 'active' : ''}`}
                                        onClick={() => setSeatEditForm({
                                            ...seatEditForm,
                                            status: 'maintenance'
                                        })}
                                    >
                                        <div className="status-icon maintenance"></div>
                                        <span>Bảo trì</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <span className="label-icon">💰</span>
                                    Giá vé
                                </label>
                                <div className="price-input-wrapper">
                                    <input
                                        type="number"
                                        value={seatEditForm.price}
                                        onChange={(e) => setSeatEditForm({
                                            ...seatEditForm,
                                            price: e.target.value
                                        })}
                                        className="form-input price-input"
                                        step="1000"
                                        min="0"
                                    />
                                    <span className="price-unit">VND</span>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={handleSeatEditCancel}
                                className="btn-secondary"
                            >
                                <span>❌</span>
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleSeatEditSave}
                                className="btn-primary"
                            >
                                <span>✅</span>
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Edit Modal */}
            {showBulkModal && (
                <div className="modal-overlay" style={{ zIndex: 1001 }}>
                    <div className="modal bulk-edit-modal">
                        <div className="modal-header">
                            <h3>Chỉnh sửa {selectedSeats.length} ghế</h3>
                            <button onClick={handleBulkCancel}>&times;</button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>Loại ghế:</label>
                                <select
                                    value={bulkEditForm.type}
                                    onChange={(e) => setBulkEditForm({
                                        ...bulkEditForm,
                                        type: e.target.value,
                                        price: e.target.value === 'vip' ? 150000 : e.target.value === 'couple' ? 200000 : 100000
                                    })}
                                    className="form-select"
                                >
                                    <option value="regular">Thường</option>
                                    <option value="vip">VIP</option>
                                    <option value="couple">Ghế đôi</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Trạng thái:</label>
                                <select
                                    value={bulkEditForm.status}
                                    onChange={(e) => setBulkEditForm({
                                        ...bulkEditForm,
                                        status: e.target.value
                                    })}
                                    className="form-select"
                                >
                                    <option value="available">Trống</option>
                                    <option value="blocked">Bị chặn</option>
                                    <option value="maintenance">Bảo trì</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Giá vé (VND):</label>
                                <input
                                    type="number"
                                    value={bulkEditForm.price}
                                    onChange={(e) => setBulkEditForm({
                                        ...bulkEditForm,
                                        price: e.target.value
                                    })}
                                    className="form-input"
                                    step="1000"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={handleBulkCancel}
                                className="btn-secondary"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleBulkSave}
                                className="btn-primary"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatManager;
