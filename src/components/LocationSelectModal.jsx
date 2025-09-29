import React, { useMemo, useState } from 'react';
import { Modal, Input, Button, Typography } from 'antd';

const { Text } = Typography;

// Basic provinces list (có thể mở rộng hoặc fetch sau)
const PROVINCES = [
    'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Đồng Nai', 'Lạng Sơn', 'Bình Dương', 'An Giang', 'Bà Rịa Vũng Tàu',
    'Bắc Giang', 'Bạc Liêu', 'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Thuận', 'Cà Mau', 'Cần Thơ', 'Đắk Lắk', 'Đồng Tháp',
    'Gia Lai', 'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hải Phòng', 'Hậu Giang', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum',
    'Lâm Đồng', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình',
    'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên',
    'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
];

export default function LocationSelectModal({ open, onClose, onSelect, value }) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!search.trim()) return PROVINCES;
        return PROVINCES.filter(p => p.toLowerCase().includes(search.toLowerCase()));
    }, [search]);

    const handleSelect = (province) => {
        onSelect(province);
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={780}
            destroyOnClose
            className="location-select-modal"
            title={<div className="location-modal-header"><Text strong style={{ fontSize: 18 }}>Chọn địa điểm</Text></div>}
        >
            <div className="location-modal-toolbar">
                <Input
                    placeholder="Tìm địa điểm ..."
                    value={search}
                    allowClear
                    onChange={e => setSearch(e.target.value)}
                    className="location-search-input"
                />
            </div>
            <div className="location-grid">
                {filtered.map(province => {
                    const active = province === value;
                    return (
                        <Button
                            key={province}
                            type={active ? 'primary' : 'text'}
                            className={`province-item ${active ? 'active' : ''}`}
                            onClick={() => handleSelect(province)}
                        >
                            {province}
                        </Button>
                    );
                })}
                {!filtered.length && (
                    <div className="no-results">
                        <Text type="secondary">Không tìm thấy địa điểm phù hợp.</Text>
                    </div>
                )}
            </div>
            <div className="location-modal-footer">
                <Button onClick={onClose} className="close-modal-btn" type="primary">Đóng</Button>
            </div>
        </Modal>
    );
}
