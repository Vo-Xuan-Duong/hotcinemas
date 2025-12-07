import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Table,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    TimePicker,
    InputNumber,
    Space,
    Tag,
    Typography,
    message,
    Popconfirm,
    Row,
    Col,
    Statistic,
    Badge,
    Switch,
    Tooltip,
    Alert,
    Dropdown,
    Spin
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    VideoCameraOutlined,
    ShopOutlined,
    EyeOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    DollarCircleOutlined,
    UserOutlined,
    AppstoreOutlined,
    SettingOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './Schedules.css';
import showtimeService from '../../../services/showtimeService';
import movieService from '../../../services/movieService';
import cinemaService from '../../../services/cinemaService';
import SeatViewer from '../../../components/SeatManager/SeatViewer';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Schedules = () => {
    const [form] = Form.useForm();
    const [schedules, setSchedules] = useState([]);
    const [movies, setMovies] = useState([]);
    const [cinemas, setCinemas] = useState([]);
    const [rooms, setRooms] = useState([]); // Danh sách phòng chiếu
    const [loading, setLoading] = useState(true);
    const [moviesLoading, setMoviesLoading] = useState(false);
    const [cinemasLoading, setCinemasLoading] = useState(false);
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showSeatsModal, setShowSeatsModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [showtimeSeats, setShowtimeSeats] = useState([]);
    const [seatsLoading, setSeatsLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [movieFilter, setMovieFilter] = useState('all');
    const [cinemaFilter, setCinemaFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // For batch operations

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        loadSchedules();
        loadMovies();
        loadCinemas();
    }, []);

    // Auto-fill form khi mở edit modal và đã có rooms
    useEffect(() => {
        console.log('useEffect triggered:', {
            showEditModal,
            hasSelectedSchedule: !!selectedSchedule,
            roomsCount: rooms.length,
            selectedSchedule
        });

        if (showEditModal && selectedSchedule) {
            // Tìm movieId và cinemaId từ danh sách
            const movie = movies.find(m => m.title === selectedSchedule.movieTitle);
            const cinema = cinemas.find(c => c.name === selectedSchedule.cinemaName);

            console.log('Auto-filling form with data:', {
                movieId: movie?.id,
                cinemaId: cinema?.id,
                screenName: selectedSchedule.roomName,
                date: selectedSchedule.showDate,
                time: selectedSchedule.startTime,
                price: selectedSchedule.price,
                status: selectedSchedule.status
            });

            form.setFieldsValue({
                movieId: movie?.id,
                cinemaId: cinema?.id,
                screenName: selectedSchedule.roomName,
                date: selectedSchedule.showDate ? dayjs(selectedSchedule.showDate) : null,
                time: selectedSchedule.startTime ? dayjs(selectedSchedule.startTime, 'HH:mm:ss') : null,
                price: selectedSchedule.price,
                format: selectedSchedule.movieFormat || selectedSchedule.format || 'TWO_D_SUB', // movieFormat từ backend hoặc fallback
                status: selectedSchedule.status
            });
        }
    }, [showEditModal, selectedSchedule, rooms, movies, cinemas, form]);

    // Reload khi currentPage hoặc pageSize thay đổi
    useEffect(() => {
        if (currentPage !== 1 || pageSize !== 10) {
            loadSchedules(currentPage, pageSize);
        }
    }, [currentPage, pageSize]);

    // Reset về trang 1 khi filter thay đổi
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            loadSchedules(1, pageSize);
        }
    }, [searchText, movieFilter, cinemaFilter, statusFilter]);

    const loadSchedules = async (page = currentPage, size = pageSize) => {
        try {
            setLoading(true);
            // Gọi API với tham số phân trang (page bắt đầu từ 0)
            const response = await showtimeService.getAllShowtimes(page - 1, size);

            // Xử lý response - có thể là pagination hoặc array trực tiếp
            let schedulesData = [];
            let total = 0;

            if (response?.data?.content) {
                // Paginated response: { data: { content: [], totalElements, ... } }
                schedulesData = response.data.content;
                total = response.data.totalElements || 0;
            } else if (response?.content) {
                // Direct paginated: { content: [], totalElements, ... }
                schedulesData = response.content;
                total = response.totalElements || 0;
            } else if (Array.isArray(response?.data)) {
                // Direct array: { data: [...] }
                schedulesData = response.data;
                total = response.data.length;
            } else if (Array.isArray(response)) {
                // Direct array without wrapper
                schedulesData = response;
                total = response.length;
            }

            setSchedules(schedulesData);
            setTotalElements(total);
        } catch (error) {
            console.error('Error loading schedules:', error);
            message.error('Lỗi khi tải lịch chiếu');
        } finally {
            setLoading(false);
        }
    };

    const loadMovies = async () => {
        try {
            setMoviesLoading(true);
            // Lấy danh sách phim đang chiếu (Now Showing)
            const response = await movieService.getNowShowing();
            console.log('Now Showing Movies API response:', response);

            // Xử lý response - có thể là pagination hoặc array trực tiếp
            let moviesData = [];
            if (response?.data?.content) {
                // Paginated response: { data: { content: [], totalElements, ... } }
                moviesData = response.data.content;
            } else if (Array.isArray(response?.data)) {
                // Direct array: { data: [...] }
                moviesData = response.data;
            } else if (response?.content) {
                // Direct paginated: { content: [], totalElements, ... }
                moviesData = response.content;
            } else if (Array.isArray(response)) {
                // Direct array without wrapper
                moviesData = response;
            }

            console.log('Parsed now showing movies:', moviesData);

            // Filter active movies only
            const activeMovies = moviesData.filter(m => m.status === 'ACTIVE' || m.isActive !== false);
            setMovies(activeMovies);

            if (activeMovies.length === 0) {
                message.warning('Không có phim đang chiếu nào. Vui lòng thêm phim đang chiếu trước.');
            }
        } catch (error) {
            console.error('Error loading now showing movies:', error);
            message.error('Lỗi khi tải danh sách phim đang chiếu: ' + (error.response?.data?.message || error.message));
            setMovies([]);
        } finally {
            setMoviesLoading(false);
        }
    };

    const loadCinemas = async () => {
        try {
            setCinemasLoading(true);
            const response = await cinemaService.getAllCinemas();
            console.log('Cinemas API response:', response);

            // Xử lý response - có thể là pagination hoặc array trực tiếp
            let cinemasData = [];
            if (response?.data?.content) {
                // Paginated response: { data: { content: [], totalElements, ... } }
                cinemasData = response.data.content;
            } else if (Array.isArray(response?.data)) {
                // Direct array: { data: [...] }
                cinemasData = response.data;
            } else if (response?.content) {
                // Direct paginated: { content: [], totalElements, ... }
                cinemasData = response.content;
            } else if (Array.isArray(response)) {
                // Direct array without wrapper
                cinemasData = response;
            }

            console.log('Parsed cinemas:', cinemasData);

            // Filter active cinemas only
            const activeCinemas = cinemasData.filter(c => c.status === 'ACTIVE' || c.isActive !== false);
            setCinemas(activeCinemas);

            if (activeCinemas.length === 0) {
                message.warning('Không có rạp nào đang hoạt động. Vui lòng thêm rạp trước.');
            }
        } catch (error) {
            console.error('Error loading cinemas:', error);
            message.error('Lỗi khi tải danh sách rạp: ' + (error.response?.data?.message || error.message));
            setCinemas([]);
        } finally {
            setCinemasLoading(false);
        }
    };

    // Load danh sách phòng chiếu khi chọn rạp
    const loadRoomsByCinema = async (cinemaId) => {
        if (!cinemaId) {
            setRooms([]);
            return;
        }

        try {
            setRoomsLoading(true);
            const response = await cinemaService.getRoomsByCinemaId(cinemaId);
            console.log('Rooms API response:', response);

            // Xử lý response
            let roomsData = [];
            if (Array.isArray(response?.data)) {
                roomsData = response.data;
            } else if (Array.isArray(response)) {
                roomsData = response;
            }

            console.log('Parsed rooms:', roomsData);

            // Filter active rooms only
            const activeRooms = roomsData.filter(r => r.isActive !== false);
            setRooms(activeRooms);

            if (activeRooms.length === 0) {
                message.warning('Rạp này chưa có phòng chiếu nào.');
            }
        } catch (error) {
            console.error('Error loading rooms:', error);
            message.error('Lỗi khi tải danh sách phòng chiếu: ' + (error.response?.data?.message || error.message));
            setRooms([]);
        } finally {
            setRoomsLoading(false);
        }
    };

    // Xử lý khi thay đổi rạp
    const handleCinemaChange = (cinemaId) => {
        // Reset phòng chiếu đã chọn
        form.setFieldsValue({ screenName: undefined, format: undefined });
        // Load danh sách phòng của rạp mới
        loadRoomsByCinema(cinemaId);
    };

    // Xử lý khi thay đổi phòng chiếu
    const handleRoomChange = (roomName) => {
        // Tìm thông tin phòng đã chọn
        const selectedRoom = rooms.find(r => r.name === roomName);
        if (selectedRoom) {
            // Lưu roomId để submit (không tự động set format nữa)
            form.setFieldsValue({
                roomId: selectedRoom.id
            });
        }
    };

    const getMovieTitle = (movieId) => {
        const movie = movies.find(m => m.id === movieId);
        return movie ? movie.title : 'N/A';
    };

    const getCinemaName = (cinemaId) => {
        const cinema = cinemas.find(c => c.id === cinemaId);
        return cinema ? cinema.name : 'N/A';
    };

    const handleAddSchedule = () => {
        form.resetFields();
        setShowAddModal(true);
    };

    const handleEditSchedule = async (schedule) => {
        try {
            console.log('handleEditSchedule called with:', schedule);
            setSelectedSchedule(schedule);

            // Tìm cinemaId từ cinemaName
            const cinema = cinemas.find(c => c.name === schedule.cinemaName);

            // Load phòng chiếu của rạp đã chọn
            if (cinema?.id) {
                console.log('Loading rooms for cinema:', cinema.id);
                await loadRoomsByCinema(cinema.id);
            }

            // Mở modal - useEffect sẽ tự động set form values
            console.log('Opening edit modal...');
            setShowEditModal(true);
        } catch (error) {
            console.error('Error in handleEditSchedule:', error);
            message.error('Lỗi khi tải thông tin lịch chiếu');
        }
    };

    const handleViewSchedule = (schedule) => {
        setSelectedSchedule(schedule);
        setShowDetailModal(true);
    };

    const handleViewSeats = async (schedule) => {
        setSelectedSchedule(schedule);
        setSeatsLoading(true);

        try {
            // Lấy trạng thái ghế cho lịch chiếu này
            const seatsResponse = await showtimeService.getSeatsByShowtimeId(schedule.id);
            console.log('Showtime seats API response:', seatsResponse);
            const seatsData = seatsResponse?.data || seatsResponse || [];
            setShowtimeSeats(seatsData);
            console.log('Showtime seats loaded:', seatsData);

            setShowSeatsModal(true);
        } catch (error) {
            console.error('Error loading showtime seats:', error);
            message.error('Không thể tải danh sách ghế');
            setShowtimeSeats([]);
        } finally {
            setSeatsLoading(false);
        }
    };

    const handleDeleteSchedule = async (scheduleId) => {
        try {
            await showtimeService.deleteShowtime(scheduleId);
            message.success('Xóa lịch chiếu thành công!');
            // Reload trang hiện tại, nếu trang hiện tại không còn dữ liệu thì về trang 1
            await loadSchedules(currentPage, pageSize);
        } catch (error) {
            console.error('Error deleting schedule:', error);
            message.error('Lỗi khi xóa lịch chiếu');
        }
    };

    const handleStatusChange = async (scheduleId, newStatus) => {
        try {
            await showtimeService.updateShowtimeStatus(scheduleId, newStatus);
            const statusText = newStatus === 'OPEN_FOR_BOOKING' ? 'mở bán vé' :
                newStatus === 'CANCELED' ? 'hủy' :
                    newStatus === 'BOOKING_CLOSED' ? 'đóng đặt vé' : 'cập nhật';
            message.success(`Đã ${statusText} lịch chiếu!`);
            await loadSchedules();
        } catch (error) {
            console.error('Error updating status:', error);
            message.error('Lỗi khi cập nhật trạng thái');
        }
    };

    const handleSubmit = async (values) => {
        try {
            // Tìm roomId từ screenName đã chọn
            const selectedRoom = rooms.find(r => r.name === values.screenName);
            if (!selectedRoom) {
                message.error('Không tìm thấy thông tin phòng chiếu');
                return;
            }

            // Chuẩn bị data theo format backend yêu cầu
            const scheduleData = {
                roomId: selectedRoom.id,
                movieId: values.movieId,
                date: values.date.format('YYYY-MM-DD'),
                startTime: values.time.format('HH:mm:ss'),
                ticketPrice: values.price,
                movieFormat: values.format, // MovieFormat enum value
                status: values.status || 'OPEN_FOR_BOOKING' // Mặc định: mở bán vé
            };

            console.log('Submitting schedule data:', scheduleData);

            if (showEditModal) {
                await showtimeService.updateShowtime(selectedSchedule.id, scheduleData);
                message.success('Cập nhật lịch chiếu thành công!');
                setShowEditModal(false);
                form.resetFields();
                setSelectedSchedule(null);
                await loadSchedules(currentPage, pageSize); // Reload trang hiện tại
            } else {
                await showtimeService.createShowtime(scheduleData);
                message.success('Thêm lịch chiếu thành công!');
                setShowAddModal(false);
                form.resetFields();
                setSelectedSchedule(null);
                setCurrentPage(1); // Reset về trang 1 khi thêm mới
                await loadSchedules(1, pageSize);
            }
        } catch (error) {
            console.error('Error saving schedule:', error);
            message.error(error.response?.data?.message || 'Lỗi khi lưu lịch chiếu');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'DRAFT': return 'default';
            case 'OPEN_FOR_BOOKING': return 'success';
            case 'BOOKING_CLOSED': return 'warning';
            case 'ONGOING': return 'processing';
            case 'FINISHED': return 'default';
            case 'CANCELED': return 'error';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'DRAFT': return 'Nháp';
            case 'OPEN_FOR_BOOKING': return 'Mở bán vé';
            case 'BOOKING_CLOSED': return 'Đã đóng đặt vé';
            case 'ONGOING': return 'Đang chiếu';
            case 'FINISHED': return 'Đã kết thúc';
            case 'CANCELED': return 'Đã hủy';
            default: return status;
        }
    };

    const getBookingRate = (seatsBooked, totalSeats) => {
        return Math.round((seatsBooked / totalSeats) * 100);
    };

    const getBookingRateColor = (rate) => {
        if (rate >= 80) return 'red';
        if (rate >= 60) return 'orange';
        if (rate >= 40) return 'blue';
        return 'green';
    };

    const getStatusTagColor = (status) => {
        switch (status) {
            case 'DRAFT': return 'default';
            case 'OPEN_FOR_BOOKING': return 'success';
            case 'BOOKING_CLOSED': return 'warning';
            case 'ONGOING': return 'processing';
            case 'FINISHED': return 'default';
            case 'CANCELED': return 'error';
            default: return 'default';
        }
    };

    const getMovieFormatLabel = (format) => {
        const formatLabels = {
            'TWO_D_SUB': '2D Phụ đề',
            'TWO_D_DUB': '2D Lồng tiếng',
            'TWO_D_VIET': '2D Tiếng Việt',
            'THREE_D_SUB': '3D Phụ đề',
            'THREE_D_DUB': '3D Lồng tiếng',
            'IMAX_2D': 'IMAX 2D',
            'IMAX_3D': 'IMAX 3D',
            'FOUR_DX': '4DX'
        };
        return formatLabels[format] || format || 'N/A';
    };

    const calculateDuration = (startTime, endTime) => {
        if (!startTime || !endTime) return 'N/A';
        const start = dayjs(startTime, 'HH:mm:ss');
        const end = dayjs(endTime, 'HH:mm:ss');
        const diffMinutes = end.diff(start, 'minute');
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        return `${hours} giờ ${minutes} phút`;
    };

    const renderShowtimeSeatGrid = (showtimeSeatsData) => {
        if (!showtimeSeatsData || showtimeSeatsData.length === 0) return null;

        // Group seats by row
        const seatsByRow = {};
        showtimeSeatsData.forEach(showtimeSeat => {
            const seat = showtimeSeat.seat;
            if (!seat) return;

            const rowLabel = seat.rowLabel;
            if (!seatsByRow[rowLabel]) {
                seatsByRow[rowLabel] = [];
            }
            seatsByRow[rowLabel].push({
                ...seat,
                status: showtimeSeat.status, // AVAILABLE, BOOKED, RESERVED
                price: showtimeSeat.price,
                showtimeSeatId: showtimeSeat.id
            });
        });

        // Sort rows alphabetically
        const sortedRows = Object.keys(seatsByRow).sort();

        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                {sortedRows.map(rowLabel => {
                    const rowSeats = seatsByRow[rowLabel].sort((a, b) =>
                        parseInt(a.seatNumber) - parseInt(b.seatNumber)
                    );

                    return (
                        <div key={rowLabel} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* Row Label */}
                            <div style={{
                                width: '30px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                color: '#1890ff'
                            }}>
                                {rowLabel}
                            </div>

                            {/* Seats in Row */}
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {rowSeats.map(seat => {
                                    const isBooked = seat.status === 'BOOKED';
                                    const isReserved = seat.status === 'RESERVED';
                                    const isVIP = seat.seatType === 'VIP';
                                    const isCouple = seat.seatType === 'COUPLE';
                                    const isAvailable = seat.status === 'AVAILABLE' && seat.isActive;

                                    let backgroundColor = '#d9d9d9'; // Default - gray
                                    if (!seat.isActive) {
                                        backgroundColor = '#d9d9d9'; // Inactive - gray
                                    } else if (isBooked) {
                                        backgroundColor = '#ff5500'; // Booked - orange/red
                                    } else if (isReserved) {
                                        backgroundColor = '#faad14'; // Reserved - orange
                                    } else if (isAvailable) {
                                        if (isVIP) {
                                            backgroundColor = '#ffd700'; // VIP Available - gold
                                        } else {
                                            backgroundColor = '#52c41a'; // Available - green
                                        }
                                    }

                                    let statusText = 'Không khả dụng';
                                    if (seat.isActive) {
                                        if (isBooked) statusText = 'Đã đặt';
                                        else if (isReserved) statusText = 'Đang giữ';
                                        else statusText = 'Còn trống';
                                    }

                                    return (
                                        <Tooltip
                                            key={seat.id}
                                            title={
                                                <div>
                                                    <div>Ghế: {seat.rowLabel}{seat.seatNumber}</div>
                                                    <div>Loại: {seat.seatType}</div>
                                                    <div>Trạng thái: {statusText}</div>
                                                    <div>Giá: {seat.price?.toLocaleString('vi-VN')} VNĐ</div>
                                                </div>
                                            }
                                        >
                                            <div
                                                style={{
                                                    width: isCouple ? '50px' : '35px',
                                                    height: '35px',
                                                    backgroundColor,
                                                    borderRadius: '4px',
                                                    border: `2px solid ${isBooked ? '#d4380d' :
                                                        isReserved ? '#d48806' :
                                                            isVIP && isAvailable ? '#d4b106' :
                                                                isAvailable ? '#389e0d' :
                                                                    '#bfbfbf'
                                                        }`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '11px',
                                                    fontWeight: '500',
                                                    color: !seat.isActive ? '#8c8c8c' : '#fff',
                                                    cursor: 'default',
                                                    userSelect: 'none',
                                                    opacity: !seat.isActive ? 0.5 : 1
                                                }}
                                            >
                                                {seat.seatNumber}
                                            </div>
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const saveSeatLayout = async (seatData) => {
        // SeatManager sẽ tự động lưu, chỉ cần đóng modal
        message.success('Cập nhật sơ đồ ghế thành công');
        setShowSeatsModal(false);
    };

    // Tính toán thống kê (hiển thị từ trang hiện tại)
    const stats = {
        totalSchedules: totalElements, // Tổng số từ backend
        activeSchedules: schedules.filter(s => s.status === 'OPEN_FOR_BOOKING' || s.status === 'ONGOING').length,
        totalRevenue: schedules.reduce((sum, s) => sum + (s.price * s.seatsBooked), 0),
        avgBookingRate: schedules.length > 0 ?
            schedules.reduce((sum, s) => sum + getBookingRate(s.seatsBooked, s.totalSeats), 0) / schedules.length : 0
    };

    // TODO: Chuyển filtering sang backend API
    // Hiện tại vẫn filter phía client cho trang hiện tại
    const filteredSchedules = schedules.filter(schedule => {
        const movieTitle = getMovieTitle(schedule.movieId).toLowerCase();
        const cinemaName = getCinemaName(schedule.cinemaId).toLowerCase();
        const searchMatch = movieTitle.includes(searchText.toLowerCase()) ||
            cinemaName.includes(searchText.toLowerCase()) ||
            schedule.screenName.toLowerCase().includes(searchText.toLowerCase());

        const movieMatch = movieFilter === 'all' || schedule.movieId === parseInt(movieFilter);
        const cinemaMatch = cinemaFilter === 'all' || schedule.cinemaId === parseInt(cinemaFilter);
        const statusMatch = statusFilter === 'all' || schedule.status === statusFilter;

        // Date range filter
        let dateMatch = true;
        if (dateRange && dateRange.length === 2) {
            const scheduleDate = dayjs(schedule.date);
            dateMatch = scheduleDate.isSameOrAfter(dateRange[0], 'day') &&
                scheduleDate.isSameOrBefore(dateRange[1], 'day');
        }

        return searchMatch && movieMatch && cinemaMatch && statusMatch && dateMatch;
    });

    // Batch operations
    const handleBatchDelete = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Vui lòng chọn ít nhất một lịch chiếu để xóa');
            return;
        }

        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} lịch chiếu đã chọn?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                try {
                    await Promise.all(
                        selectedRowKeys.map(id => showtimeService.deleteShowtime(id))
                    );
                    message.success(`Đã xóa ${selectedRowKeys.length} lịch chiếu`);
                    setSelectedRowKeys([]);
                    await loadSchedules();
                } catch (error) {
                    console.error('Error batch deleting:', error);
                    message.error('Lỗi khi xóa hàng loạt');
                }
            }
        });
    };

    const handleBatchStatusChange = async (newStatus) => {
        if (selectedRowKeys.length === 0) {
            message.warning('Vui lòng chọn ít nhất một lịch chiếu');
            return;
        }

        try {
            await Promise.all(
                selectedRowKeys.map(id => showtimeService.updateShowtimeStatus(id, newStatus))
            );
            message.success(`Đã cập nhật trạng thái cho ${selectedRowKeys.length} lịch chiếu`);
            setSelectedRowKeys([]);
            await loadSchedules();
        } catch (error) {
            console.error('Error batch status update:', error);
            message.error('Lỗi khi cập nhật trạng thái hàng loạt');
        }
    };

    const handleDuplicate = (schedule) => {
        form.setFieldsValue({
            movieId: schedule.movieId,
            cinemaId: schedule.cinemaId,
            screenName: schedule.screenName,
            date: dayjs(schedule.date).add(1, 'day'), // Duplicate cho ngày hôm sau
            time: dayjs(schedule.time, 'HH:mm'),
            price: schedule.price,
            format: schedule.format,
            language: schedule.language,
            type: schedule.type,
            status: 'OPEN_FOR_BOOKING'
        });
        setShowAddModal(true);
    };

    // Row selection config
    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
        ],
    };

    const columns = [
        {
            title: 'Phim',
            key: 'movie',
            width: 200,
            fixed: 'left',
            ellipsis: true,
            render: (_, record) => (
                <Space direction="vertical" size={4}>
                    <Text strong>{record.movieTitle}</Text>
                    <Tag color="blue">{record.format}</Tag>
                </Space>
            ),
        },
        {
            title: 'Rạp chiếu',
            key: 'cinema',
            width: 180,
            ellipsis: true,
            render: (_, record) => (
                <Space direction="vertical" size={4}>
                    <Text>{record.cinemaName}</Text>
                    <Text type="secondary">{record.roomName}</Text>
                </Space>
            ),
        },
        {
            title: 'Ngày & Giờ',
            key: 'datetime',
            width: 150,
            align: 'center',
            // sorter: (a, b) => dayjs(a.showDate + ' ' + a.startTime).unix() - dayjs(b.showDate + ' ' + b.startTime).unix(),
            render: (_, record) => (
                <Space direction="vertical" size={4}>
                    <Space>
                        <CalendarOutlined />
                        <Text>{dayjs(record.showDate).format('DD/MM/YYYY')}</Text>
                    </Space>
                    <Space>
                        <ClockCircleOutlined />
                        <Tag color="green">{record.startTime} - {record.endTime}</Tag>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Giá vé',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            align: 'right',
            // sorter: (a, b) => a.price - b.price,
            render: (price) => (
                <Text strong style={{ color: '#f50' }}>
                    {price?.toLocaleString('vi-VN')} VNĐ
                </Text>
            ),
        },
        {
            title: 'Đặt vé',
            key: 'booking',
            width: 110,
            align: 'center',
            // sorter: (a, b) => getBookingRate(a.seatsBooked, a.totalSeats) - getBookingRate(b.seatsBooked, b.totalSeats),    
            render: (_, record) => {
                const rate = getBookingRate(record.seatsBooked, record.totalSeats);
                return (
                    <Space direction="vertical" size={4}>
                        <Text>{record.seatsBooked}/{record.totalSeats} ghế</Text>
                        <Tag color={getBookingRateColor(rate)}>{rate}%</Tag>
                    </Space>
                );
            },
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 140,
            align: 'center',
            filters: [
                { text: 'Nháp', value: 'DRAFT' },
                { text: 'Mở bán vé', value: 'OPEN_FOR_BOOKING' },
                { text: 'Đã đóng đặt vé', value: 'BOOKING_CLOSED' },
                { text: 'Đang chiếu', value: 'ONGOING' },
                { text: 'Đã kết thúc', value: 'FINISHED' },
                { text: 'Đã hủy', value: 'CANCELED' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (_, record) => {
                const statusConfig = {
                    'DRAFT': { color: 'default', text: 'Nháp' },
                    'OPEN_FOR_BOOKING': { color: 'success', text: 'Mở bán vé' },
                    'BOOKING_CLOSED': { color: 'warning', text: 'Đóng đặt vé' },
                    'ONGOING': { color: 'processing', text: 'Đang chiếu' },
                    'FINISHED': { color: 'default', text: 'Kết thúc' },
                    'CANCELED': { color: 'error', text: 'Đã hủy' }
                };
                const config = statusConfig[record.status] || { color: 'default', text: record.status };
                return (
                    <Tag color={config.color} style={{ fontWeight: 500 }}>
                        {config.text}
                    </Tag>
                );
            },
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 300,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Space wrap>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => handleViewSchedule(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Danh sách ghế">
                        <Button
                            icon={<AppstoreOutlined />}
                            size="small"
                            type="primary"
                            ghost
                            onClick={() => handleViewSeats(record)}
                        />
                    </Tooltip>
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditSchedule(record)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa lịch chiếu"
                        description="Bạn có chắc chắn muốn xóa lịch chiếu này?"
                        onConfirm={() => handleDeleteSchedule(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="schedules-container">
            {/* Header */}
            <Card className="schedules-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Title level={2} style={{ margin: 0 }}>Quản lý Lịch chiếu</Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={handleAddSchedule}
                    >
                        Thêm Lịch chiếu
                    </Button>
                </div>

                {/* Filters */}
                <Row gutter={[12, 12]}>
                    <Col xs={24} sm={24} md={6} lg={6}>
                        <Input
                            placeholder="Tìm kiếm lịch chiếu..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={5}>
                        <RangePicker
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                            placeholder={['Từ ngày', 'Đến ngày']}
                            value={dateRange}
                            onChange={setDateRange}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={5}>
                        <Select
                            placeholder="Lọc theo phim"
                            value={movieFilter}
                            onChange={setMovieFilter}
                            style={{ width: '100%' }}
                            allowClear
                            showSearch
                            optionFilterProp="children"
                        >
                            <Option value="all">Tất cả phim</Option>
                            {movies.map(movie => (
                                <Option key={movie.id} value={movie.id.toString()}>
                                    {movie.title}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={4}>
                        <Select
                            placeholder="Lọc theo rạp"
                            value={cinemaFilter}
                            onChange={setCinemaFilter}
                            style={{ width: '100%' }}
                            allowClear
                            showSearch
                            optionFilterProp="children"
                        >
                            <Option value="all">Tất cả rạp</Option>
                            {cinemas.map(cinema => (
                                <Option key={cinema.id} value={cinema.id.toString()}>
                                    {cinema.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={4}>
                        <Select
                            placeholder="Lọc theo trạng thái"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: '100%' }}
                            allowClear
                        >
                            <Option value="all">Tất cả trạng thái</Option>
                            <Option value="DRAFT">Nháp</Option>
                            <Option value="OPEN_FOR_BOOKING">Mở bán vé</Option>
                            <Option value="BOOKING_CLOSED">Đã đóng đặt vé</Option>
                            <Option value="ONGOING">Đang chiếu</Option>
                            <Option value="FINISHED">Đã kết thúc</Option>
                            <Option value="CANCELED">Đã hủy</Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* Filter Info */}
            {(searchText || dateRange || movieFilter !== 'all' || cinemaFilter !== 'all' || statusFilter !== 'all') && (
                <Alert
                    message={
                        <Space wrap>
                            <Text strong>Đang lọc:</Text>
                            {searchText && <Tag color="blue" closable onClose={() => setSearchText('')}>Từ khóa: {searchText}</Tag>}
                            {dateRange && <Tag color="cyan" closable onClose={() => setDateRange(null)}>
                                Từ {dateRange[0].format('DD/MM')} đến {dateRange[1].format('DD/MM')}
                            </Tag>}
                            {movieFilter !== 'all' && <Tag color="green" closable onClose={() => setMovieFilter('all')}>
                                Phim: {getMovieTitle(parseInt(movieFilter))}
                            </Tag>}
                            {cinemaFilter !== 'all' && <Tag color="orange" closable onClose={() => setCinemaFilter('all')}>
                                Rạp: {getCinemaName(parseInt(cinemaFilter))}
                            </Tag>}
                            {statusFilter !== 'all' && <Tag color="purple" closable onClose={() => setStatusFilter('all')}>
                                Trạng thái: {getStatusText(statusFilter)}
                            </Tag>}
                            <Text type="secondary">→ Tìm thấy {filteredSchedules.length} kết quả</Text>
                        </Space>
                    }
                    type="info"
                    showIcon
                    closable
                    onClose={() => {
                        setSearchText('');
                        setDateRange(null);
                        setMovieFilter('all');
                        setCinemaFilter('all');
                        setStatusFilter('all');
                    }}
                    style={{ marginBottom: 16 }}
                />
            )}

            {/* Schedules Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredSchedules}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalElements, // Sử dụng tổng số từ backend
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ['5', '10', '20', '50', '100'],
                        showTotal: (total, range) => `Hiển thị ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, total)} trong tổng số ${total} lịch chiếu`,
                        onChange: (page, size) => {
                            setCurrentPage(page);
                            if (size !== pageSize) {
                                setPageSize(size);
                            }
                        },
                        onShowSizeChange: (current, size) => {
                            setCurrentPage(1); // Reset về trang 1 khi thay đổi kích thước
                            setPageSize(size);
                        },
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* Add Schedule Modal */}
            <Modal
                title="Thêm Lịch chiếu"
                open={showAddModal}
                onCancel={() => {
                    setShowAddModal(false);
                    form.resetFields();
                    setRooms([]); // Reset danh sách phòng
                }}
                footer={null}
                width={800}
                destroyOnClose
            >
                {(movies.length === 0 || cinemas.length === 0) && (
                    <Alert
                        message="Thiếu dữ liệu"
                        description={
                            <div>
                                {movies.length === 0 && <div>• Chưa có phim nào. Vui lòng thêm phim trước.</div>}
                                {cinemas.length === 0 && <div>• Chưa có rạp nào. Vui lòng thêm rạp trước.</div>}
                            </div>
                        }
                        type="warning"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Phim"
                                name="movieId"
                                rules={[{ required: true, message: 'Vui lòng chọn phim' }]}
                            >
                                <Select
                                    placeholder={moviesLoading ? "Đang tải..." : movies.length === 0 ? "Không có phim" : "Chọn phim"}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    loading={moviesLoading}
                                    disabled={moviesLoading || movies.length === 0}
                                    notFoundContent={moviesLoading ? "Đang tải..." : "Không có phim nào"}
                                    getPopupContainer={(trigger) => trigger.parentElement}
                                >
                                    {movies.map(movie => (
                                        <Option key={movie.id} value={movie.id}>
                                            {movie.title}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Rạp chiếu"
                                name="cinemaId"
                                rules={[{ required: true, message: 'Vui lòng chọn rạp' }]}
                            >
                                <Select
                                    placeholder={cinemasLoading ? "Đang tải..." : cinemas.length === 0 ? "Không có rạp" : "Chọn rạp"}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    loading={cinemasLoading}
                                    disabled={cinemasLoading || cinemas.length === 0}
                                    notFoundContent={cinemasLoading ? "Đang tải..." : "Không có rạp nào"}
                                    getPopupContainer={(trigger) => trigger.parentElement}
                                    onChange={handleCinemaChange}
                                >
                                    {cinemas.map(cinema => (
                                        <Option key={cinema.id} value={cinema.id}>
                                            {cinema.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Phòng chiếu"
                                name="screenName"
                                rules={[{ required: true, message: 'Vui lòng chọn phòng chiếu' }]}
                            >
                                <Select
                                    placeholder={roomsLoading ? "Đang tải..." : rooms.length === 0 ? "Chọn rạp trước" : "Chọn phòng chiếu"}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    loading={roomsLoading}
                                    disabled={roomsLoading || rooms.length === 0}
                                    notFoundContent={roomsLoading ? "Đang tải..." : rooms.length === 0 ? "Vui lòng chọn rạp trước" : "Không có phòng chiếu nào"}
                                    getPopupContainer={(trigger) => trigger.parentElement}
                                    onChange={handleRoomChange}
                                >
                                    {rooms.map(room => (
                                        <Option key={room.id} value={room.name}>
                                            {room.name} ({room.roomType})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Định dạng phim"
                                name="format"
                                rules={[{ required: true, message: 'Vui lòng chọn định dạng phim' }]}
                            >
                                <Select
                                    placeholder="Chọn định dạng phim"
                                    showSearch
                                    allowClear
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    getPopupContainer={(trigger) => trigger.parentElement}
                                >
                                    <Option value="TWO_D_SUB">2D Phụ đề</Option>
                                    <Option value="TWO_D_DUB">2D Lồng tiếng</Option>
                                    <Option value="TWO_D_VIET">2D Tiếng Việt</Option>
                                    <Option value="THREE_D_SUB">3D Phụ đề</Option>
                                    <Option value="THREE_D_DUB">3D Lồng tiếng</Option>
                                    <Option value="IMAX_2D">IMAX 2D</Option>
                                    <Option value="IMAX_3D">IMAX 3D</Option>
                                    <Option value="FOUR_DX">4DX</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Ngày chiếu"
                                name="date"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    getPopupContainer={(trigger) => trigger.parentElement}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Giờ chiếu"
                                name="time"
                                rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
                            >
                                <TimePicker
                                    style={{ width: '100%' }}
                                    format="HH:mm"
                                    getPopupContainer={(trigger) => trigger.parentElement}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Giá vé (VNĐ)"
                                name="price"
                                rules={[{ required: true, message: 'Vui lòng nhập giá vé' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        initialValue="OPEN_FOR_BOOKING"
                    >
                        <Select getPopupContainer={(trigger) => trigger.parentElement}>
                            <Option value="DRAFT">Nháp</Option>
                            <Option value="OPEN_FOR_BOOKING">Mở bán vé</Option>
                            <Option value="BOOKING_CLOSED">Đã đóng đặt vé</Option>
                            <Option value="ONGOING">Đang chiếu</Option>
                            <Option value="FINISHED">Đã kết thúc</Option>
                            <Option value="CANCELED">Đã hủy</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => {
                                setShowAddModal(false);
                                form.resetFields();
                            }}>
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={movies.length === 0 || cinemas.length === 0}
                            >
                                Thêm Lịch chiếu
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Schedule Modal */}
            <Modal
                title="Chỉnh sửa Lịch chiếu"
                open={showEditModal}
                onCancel={() => {
                    setShowEditModal(false);
                    form.resetFields();
                    setSelectedSchedule(null);
                    setRooms([]); // Reset danh sách phòng
                }}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Phim"
                                name="movieId"
                                rules={[{ required: true, message: 'Vui lòng chọn phim' }]}
                            >
                                <Select
                                    placeholder={moviesLoading ? "Đang tải..." : movies.length === 0 ? "Không có phim" : "Chọn phim"}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    loading={moviesLoading}
                                    disabled={moviesLoading || movies.length === 0}
                                    notFoundContent={moviesLoading ? "Đang tải..." : "Không có phim nào"}
                                    getPopupContainer={(trigger) => trigger.parentElement}
                                >
                                    {movies.map(movie => (
                                        <Option key={movie.id} value={movie.id}>
                                            {movie.title}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Rạp chiếu"
                                name="cinemaId"
                                rules={[{ required: true, message: 'Vui lòng chọn rạp' }]}
                            >
                                <Select
                                    placeholder={cinemasLoading ? "Đang tải..." : cinemas.length === 0 ? "Không có rạp" : "Chọn rạp"}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    loading={cinemasLoading}
                                    disabled={cinemasLoading || cinemas.length === 0}
                                    notFoundContent={cinemasLoading ? "Đang tải..." : "Không có rạp nào"}
                                    getPopupContainer={(trigger) => trigger.parentElement}
                                    onChange={handleCinemaChange}
                                >
                                    {cinemas.map(cinema => (
                                        <Option key={cinema.id} value={cinema.id}>
                                            {cinema.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Phòng chiếu"
                                name="screenName"
                                rules={[{ required: true, message: 'Vui lòng chọn phòng chiếu' }]}
                            >
                                <Select
                                    placeholder={roomsLoading ? "Đang tải..." : rooms.length === 0 ? "Chọn rạp trước" : "Chọn phòng chiếu"}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    loading={roomsLoading}
                                    disabled={roomsLoading || rooms.length === 0}
                                    notFoundContent={roomsLoading ? "Đang tải..." : rooms.length === 0 ? "Vui lòng chọn rạp trước" : "Không có phòng chiếu nào"}
                                    getPopupContainer={(trigger) => trigger.parentElement}
                                    onChange={handleRoomChange}
                                >
                                    {rooms.map(room => (
                                        <Option key={room.id} value={room.name}>
                                            {room.name} ({room.roomType})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Định dạng phim"
                                name="format"
                                rules={[{ required: true, message: 'Vui lòng chọn định dạng phim' }]}
                            >
                                <Select
                                    placeholder="Chọn định dạng phim"
                                    showSearch
                                    allowClear
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    getPopupContainer={(trigger) => trigger.parentElement}
                                >
                                    <Option value="TWO_D_SUB">2D Phụ đề</Option>
                                    <Option value="TWO_D_DUB">2D Lồng tiếng</Option>
                                    <Option value="TWO_D_VIET">2D Tiếng Việt</Option>
                                    <Option value="THREE_D_SUB">3D Phụ đề</Option>
                                    <Option value="THREE_D_DUB">3D Lồng tiếng</Option>
                                    <Option value="IMAX_2D">IMAX 2D</Option>
                                    <Option value="IMAX_3D">IMAX 3D</Option>
                                    <Option value="FOUR_DX">4DX</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Ngày chiếu"
                                name="date"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    getPopupContainer={(trigger) => trigger.parentElement}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Giờ chiếu"
                                name="time"
                                rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
                            >
                                <TimePicker
                                    style={{ width: '100%' }}
                                    format="HH:mm"
                                    getPopupContainer={(trigger) => trigger.parentElement}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Giá vé (VNĐ)"
                                name="price"
                                rules={[{ required: true, message: 'Vui lòng nhập giá vé' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                    >
                        <Select getPopupContainer={(trigger) => trigger.parentElement}>
                            <Option value="DRAFT">Nháp</Option>
                            <Option value="OPEN_FOR_BOOKING">Mở bán vé</Option>
                            <Option value="BOOKING_CLOSED">Đã đóng đặt vé</Option>
                            <Option value="ONGOING">Đang chiếu</Option>
                            <Option value="FINISHED">Đã kết thúc</Option>
                            <Option value="CANCELED">Đã hủy</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => {
                                setShowEditModal(false);
                                form.resetFields();
                                setSelectedSchedule(null);
                            }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Detail Modal */}
            <Modal
                title="Chi tiết Lịch chiếu"
                open={showDetailModal}
                onCancel={() => {
                    setShowDetailModal(false);
                    setSelectedSchedule(null);
                }}
                footer={[
                    <Button key="close" onClick={() => {
                        setShowDetailModal(false);
                        setSelectedSchedule(null);
                    }}>
                        Đóng
                    </Button>,
                    <Button
                        key="edit"
                        type="primary"
                        onClick={() => {
                            setShowDetailModal(false);
                            handleEditSchedule(selectedSchedule);
                        }}
                    >
                        Chỉnh sửa
                    </Button>
                ]}
                width={800}
            >
                {selectedSchedule && (
                    <div>
                        {/* Header Info */}
                        <Alert
                            message={selectedSchedule.movieTitle}
                            description={
                                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                    <Text><ShopOutlined /> {selectedSchedule.cinemaName} - {selectedSchedule.roomName}</Text>
                                    <Text><CalendarOutlined /> {dayjs(selectedSchedule.showDate).format('DD/MM/YYYY')} | <ClockCircleOutlined /> {selectedSchedule.startTime} - {selectedSchedule.endTime}</Text>
                                </Space>
                            }
                            type="info"
                            showIcon
                            icon={<VideoCameraOutlined />}
                            style={{ marginBottom: 20 }}
                        />

                        {/* Main Info Grid */}
                        <Row gutter={[16, 16]}>
                            {/* Movie & Cinema Info */}
                            <Col span={24}>
                                <Card size="small" title="Thông tin cơ bản" bordered={true}>
                                    <Row gutter={[16, 12]}>
                                        <Col span={12}>
                                            <Text type="secondary">Phim:</Text>
                                            <div><Text strong>{selectedSchedule.movieTitle}</Text></div>
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary">Rạp chiếu:</Text>
                                            <div><Text strong>{selectedSchedule.cinemaName}</Text></div>
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary">Phòng chiếu:</Text>
                                            <div><Text strong>{selectedSchedule.roomName}</Text></div>
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary">Định dạng phim:</Text>
                                            <div><Tag color="blue">{getMovieFormatLabel(selectedSchedule.movieFormat || selectedSchedule.format)}</Tag></div>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>

                            {/* Showtime Info */}
                            <Col span={12}>
                                <Card size="small" title="Thông tin chiếu phim" bordered={true}>
                                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                                        <div>
                                            <Text type="secondary">Ngày chiếu:</Text>
                                            <div><Tag color="cyan" icon={<CalendarOutlined />}>{dayjs(selectedSchedule.showDate).format('DD/MM/YYYY')}</Tag></div>
                                        </div>
                                        <div>
                                            <Text type="secondary">Giờ chiếu:</Text>
                                            <div><Tag color="green" icon={<ClockCircleOutlined />}>{selectedSchedule.startTime} - {selectedSchedule.endTime}</Tag></div>
                                        </div>
                                        <div>
                                            <Text type="secondary">Thời lượng:</Text>
                                            <div><Text strong>{calculateDuration(selectedSchedule.startTime, selectedSchedule.endTime)}</Text></div>
                                        </div>
                                    </Space>
                                </Card>
                            </Col>

                            {/* Pricing & Status */}
                            <Col span={12}>
                                <Card size="small" title="Giá vé & Trạng thái" bordered={true}>
                                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                                        <div>
                                            <Text type="secondary">Giá vé:</Text>
                                            <div>
                                                <Text strong style={{ fontSize: '18px', color: '#ff5500' }}>
                                                    {selectedSchedule.price?.toLocaleString('vi-VN')} VNĐ
                                                </Text>
                                            </div>
                                        </div>
                                        <div>
                                            <Text type="secondary">Trạng thái:</Text>
                                            <div>
                                                <Tag
                                                    color={getStatusTagColor(selectedSchedule.status)}
                                                    style={{ fontSize: '13px', padding: '4px 12px' }}
                                                >
                                                    {getStatusText(selectedSchedule.status)}
                                                </Tag>
                                            </div>
                                        </div>
                                        {/* <div>
                                            <Text type="secondary">Trạng thái hoạt động:</Text>
                                            <div>
                                                <Badge
                                                    status={selectedSchedule.isActive ? "success" : "default"}
                                                    text={selectedSchedule.isActive ? "Đang hoạt động" : "Không hoạt động"}
                                                />
                                            </div>
                                        </div> */}
                                    </Space>
                                </Card>
                            </Col>

                            {/* Booking Statistics */}
                            <Col span={24}>
                                <Card size="small" title="Thống kê đặt vé" bordered={true}>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Statistic
                                                title="Tổng số ghế"
                                                value={selectedSchedule.totalSeats}
                                                prefix={<UserOutlined />}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <Statistic
                                                title="Đã đặt"
                                                value={selectedSchedule.seatsBooked}
                                                valueStyle={{ color: '#3f8600' }}
                                                prefix={<UserOutlined />}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <Statistic
                                                title="Tỷ lệ đặt vé"
                                                value={getBookingRate(selectedSchedule.seatsBooked, selectedSchedule.totalSeats)}
                                                suffix="%"
                                                valueStyle={{
                                                    color: getBookingRate(selectedSchedule.seatsBooked, selectedSchedule.totalSeats) > 70 ? '#cf1322' : '#3f8600'
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>

            {/* Seats Modal - Showtime Seat Viewer */}
            {showSeatsModal && selectedSchedule && (
                <Modal
                    title={
                        <Space size="middle">
                            <SettingOutlined style={{ color: '#1890ff' }} />
                            <span>Sơ đồ ghế - {selectedSchedule.movieTitle}</span>
                            <Tag color="blue">{selectedSchedule.cinemaName}</Tag>
                        </Space>
                    }
                    open={showSeatsModal}
                    onCancel={() => {
                        setShowSeatsModal(false);
                        setSelectedSchedule(null);
                        setShowtimeSeats([]);
                    }}
                    footer={null}
                    width="60%"
                    style={{ top: 20 }}
                    bodyStyle={{ height: '75vh', overflow: 'auto', padding: '16px' }}
                    className="seat-manager-modal"
                >
                    <SeatViewer
                        showtimeId={selectedSchedule.id}
                        selectedScreen={{
                            name: selectedSchedule.roomName,
                            cinemaName: selectedSchedule.cinemaName
                        }}
                    />
                </Modal>
            )}
        </div>
    );
};

export default Schedules;
