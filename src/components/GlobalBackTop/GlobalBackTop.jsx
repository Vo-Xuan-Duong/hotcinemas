import React, { useState, useEffect } from 'react';
import { ArrowUpOutlined } from '@ant-design/icons';

const GlobalBackTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setIsVisible(scrollTop > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!isVisible) return null;

    return (
        <div
            onClick={scrollToTop}
            style={{
                position: 'fixed',
                right: '24px',
                bottom: '24px',
                width: '56px',
                height: '56px',
                backgroundColor: '#ff6b35',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 9999,
                boxShadow: '0 4px 20px rgba(255, 107, 53, 0.4)',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)'
            }}
            title="Về đầu trang"
        >
            <ArrowUpOutlined
                style={{
                    color: 'white',
                    fontSize: '20px'
                }}
            />
        </div>
    );
};

export default GlobalBackTop;
