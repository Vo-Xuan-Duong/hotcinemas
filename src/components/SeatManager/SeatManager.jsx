import React, { useState, useEffect, useRef } from 'react';
import {
    Card,
    Button,
    Row,
    Col,
    Space,
    Tag,
    Select,
    InputNumber,
    Modal,
    Form,
    Input,
    message,
    Divider,
    Tooltip,
    Typography,
    Badge
} from 'antd';
import {
    SaveOutlined,
    ReloadOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    BlockOutlined,
    ToolOutlined,
    StarOutlined,
    UserOutlined,
    HeartOutlined,
    PlusOutlined,
    MinusOutlined,
    ClockCircleOutlined,
    CloseOutlined
} from '@ant-design/icons';
import './SeatManager.css';
import seatService from '../../services/seatService';

const { Title, Text } = Typography;
const { Option } = Select;

const SeatManager = ({ selectedScreen, onSave, onClose }) => {
    const [seatLayout, setSeatLayout] = useState({
        rows: [],
        totalSeats: 0,
        vipSeats: [],
        blockedSeats: []
    });

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkForm] = Form.useForm();

    // State cho modal chỉnh sửa ghế đơn lẻ
    const [showSeatEditModal, setShowSeatEditModal] = useState(false);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [seatEditForm] = Form.useForm();

    // Ref cho scroll indicator
    const seatLayoutRef = useRef(null);

    useEffect(() => {
        if (selectedScreen) {
            loadSeatsFromAPI(selectedScreen);
        }
    }, [selectedScreen]);

    // Handle scroll indicator
    useEffect(() => {
        const seatLayoutEl = seatLayoutRef.current;
        if (!seatLayoutEl) return;

        const handleScroll = () => {
            const { scrollTop } = seatLayoutEl;
            if (scrollTop > 10) {
                seatLayoutEl.classList.add('scrolled');
            } else {
                seatLayoutEl.classList.remove('scrolled');
            }
        };

        seatLayoutEl.addEventListener('scroll', handleScroll);
        return () => seatLayoutEl.removeEventListener('scroll', handleScroll);
    }, []);

    const loadSeatsFromAPI = async (screen) => {
        try {
            // Lấy ghế từ API theo roomId
            const response = await seatService.getSeatsByRoomId(screen.id);
            const seats = response?.data || response || [];

            if (seats.length === 0) {
                // ✅ CHỈ HIỂN thị layout rỗng, KHÔNG tự động tạo ghế
                console.log('⚠️ Phòng chiếu chưa có ghế');
                setSeatLayout({
                    rows: [],
                    totalSeats: 0,
                    vipSeats: [],
                    blockedSeats: []
                });
                message.info('Phòng chiếu chưa có sơ đồ ghế. Vui lòng tạo sơ đồ ghế mặc định.');
            } else {
                // Nếu đã có ghế, sử dụng dữ liệu từ API
                generateSeatLayoutFromAPI(seats);
            }
        } catch (error) {
            console.error('Error loading seats:', error);
            message.error('Không thể tải danh sách ghế');
            setSeatLayout({
                rows: [],
                totalSeats: 0,
                vipSeats: [],
                blockedSeats: []
            });
        }
    };

    const generateDefaultSeatLayout = async (screen) => {
        const totalRows = screen.rowsCount || 10;
        const seatsPerRow = screen.seatsPerRow || 12;

        const rows = [];

        try {
            for (let i = 0; i < totalRows; i++) {
                const rowLabel = String.fromCharCode(65 + i); // A, B, C, ...
                const rowSeats = [];

                for (let j = 1; j <= seatsPerRow; j++) {
                    // 📡 GỌI API TẠO GHẾ NGAY
                    const seatName = `${rowLabel}${j}`;
                    const seatData = {
                        roomId: screen.id,
                        name: seatName,
                        seatType: 'NORMAL',
                        status: 'AVAILABLE',
                        col: j,
                        row: i,
                        isActive: true
                    };

                    const response = await seatService.createSeat(seatData);
                    const createdSeat = response?.data?.data || response?.data || response;

                    // ✅ Dùng ID thật từ API (kiểu Long)
                    rowSeats.push({
                        id: createdSeat.id,
                        name: createdSeat.name,
                    row: rowLabel,
                    number: j,
                        type: mapSeatTypeFromAPI(createdSeat.seatType),
                        status: mapSeatStatusFromAPI(createdSeat.status),
                        rowLabel: rowLabel,
                        col: j,
                        rowIndex: i,
                        isActive: createdSeat.isActive
                });
            }

            rows.push({
                label: rowLabel,
                    seats: rowSeats,
                    isVip: false
            });

                console.log(`✅ Created row ${rowLabel} with ${rowSeats.length} seats`);
        }

            console.log(`🎉 Successfully created ${totalRows * seatsPerRow} seats in database`);

        setSeatLayout({
            rows: rows,
                totalSeats: totalRows * seatsPerRow,
                vipSeats: [],
            blockedSeats: []
        });

            message.success(`Đã tạo ${totalRows * seatsPerRow} ghế cho phòng chiếu`);
        } catch (error) {
            console.error('❌ Error creating default seats:', error);
            message.error(error.response?.data?.message || 'Tạo sơ đồ ghế mặc định thất bại');
        }
    };

    const generateSeatLayoutFromAPI = (seats) => {
        const layoutSeats = seats.map(seat => {
            // Convert row number (1,2,3...) to letter (A,B,C...)
            const rowLabel = seat.row ? String.fromCharCode(64 + seat.row) : 'A';

            return {
                id: seat.id,
                name: seat.name,
                row: rowLabel,
                number: seat.col,
                type: mapSeatTypeFromAPI(seat.seatType),
                status: mapSeatStatusFromAPI(seat.status),
                rowLabel: rowLabel,
                col: seat.col,
                rowIndex: seat.row,
                isActive: seat.isActive
            };
        });

        // 🔍 KIỂM TRA TRÙNG TỌA ĐỘ
        const coordinateMap = new Map();
        const duplicates = [];

        layoutSeats.forEach(seat => {
            const coordKey = `${seat.rowIndex}-${seat.col}`;
            if (coordinateMap.has(coordKey)) {
                const existing = coordinateMap.get(coordKey);
                duplicates.push({
                    coord: coordKey,
                    seats: [existing, seat]
                });
                console.error(`⚠️ TRÙNG TỌA ĐỘ: Ghế ${existing.id} và ${seat.id} cùng có tọa độ (row: ${seat.rowIndex}, col: ${seat.col})`);
            } else {
                coordinateMap.set(coordKey, seat);
            }
        });

        if (duplicates.length > 0) {
            console.error(`❌ Tìm thấy ${duplicates.length} cặp ghế bị trùng tọa độ:`, duplicates);
            message.warning(`Phát hiện ${duplicates.length} cặp ghế có tọa độ trùng nhau!`);
        } else {
            console.log(`✅ Tất cả ${layoutSeats.length} ghế đều có tọa độ riêng biệt`);
        }

        // Nhóm ghế theo rowLabel (A, B, C... thay vì rowIndex)
        const groupedByRow = layoutSeats.reduce((acc, seat) => {
            const rowKey = seat.rowLabel; // Sử dụng rowLabel (A, B, C...)
            if (!acc[rowKey]) {
                acc[rowKey] = [];
            }
            acc[rowKey].push(seat);
            return acc;
        }, {});

        // Tạo rows array cho component, sắp xếp theo rowLabel (A-Z)
        const rows = Object.keys(groupedByRow)
            .sort((a, b) => a.localeCompare(b)) // Sắp xếp theo alphabet (A, B, C... I, J...)
            .map(rowLabel => {
                // Sắp xếp ghế trong hàng theo col (tọa độ cột)
                const rowSeats = groupedByRow[rowLabel].sort((a, b) => a.col - b.col);

                // 🔍 KIỂM TRA TRÙNG COL TRONG CÙNG HÀNG
                const colsInRow = rowSeats.map(s => s.col);
                const uniqueCols = new Set(colsInRow);
                if (colsInRow.length !== uniqueCols.size) {
                    console.error(`⚠️ Hàng ${rowLabel} có ghế trùng cột:`, rowSeats.map(s => `${s.id}(col:${s.col})`));
                }

                const hasVipSeats = rowSeats.some(seat => seat.type === 'vip');

                return {
                    label: rowLabel,
                    seats: rowSeats,
                    isVip: hasVipSeats
                };
            });

        // Tính toán thống kê
        const totalSeats = layoutSeats.length;
        const vipRows = rows.filter(row => row.isVip).map(row => row.label);
        const blockedSeats = layoutSeats.filter(seat => seat.status === 'blocked').map(seat => seat.id);

        // 📊 LOG THỐNG KÊ
        console.log('📊 Thống kê sơ đồ ghế:');
        console.log(`   - Tổng số ghế: ${totalSeats}`);
        console.log(`   - Số hàng: ${rows.length}`);
        rows.forEach(row => {
            console.log(`   - Hàng ${row.label} (rowIndex: ${row.seats[0]?.rowIndex}): ${row.seats.length} ghế, cols: [${row.seats.map(s => s.col).join(', ')}]`);
        });

        setSeatLayout({
            rows: rows,
            totalSeats: totalSeats,
            vipSeats: vipRows,
            blockedSeats: blockedSeats
        });
    };

    const mapSeatTypeFromAPI = (apiSeatType) => {
        const typeMap = {
            'NORMAL': 'normal',
            'VIP': 'vip',
            'COUPLE': 'couple'
        };
        return typeMap[apiSeatType] || 'normal';
    };

    const mapSeatTypeToAPI = (componentSeatType) => {
        const typeMap = {
            'normal': 'NORMAL',
            'vip': 'VIP',
            'couple': 'COUPLE'
        };
        return typeMap[componentSeatType] || 'NORMAL';
    };

    const mapSeatStatusFromAPI = (apiStatus) => {
        const statusMap = {
            'AVAILABLE': 'available',
            'HELD': 'held',
            'BOOKED': 'booked',
            'UNAVAILABLE': 'unavailable',
            'MAINTENANCE': 'maintenance',
            'BLOCKED': 'blocked'
        };
        return statusMap[apiStatus] || 'available';
    };

    const mapSeatStatusToAPI = (componentStatus) => {
        const statusMap = {
            'available': 'AVAILABLE',
            'held': 'HELD',
            'booked': 'BOOKED',
            'unavailable': 'UNAVAILABLE',
            'maintenance': 'MAINTENANCE',
            'blocked': 'BLOCKED'
        };
        return statusMap[componentStatus] || 'AVAILABLE';
    };

    const getStatusText = (status) => {
        const statusTextMap = {
            'available': 'Có thể đặt',
            'held': 'Đang giữ chỗ',
            'booked': 'Đã đặt',
            'unavailable': 'Không khả dụng',
            'maintenance': 'Đang bảo trì',
            'blocked': 'Bị khóa'
        };
        return statusTextMap[status] || 'Không xác định';
    };

    const getSeatColor = (seat) => {
        if (selectedSeats.includes(seat.id)) return '#1890ff';

        // Ưu tiên hiển thị trạng thái trước, sau đó mới đến loại ghế
        switch (seat.status) {
            case 'blocked':
                return '#8c8c8c'; // Màu xám đậm - Ghế bị khóa
            case 'booked':
                return '#ff4d4f'; // Màu đỏ - Ghế đã đặt
            case 'held':
                return '#faad14'; // Màu vàng cam - Ghế đang giữ chỗ
            case 'unavailable':
                return '#d9d9d9'; // Màu xám nhạt - Ghế không khả dụng
            case 'maintenance':
                return '#722ed1'; // Màu tím - Ghế đang bảo trì
            case 'available':
            default:
                // Khi available, màu sắc dựa vào loại ghế
                switch (seat.type) {
                    case 'vip':
                        return '#faad14'; // Màu vàng cho VIP
                    case 'couple':
                        return '#eb2f96'; // Màu hồng cho ghế đôi
                    case 'normal':
                    default:
                        return '#52c41a'; // Màu xanh cho ghế thường
                }
        }
    };

    const getSeatIcon = (seat) => {
        // Ưu tiên hiển thị icon trạng thái trước
        switch (seat.status) {
            case 'blocked':
                return <BlockOutlined />; // Icon khóa
            case 'booked':
                return <UserOutlined />; // Icon user - Đã đặt
            case 'held':
                return <ClockCircleOutlined />; // Icon đồng hồ - Đang giữ
            case 'unavailable':
                return <CloseOutlined />; // Icon X - Không khả dụng
            case 'maintenance':
                return <ToolOutlined />; // Icon công cụ - Bảo trì
            case 'available':
            default:
                // Khi available, icon dựa vào loại ghế
                switch (seat.type) {
                    case 'vip':
                        return <StarOutlined />;
                    case 'couple':
                        return <HeartOutlined />;
                    case 'normal':
                    default:
                        return <UserOutlined />;
                }
        }
    };

    const handleSeatClick = (seat) => {
        console.log('🖱️ Seat clicked:', seat.id, seat.name || `${seat.row}${seat.number}`);

        // Mở modal chỉnh sửa ghế
        setSelectedSeat(seat);
        setShowSeatEditModal(true);

        const formValues = {
            name: seat.name || `${seat.row}${seat.number}`,
            type: seat.type,
            status: seat.status || 'available'
        };
        seatEditForm.setFieldsValue(formValues);
    };

    const handleBulkEdit = async (values) => {
        try {
            // 📡 GỌI API CẬP NHẬT TỪNG GHẾ ĐÃ CHỌN (Cần đầy đủ SeatRequest fields)
            const updatePromises = selectedSeats.map(seatId => {
                // Tìm seat để lấy thông tin đầy đủ
                const seat = seatLayout.rows
                    .flatMap(row => row.seats)
                    .find(s => s.id === seatId);

                if (!seat) return Promise.resolve();

                const seatData = {
                    roomId: selectedScreen.id,
                    name: seat.name,
                    seatType: mapSeatTypeToAPI(values.type),
                    status: mapSeatStatusToAPI(values.status),
                    col: seat.col,
                    row: seat.rowIndex,
                    isActive: values.status !== 'blocked'
                };
                return seatService.updateSeat(seatId, seatData);
            });

            await Promise.all(updatePromises);

            // Cập nhật state local
            const newRows = seatLayout.rows.map(row => ({
                ...row,
                seats: row.seats.map(seat =>
                    selectedSeats.includes(seat.id)
                        ? {
                            ...seat,
                            type: values.type,
                            status: values.status,
                            isActive: values.status !== 'blocked'
                        }
                        : seat
                )
            }));

            setSeatLayout({ ...seatLayout, rows: newRows });
            setSelectedSeats([]);
            setShowBulkModal(false);
            bulkForm.resetFields();
            message.success(`Đã cập nhật ${selectedSeats.length} ghế`);
        } catch (error) {
            console.error('❌ Error bulk editing seats:', error);
            message.error(error.response?.data?.message || 'Cập nhật hàng loạt thất bại');
        }
    };

    const handleSeatEdit = async (values) => {
        try {
            console.log('💾 Editing seat:', selectedSeat.id);

            // Kiểm tra nếu đổi sang ghế đôi, cần đảm bảo cột tiếp theo trống
            if (values.type === 'couple' && selectedSeat.type !== 'couple') {
                const targetRow = seatLayout.rows.find(r => r.label === selectedSeat.row);
                const nextCol = selectedSeat.col + 1;
                const hasNextSeat = targetRow.seats.some(s => s.col === nextCol && s.id !== selectedSeat.id);

                if (hasNextSeat) {
                    message.error(`Không thể đổi sang ghế đôi! Cột ${nextCol} đã có ghế. Ghế đôi cần 2 vị trí liên tiếp.`);
            return;
        }
            }


            // 📡 GỌI API CẬP NHẬT GHẾ (SeatRequest: roomId, name, seatType, status, col, row, isActive)
            const seatData = {
                roomId: selectedScreen.id,
                name: selectedSeat.name,
                seatType: mapSeatTypeToAPI(values.type),
                status: mapSeatStatusToAPI(values.status),
                col: selectedSeat.col,
                row: selectedSeat.rowIndex,
                isActive: values.status !== 'blocked'
            };

            console.log('📡 Updating seat via API:', seatData);
            const response = await seatService.updateSeat(selectedSeat.id, seatData);
            const updatedSeat = response?.data?.data || response?.data || response;
            console.log('✅ Seat updated:', updatedSeat);

            // Convert row number to letter
            const rowLabel = String.fromCharCode(64 + updatedSeat.row); // 1→A, 2→B, etc.

            // Cập nhật state với dữ liệu đầy đủ từ API
            const newRows = seatLayout.rows.map(row => ({
                ...row,
                seats: row.seats.map(seat =>
                    seat.id === selectedSeat.id
                        ? {
                            ...seat,
                            id: updatedSeat.id,
                            name: updatedSeat.name,
                            row: rowLabel,
                            number: updatedSeat.col,
                            type: mapSeatTypeFromAPI(updatedSeat.seatType),
                            status: mapSeatStatusFromAPI(updatedSeat.status),
                            rowLabel: rowLabel,
                            col: updatedSeat.col,
                            rowIndex: updatedSeat.row,
                            isActive: updatedSeat.isActive
                        }
                        : seat
                )
            }));

            setSeatLayout({ ...seatLayout, rows: newRows });
            message.success(`Đã cập nhật ghế ${selectedSeat.name}`);

            setShowSeatEditModal(false);
            setSelectedSeat(null);
            seatEditForm.resetFields();
        } catch (error) {
            console.error('❌ Error saving seat:', error);
            console.error('Error response:', error.response);
            message.error(error.response?.data?.message || 'Lưu thông tin ghế thất bại');
        }
    };

    const handleDeleteSeat = async () => {
        if (!selectedSeat) {
            message.warning('Không có ghế nào được chọn');
            return;
        }

        const seatInfo = selectedSeat.name || `${selectedSeat.row}${selectedSeat.number}`;
        console.log('🔴 Deleting seat:', seatInfo, '| ID:', selectedSeat.id);

        try {
            // 📡 GỌI API XÓA GHẾ
            console.log('📡 Calling API to delete seat ID:', selectedSeat.id);
            await seatService.deleteSeat(selectedSeat.id);
            console.log('✅ API delete successful');

            // Cập nhật state local - loại bỏ ghế đã xóa
            const newRows = seatLayout.rows
                .map(row => ({
                    ...row,
                    seats: row.seats.filter(seat => seat.id !== selectedSeat.id)
                }))
                .filter(row => row.seats.length > 0); // Xóa hàng nếu không còn ghế

            setSeatLayout({ ...seatLayout, rows: newRows });
            setShowSeatEditModal(false);
            setSelectedSeat(null);
            seatEditForm.resetFields();
            message.success(`Đã xóa ghế ${seatInfo}`);
        } catch (error) {
            console.error('❌ Error deleting seat:', error);
            message.error(error.response?.data?.message || 'Xóa ghế thất bại');
        }
    };

    const handleAddSeat = async (rowLabel) => {
        try {
            const targetRow = seatLayout.rows.find(row => row.label === rowLabel);
            if (!targetRow) return;

            // Tìm số ghế lớn nhất và tọa độ col lớn nhất trong hàng
            const maxSeatNumber = Math.max(...targetRow.seats.map(seat => seat.number));
            const maxCol = Math.max(...targetRow.seats.map(seat => seat.col || seat.number));
            const newSeatNumber = maxSeatNumber + 1;
            const newCol = maxCol + 1;
            const newSeatId = `${rowLabel}${newSeatNumber}`;
            const rowIndex = rowLabel.charCodeAt(0) - 65;

            // Chuẩn bị dữ liệu để gửi lên API
            const seatData = {
                roomId: selectedScreen.id,
                name: newSeatId,
                seatType: 'NORMAL', // Mặc định là ghế thường
                status: 'AVAILABLE',
                col: newCol,
                row: rowIndex + 1,
                isActive: true
            };

            // Gọi API tạo ghế
            const response = await seatService.createSeat(seatData);
            const createdSeat = response.data;

            // Tạo object ghế mới cho local state
            const newSeat = {
                id: createdSeat.id, // Dùng ID từ backend
                name: createdSeat.name,
                row: rowLabel,
                number: newSeatNumber,
                type: mapSeatTypeFromAPI(createdSeat.seatType),
                status: mapSeatStatusFromAPI(createdSeat.status),
                rowLabel: rowLabel,
                col: newCol,
                rowIndex: rowIndex + 1,
                isActive: true
            };

            // Cập nhật layout và sắp xếp lại ghế theo col
            const newRows = seatLayout.rows.map(row =>
                row.label === rowLabel
                    ? {
                        ...row,
                        seats: [...row.seats, newSeat].sort((a, b) => a.col - b.col)
                    }
                    : row
            );

            setSeatLayout({ ...seatLayout, rows: newRows });
            message.success(`Đã thêm ghế ${newSeatId} (Tọa độ: hàng ${rowIndex}, cột ${newCol})`);
        } catch (error) {
            console.error('Error creating seat:', error);
            message.error(error.response?.data?.message || 'Tạo ghế thất bại');
        }
    };

    const handleAddSeatAtPosition = async (rowLabel, targetCol) => {
        try {
            const targetRow = seatLayout.rows.find(row => row.label === rowLabel);
            if (!targetRow) return;

            // Kiểm tra xem cột này đã có ghế chưa
            if (targetRow.seats.some(s => s.col === targetCol)) {
                message.warning(`Cột ${targetCol} trong hàng ${rowLabel} đã có ghế!`);
                return;
            }

            // Tên ghế = rowLabel + số cột (ví dụ: A5)
            const seatName = `${rowLabel}${targetCol}`;
            const rowIndex = rowLabel.charCodeAt(0) - 64; // A=1, B=2, etc.

            // Chuẩn bị dữ liệu để gửi lên API
            const seatData = {
                roomId: selectedScreen.id,
                name: seatName,
                col: targetCol,
                row: rowIndex,
                seatType: 'NORMAL',
                status: 'AVAILABLE',
                isActive: true
            };

            console.log("create seat at position", seatData)

            // Gọi API tạo ghế
            const response = await seatService.createSeat(seatData);
            const createdSeat = response.data;

            // Tạo object ghế mới cho local state
        const newSeat = {
                id: createdSeat.id,
                name: createdSeat.name,
                row: rowLabel,
                number: targetCol,
                type: mapSeatTypeFromAPI(createdSeat.seatType),
                status: mapSeatStatusFromAPI(createdSeat.status),
                rowLabel: rowLabel,
                col: createdSeat.col,
                rowIndex: createdSeat.row,
                isActive: createdSeat.isActive
            };

            // Cập nhật layout và sắp xếp lại ghế theo col
            const newRows = seatLayout.rows.map(row =>
                row.label === rowLabel
                    ? {
                        ...row,
                        seats: [...row.seats, newSeat].sort((a, b) => a.col - b.col)
                    }
                    : row
            );

            setSeatLayout({ ...seatLayout, rows: newRows });
            message.success(`Đã thêm ghế ${seatName} tại hàng ${rowLabel}, cột ${targetCol}`);
        } catch (error) {
            console.error('Error creating seat at position:', error);
            message.error(error.response?.data?.message || 'Tạo ghế thất bại');
        }
    };

    const handleAddRow = async () => {
        try {
            // Tìm label hàng tiếp theo (A, B, C, ... Z)
            const existingLabels = seatLayout.rows.map(row => row.label).sort();
            let nextLabel = 'A';

            for (let i = 0; i < existingLabels.length; i++) {
                const currentLabel = String.fromCharCode(65 + i); // A=65, B=66, ...
                if (!existingLabels.includes(currentLabel)) {
                    nextLabel = currentLabel;
                    break;
                }
                if (i === existingLabels.length - 1) {
                    nextLabel = String.fromCharCode(existingLabels[i].charCodeAt(0) + 1);
                }
            }

            const rowIndex = nextLabel.charCodeAt(0) - 64; // A=1, B=2, etc.
            const defaultSeatsPerRow = 10;

            console.log(`➕ Creating new row ${nextLabel} with ${defaultSeatsPerRow} seats via API...`);

            // 📡 GỌI API TẠO TỪNG GHẾ TRONG HÀNG MỚI
            const newRowSeats = [];
            for (let j = 1; j <= defaultSeatsPerRow; j++) {
                const seatName = `${nextLabel}${j}`;
                const seatData = {
                    roomId: selectedScreen.id,
                    name: seatName,
                    col: j,
                    row: rowIndex,
                    seatType: 'NORMAL',
                    status: 'AVAILABLE',
                    isActive: true
                };

                const response = await seatService.createSeat(seatData);
                const createdSeat = response?.data?.data || response?.data || response;

                newRowSeats.push({
                    id: createdSeat.id,
                    name: createdSeat.name,
                    row: nextLabel,
                number: j,
                    type: mapSeatTypeFromAPI(createdSeat.seatType),
                    status: mapSeatStatusFromAPI(createdSeat.status),
                    rowLabel: nextLabel,
                    col: createdSeat.col,
                    rowIndex: createdSeat.row,
                    isActive: createdSeat.isActive
                });
            }

            // Tạo hàng mới với ghế đã có ID từ API
        const newRow = {
                label: nextLabel,
                seats: newRowSeats,
            isVip: false
        };

            console.log(`✅ Created row ${nextLabel} with ${newRowSeats.length} seats`);

            // Thêm hàng mới vào layout (sắp xếp theo thứ tự alphabet)
            const newRows = [...seatLayout.rows, newRow].sort((a, b) => a.label.localeCompare(b.label));

            setSeatLayout({ ...seatLayout, rows: newRows });
            message.success(`Đã thêm hàng ${nextLabel} với ${defaultSeatsPerRow} ghế`);
        } catch (error) {
            console.error('❌ Error creating new row:', error);
            message.error(error.response?.data?.message || 'Tạo hàng mới thất bại');
        }
    };

    const handleRemoveRow = async (rowLabel) => {
        try {
            if (seatLayout.rows.length <= 1) {
                message.warning('Không thể xóa hàng. Phòng chiếu phải có ít nhất 1 hàng ghế.');
                return;
            }

            const targetRow = seatLayout.rows.find(row => row.label === rowLabel);
            if (!targetRow) {
                message.error('Không tìm thấy hàng ghế');
                return;
            }

            // 📡 GỌI API XÓA TẤT CẢ GHẾ TRONG HÀNG
            const deletePromises = targetRow.seats.map(seat => seatService.deleteSeat(seat.id));
            await Promise.all(deletePromises);

            // Cập nhật state local
            const newRows = seatLayout.rows.filter(row => row.label !== rowLabel);
            setSeatLayout({ ...seatLayout, rows: newRows });
            message.success(`Đã xóa hàng ${rowLabel} (${targetRow.seats.length} ghế)`);
        } catch (error) {
            console.error('❌ Error removing row:', error);
            message.error(error.response?.data?.message || 'Xóa hàng ghế thất bại');
        }
    };

    const resetLayout = async () => {
        try {
            await loadSeatsFromAPI(selectedScreen);
        setSelectedSeats([]);
            message.success('Đã khôi phục bố cục ban đầu');
        } catch (error) {
            console.error('❌ Error resetting layout:', error);
            message.error('Khôi phục bố cục thất bại');
        }
    };

    // const saveLayout = async () => {
    //     try {
    //         // Lưu tất cả ghế vào database
    //         const allSeats = seatLayout.rows.flatMap(row => row.seats);

    //         // Xóa tất cả ghế cũ trước
    //         await seatService.deleteAllSeatsByRoomId(selectedScreen.id);

    //         // Tạo ghế mới với đầy đủ thông tin
    //         const createPromises = allSeats.map(seat => {
    //             const seatData = {
    //                 roomId: selectedScreen.id,
    //                 rowLabel: seat.rowLabel || seat.row,
    //                 seatNumber: String(seat.seatNumber || seat.number),
    //                 seatType: mapSeatTypeToAPI(seat.type),
    //                 status: mapSeatStatusToAPI(seat.status),
    //                 col: seat.col || seat.number,
    //                 row: seat.rowIndex !== undefined ? seat.rowIndex : (seat.row.charCodeAt(0) - 65),
    //                 isActive: seat.isActive !== undefined ? seat.isActive : (seat.status !== 'blocked')
    //             };
    //             return seatService.createSeat(seatData);
    //         });

    //         await Promise.all(createPromises);

    //         message.success('Đã lưu sơ đồ ghế thành công');

    //         // Gọi callback onSave nếu có
    //         if (onSave) {
    //             const layoutData = {
    //                 rows: seatLayout.rows.length,
    //                 seatsPerRow: seatLayout.rows[0]?.seats.length || 0,
    //                 vipRows: seatLayout.vipSeats,
    //                 seats: allSeats
    //             };
    //             onSave(layoutData);
    //         }
    //     } catch (error) {
    //         console.error('Error saving seat layout:', error);
    //         message.error(error.response?.data?.message || 'Lưu sơ đồ ghế thất bại');
    //     }
    // };

    const getSeatStats = () => {
        const allSeats = seatLayout.rows.flatMap(row => row.seats);
        return {
            total: allSeats.length,
            vip: allSeats.filter(s => s.type === 'vip').length,
            couple: allSeats.filter(s => s.type === 'couple').length,
            normal: allSeats.filter(s => s.type === 'normal').length,
            // Thống kê theo trạng thái
            available: allSeats.filter(s => s.status === 'available').length,
            booked: allSeats.filter(s => s.status === 'booked').length,
            blocked: allSeats.filter(s => s.status === 'blocked').length
        };
    };

    const stats = getSeatStats();

    return (
        <div className="seat-manager-antd">
            {/* Screen */}
            <div className="screen-indicator">
                <div className="screen">MÀN HÌNH</div>
                        </div>

            {/* Seat Layout */}
            <div className="seat-layout" ref={seatLayoutRef}>
                {seatLayout.rows.length === 0 ? (
                    // ✅ HIỂN THỊ NÚT TẠO SƠ ĐỒ GHẾ KHI CHƯA CÓ GHẾ
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '300px',
                        padding: '40px',
                        backgroundColor: '#fafafa',
                        borderRadius: '8px',
                        border: '2px dashed #d9d9d9'
                    }}>
                        <BlockOutlined style={{ fontSize: '48px', color: '#bfbfbf', marginBottom: '16px' }} />
                        <Title level={4} style={{ color: '#595959', marginBottom: '8px' }}>
                            Phòng chiếu chưa có sơ đồ ghế
                        </Title>
                        <Text style={{ color: '#8c8c8c', marginBottom: '24px' }}>
                            Tạo sơ đồ ghế mặc định với {selectedScreen?.rowsCount || 10} hàng × {selectedScreen?.seatsPerRow || 12} ghế/hàng
                        </Text>
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={() => generateDefaultSeatLayout(selectedScreen)}
                            style={{
                                height: '48px',
                                fontSize: '16px',
                                fontWeight: '500',
                                borderRadius: '8px',
                                paddingLeft: '32px',
                                paddingRight: '32px'
                            }}
                        >
                            Tạo sơ đồ ghế mặc định
                        </Button>
                    </div>
                ) : (
                    <>
                        {seatLayout.rows.map((row, rowIndex) => {
                            // Tìm cột lớn nhất trong toàn bộ phòng để đảm bảo tất cả hàng có cùng số cột
                            const allCols = seatLayout.rows.flatMap(r => r.seats.map(s => s.col));
                            const maxColInRoom = allCols.length > 0 ? Math.max(...allCols) : 20; // Mặc định 20 cột nếu chưa có ghế
                            const minCol = 1; // Luôn bắt đầu từ cột 1
                            const totalCols = maxColInRoom; // Số cột cố định cho tất cả hàng

                            // Tạo Set các cột đã có ghế để kiểm tra nhanh
                            const occupiedCols = new Set(row.seats.map(s => s.col));

                                    return (
                                <div key={row.label} className="seat-row">
                                    <div
                                        className="seats"
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: `repeat(${totalCols}, 36px)`,
                                            gap: '4px',
                                            position: 'relative'
                                        }}
                                    >
                                        {/* Render tất cả các cột từ 1 đến maxColInRoom */}
                                        {Array.from({ length: totalCols }, (_, index) => {
                                            const currentCol = minCol + index;
                                            const gridPosition = index + 1;

                                            // Kiểm tra xem cột này có ghế không
                                            const seat = row.seats.find(s => s.col === currentCol);

                                            // Kiểm tra xem cột trước có ghế đôi không (ghế đôi chiếm cột hiện tại)
                                            const prevCol = currentCol - 1;
                                            const prevSeat = row.seats.find(s => s.col === prevCol);
                                            const isOccupiedByCoupleSeat = prevSeat && prevSeat.type === 'couple';

                                            if (isOccupiedByCoupleSeat) {
                                                // Cột này bị ghế đôi chiếm, không render gì
                                                return null;
                                            }

                                            if (seat) {
                                                // Nếu có ghế, render ghế
                                                const isCoupleSeat = seat.type === 'couple';

                                                return (
                                                    <Tooltip
                                                        key={`seat-${seat.id}`}
                                                        title={
                                                            <div>
                                                                <div><strong>Ghế {seat.id}</strong></div>
                                                                <div>Hàng: {seat.row} (Tọa độ: {seat.rowIndex})</div>
                                                                <div>Cột: {seat.number} (Tọa độ: {seat.col})</div>
                                                                <div>Loại: {seat.type === 'normal' ? 'Thường' : seat.type === 'vip' ? 'VIP' : 'Đôi'}</div>
                                                                <div>Trạng thái: {getStatusText(seat.status)}</div>
                                                                {isCoupleSeat && <div style={{ color: '#eb2f96' }}>⚠️ Chiếm 2 vị trí</div>}
                                                            </div>
                                                        }
                                                    >
                                                        <div
                                                            className={`seat clickable ${selectedSeats.includes(seat.id) ? 'selected' : ''
                                                                } ${seat.type === 'couple' ? 'seat-couple' : ''} ${seat.status === 'blocked' ? 'blocked' : ''}`}
                                                            style={{
                                                                backgroundColor: getSeatColor(seat),
                                                                color: 'white',
                                                                gridColumn: isCoupleSeat
                                                                    ? `${gridPosition} / span 2` // Ghế đôi chiếm 2 cột
                                                                    : gridPosition,
                                                                width: isCoupleSeat ? '72px' : '32px' // Ghế đôi rộng gấp đôi (32*2 + gap 4 = 68, làm tròn 72)
                                                            }}
                                                            onClick={() => handleSeatClick(seat)}
                                                        >
                                                            <div className="seat-content">
                                                                {getSeatIcon(seat)}
                                                                <span className="seat-number">{seat.row}{seat.number}</span>
                                        </div>
                                                        </div>
                                                    </Tooltip>
                                                );
                                            } else {
                                                // Nếu không có ghế, render nút thêm ghế
                                                return (
                                                    <Tooltip
                                                        key={`empty-${row.label}-${currentCol}`}
                                                        title={`Thêm ghế vào hàng ${row.label}, cột ${currentCol}`}
                                                    >
                                                        <Button
                                                            type="dashed"
                                                            size="small"
                                                            icon={<PlusOutlined />}
                                                            className="add-seat-btn"
                                                            onClick={() => handleAddSeatAtPosition(row.label, currentCol)}
                                                            style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                borderColor: '#d9d9d9',
                                                                color: '#8c8c8c',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gridColumn: gridPosition,
                                                                opacity: 0.5
                                                            }}
                                                        />
                                                    </Tooltip>
                                                );
                                            }
                                        })}

                                        {/* Nút thêm ghế ở cuối hàng */}
                                        <Tooltip title={`Thêm ghế mới vào cuối hàng ${row.label}`}>
                                            <Button
                                                type="dashed"
                                                size="small"
                                                icon={<PlusOutlined />}
                                    className="add-seat-btn"
                                                onClick={() => handleAddSeat(row.label)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderColor: '#52c41a',
                                                    color: '#52c41a',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginLeft: '8px',
                                                    gridColumn: totalCols + 1,
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                        </Tooltip>
                            </div>
                    </div>
                            );
                        })}

                        {/* Add Row Button at the bottom */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '20px',
                            paddingTop: '16px',
                            borderTop: '1px dashed #d9d9d9'
                        }}>
                            <Button
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={handleAddRow}
                                size="large"
                                style={{
                                    borderColor: '#52c41a',
                                    color: '#52c41a',
                                    backgroundColor: '#f6ffed',
                                    minWidth: '200px',
                                    height: '48px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                Thêm hàng mới
                            </Button>
                        </div>
                                </>
                            )}
                        </div>

            {/* Legend - Chú thích màu sắc và trạng thái */}
            <Card size="small" style={{ marginBottom: '16px' }} title="Chú thích">
                <Space wrap size={[12, 6]} style={{ width: '100%' }}>
                    {/* Loại ghế */}
                    <Space align="center" size={4}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: '#52c41a',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <UserOutlined style={{ fontSize: '9px' }} />
                    </div>
                        <Text style={{ fontSize: '11px' }}>Thường</Text>
                    </Space>
                    <Space align="center" size={4}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: '#faad14',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <StarOutlined style={{ fontSize: '9px' }} />
                </div>
                        <Text style={{ fontSize: '11px' }}>VIP</Text>
                    </Space>
                    <Space align="center" size={4}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: '#eb2f96',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <HeartOutlined style={{ fontSize: '9px' }} />
                        </div>
                        <Text style={{ fontSize: '11px' }}>Đôi</Text>
                    </Space>

                    {/* Divider */}
                    <div style={{ width: '1px', height: '16px', backgroundColor: '#d9d9d9', margin: '0 4px' }} />

                    {/* Trạng thái */}
                    <Space align="center" size={4}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: '#52c41a',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <UserOutlined style={{ fontSize: '9px' }} />
                </div>
                        <Text style={{ fontSize: '11px' }}>Có thể đặt</Text>
                    </Space>
                    <Space align="center" size={4}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: '#faad14',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <ClockCircleOutlined style={{ fontSize: '9px' }} />
            </div>
                        <Text style={{ fontSize: '11px' }}>Giữ chỗ</Text>
                    </Space>
                    <Space align="center" size={4}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: '#ff4d4f',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <UserOutlined style={{ fontSize: '9px' }} />
                                    </div>
                        <Text style={{ fontSize: '11px' }}>Đã đặt</Text>
                    </Space>
                    <Space align="center" size={4}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: '#d9d9d9',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <CloseOutlined style={{ fontSize: '9px' }} />
                                </div>
                        <Text style={{ fontSize: '11px' }}>Không khả dụng</Text>
                    </Space>
                    <Space align="center" size={4}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: '#722ed1',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <ToolOutlined style={{ fontSize: '9px' }} />
                                </div>
                        <Text style={{ fontSize: '11px' }}>Bảo trì</Text>
                    </Space>
                    <Space align="center" size={4}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: '#8c8c8c',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <BlockOutlined style={{ fontSize: '9px' }} />
                            </div>
                        <Text style={{ fontSize: '11px' }}>Bị khóa</Text>
                    </Space>
                    <Space align="center" size={4}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: '#1890ff',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <UserOutlined style={{ fontSize: '9px' }} />
                        </div>
                        <Text style={{ fontSize: '11px' }}>Đang chọn</Text>
                    </Space>
                </Space>
            </Card>

            {/* Bulk Edit Modal */}
            <Modal
                title="Chỉnh sửa ghế hàng loạt"
                open={showBulkModal}
                onCancel={() => setShowBulkModal(false)}
                footer={null}
                destroyOnClose={true}
                getPopupContainer={trigger => trigger.parentElement}
            >
                <Form
                    form={bulkForm}
                    layout="vertical"
                    onFinish={handleBulkEdit}
                >
                    <Text>Đã chọn: <strong>{selectedSeats.length}</strong> ghế</Text>

                    <Divider />

                    <Form.Item
                        label="Loại ghế"
                        name="type"
                        initialValue="normal"
                    >
                        <Select
                            placeholder="Chọn loại ghế"
                            getPopupContainer={trigger => trigger.parentElement}
                        >
                            <Option value="normal">Ghế thường</Option>
                            <Option value="vip">Ghế VIP</Option>
                            <Option value="couple">Ghế đôi</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        initialValue="available"
                    >
                        <Select
                            placeholder="Chọn trạng thái"
                            getPopupContainer={trigger => trigger.parentElement}
                        >
                            <Option value="available">Có thể đặt</Option>
                            <Option value="held">Đang giữ chỗ</Option>
                            <Option value="booked">Đã đặt</Option>
                            <Option value="unavailable">Không khả dụng</Option>
                            <Option value="maintenance">Đang bảo trì</Option>
                            <Option value="blocked">Bị khóa</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button onClick={() => setShowBulkModal(false)}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Áp dụng
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Single Seat Edit Modal */}
            {console.log('🎨 Rendering Seat Edit Modal - State:', {
                showSeatEditModal,
                selectedSeat: selectedSeat?.id,
                seatName: selectedSeat?.name
            })}
            <Modal
                title={`Chỉnh sửa ghế ${selectedSeat?.name || `${selectedSeat?.row}${selectedSeat?.number}`}`}
                open={showSeatEditModal}
                onCancel={() => {
                    console.log('❌ Modal cancel clicked');
                    setShowSeatEditModal(false);
                    setSelectedSeat(null);
                    seatEditForm.resetFields();
                }}
                footer={null}
                width={500}
                destroyOnClose={true}
                getPopupContainer={trigger => trigger.parentElement}
            >
                <Form
                    form={seatEditForm}
                    layout="vertical"
                    onFinish={handleSeatEdit}
                >
                    <Form.Item
                        label="Tên ghế"
                        name="name"
                    >
                        <Input disabled />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Tọa độ hàng (Row Index)">
                                <Input
                                    value={selectedSeat?.rowIndex}
                                    disabled
                                    style={{ color: '#000' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Tọa độ cột (Column)">
                                <Input
                                    value={selectedSeat?.col}
                                    disabled
                                    style={{ color: '#000' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Loại ghế"
                        name="type"
                        rules={[{ required: true, message: 'Vui lòng chọn loại ghế' }]}
                    >
                        <Select
                            placeholder="Chọn loại ghế"
                            getPopupContainer={trigger => trigger.parentElement}
                        >
                            <Option value="normal">Ghế thường</Option>
                            <Option value="vip">Ghế VIP</Option>
                            <Option value="couple">Ghế đôi</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select
                            placeholder="Chọn trạng thái"
                            getPopupContainer={trigger => trigger.parentElement}
                        >
                            <Option value="available">Có thể đặt</Option>
                            <Option value="held">Đang giữ chỗ</Option>
                            <Option value="booked">Đã đặt</Option>
                            <Option value="unavailable">Không khả dụng</Option>
                            <Option value="maintenance">Đang bảo trì</Option>
                            <Option value="blocked">Bị khóa</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => {
                                setShowSeatEditModal(false);
                                setSelectedSeat(null);
                                seatEditForm.resetFields();
                            }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Lưu thay đổi
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>

                {/* Nút xóa ghế - ĐẶT NGOÀI FORM để tránh xung đột */}
                <Divider style={{ margin: '16px 0' }} />
                <div style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '16px' }}>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleDeleteSeat}
                        block
                    >
                        Xóa ghế này
                    </Button>
                        </div>
            </Modal>
        </div>
    );
};

export default SeatManager;
