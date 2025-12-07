import React, { useState, useEffect } from 'react';
import {
    CustomerServiceOutlined,
    MessageOutlined,
    PhoneOutlined
} from '@ant-design/icons';
import ChatModal from '../ChatModal/ChatModal';
import './FloatingSupport.css';

const FloatingSupport = () => {
    const [chatModalOpen, setChatModalOpen] = useState(false);

    useEffect(() => {
        console.log('FloatingSupport mounted');
        return () => console.log('FloatingSupport unmounted');
    }, []);

    return (
        <>
            {/* Custom Floating Support Buttons */}
            <div
                className="custom-floating-support"
                style={{
                    position: 'fixed !important',
                    right: '24px !important',
                    bottom: '24px !important',
                    zIndex: 2147483647,
                    display: 'flex !important',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '12px',
                    pointerEvents: 'auto !important',
                    visibility: 'visible !important',
                    opacity: 1
                }}
            >
                <div className="support-buttons-container">
                    <div
                        className="support-button phone-support"
                        onClick={() => window.open('tel:19006420')}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <PhoneOutlined />
                        <span className="tooltip-text">Hotline: 1900-6420</span>
                    </div>
                    <div
                        className="support-button chat-support"
                        onClick={() => setChatModalOpen(true)}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <MessageOutlined />
                        <span className="tooltip-text">Chat trực tuyến</span>
                    </div>
                </div>
                <div
                    className="main-support-button"
                    style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1890ff, #096dd9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white',
                        fontSize: '20px',
                        boxShadow: '0 6px 20px rgba(24, 144, 255, 0.4)',
                        pointerEvents: 'auto'
                    }}
                >
                    <CustomerServiceOutlined />
                    <span className="tooltip-text">Hỗ trợ khách hàng</span>
                </div>
            </div>

            {/* Chat Modal */}
            {chatModalOpen && (
                <ChatModal open={chatModalOpen} onClose={() => setChatModalOpen(false)} />
            )}
        </>
    );
};

export default FloatingSupport;
