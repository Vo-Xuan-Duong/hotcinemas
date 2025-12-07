import React, { useMemo, useState } from 'react';
import { Modal, Input, Button, Typography } from 'antd';

const { Text } = Typography;

export default function LocationSelectModal({ open, onClose, onSelect, value, cities = [] }) {
    const [search, setSearch] = useState('');

    console.log('LocationSelectModal received cities:', cities);

    const filtered = useMemo(() => {
        if (!search.trim()) return cities;
        return cities.filter(city =>
            city.name && city.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, cities]);

    console.log('Filtered cities:', filtered);

    const handleSelect = (city) => {
        onSelect(city);
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
            title={<div className="location-modal-header"><Text strong style={{ fontSize: 18 }}>Chọn thành phố</Text></div>}
        >
            <div className="location-modal-toolbar">
                <Input
                    placeholder="Tìm thành phố ..."
                    value={search}
                    allowClear
                    onChange={e => setSearch(e.target.value)}
                    className="location-search-input"
                />
            </div>
            <div className="location-grid">
                {filtered.map(city => {
                    const active = city.name === value;
                    return (
                        <Button
                            key={city.id}
                            type={active ? 'primary' : 'text'}
                            className={`province-item ${active ? 'active' : ''}`}
                            onClick={() => handleSelect(city)}
                        >
                            {city.name}
                        </Button>
                    );
                })}
                {!filtered.length && (
                    <div className="no-results">
                        <Text type="secondary">Không tìm thấy thành phố phù hợp.</Text>
                    </div>
                )}
            </div>
            <div className="location-modal-footer">
                <Button onClick={onClose} className="close-modal-btn" type="primary">Đóng</Button>
            </div>
        </Modal>
    );
}
