import React, { useState, useRef, useEffect } from 'react';
import { Modal, Input, Button, Avatar, Space, message } from 'antd';
import {
    SendOutlined,
    RobotOutlined,
    UserOutlined,
    CloseOutlined
} from '@ant-design/icons';
import './ChatModal.css';

const { TextArea } = Input;

const ChatModal = ({ open, onClose }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: 'Xin chào! Tôi là trợ lý AI của HotCinemas. Tôi có thể giúp gì cho bạn?',
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Simulate AI response
    const generateAIResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();

        // Các câu trả lời mẫu
        if (lowerMessage.includes('giá vé') || lowerMessage.includes('giá')) {
            return 'Giá vé phim dao động từ 45.000đ - 150.000đ tùy theo suất chiếu và loại phòng. Bạn có thể xem chi tiết giá vé khi chọn suất chiếu nhé!';
        } else if (lowerMessage.includes('đặt vé') || lowerMessage.includes('mua vé')) {
            return 'Để đặt vé, bạn có thể: \n1. Chọn phim muốn xem\n2. Chọn rạp và suất chiếu\n3. Chọn ghế ngồi\n4. Thanh toán online\nRất đơn giản và nhanh chóng!';
        } else if (lowerMessage.includes('phim') && (lowerMessage.includes('hay') || lowerMessage.includes('hot'))) {
            return 'Hiện tại chúng tôi có nhiều phim hot đang chiếu như phim hành động, tâm lý, kinh dị... Bạn có thể xem danh sách phim ở trang chủ hoặc trang Phim để biết thêm chi tiết!';
        } else if (lowerMessage.includes('rạp') || lowerMessage.includes('cinema')) {
            return 'Chúng tôi có hệ thống rạp trên toàn quốc. Bạn có thể xem danh sách rạp và địa chỉ chi tiết tại trang Rạp Chiếu Phim nhé!';
        } else if (lowerMessage.includes('thanh toán') || lowerMessage.includes('payment')) {
            return 'Chúng tôi hỗ trợ nhiều hình thức thanh toán: Thẻ ATM, Visa/MasterCard, Ví điện tử (Momo, ZaloPay, VNPay). An toàn và bảo mật 100%!';
        } else if (lowerMessage.includes('khuyến mãi') || lowerMessage.includes('giảm giá')) {
            return 'Chúng tôi thường xuyên có các chương trình khuyến mãi hấp dẫn! Bạn hãy theo dõi trang Khuyến Mãi hoặc đăng ký nhận thông báo để không bỏ lỡ nhé!';
        } else if (lowerMessage.includes('giờ chiếu') || lowerMessage.includes('lịch chiếu')) {
            return 'Bạn có thể xem lịch chiếu đầy đủ tại trang Lịch Chiếu. Lịch chiếu được cập nhật liên tục và bạn có thể lọc theo ngày, rạp để dễ dàng tìm kiếm!';
        } else if (lowerMessage.includes('hủy vé') || lowerMessage.includes('hoàn tiền')) {
            return 'Bạn có thể hủy vé trước giờ chiếu 24h để được hoàn tiền. Vui lòng vào phần Lịch sử đặt vé để thực hiện hoặc liên hệ hotline 1900-6420 để được hỗ trợ!';
        } else if (lowerMessage.includes('tài khoản') || lowerMessage.includes('đăng ký') || lowerMessage.includes('đăng nhập')) {
            return 'Bạn có thể đăng ký tài khoản miễn phí để tích điểm và nhận nhiều ưu đãi hấp dẫn! Việc đăng nhập cũng giúp bạn quản lý vé và lịch sử đặt vé dễ dàng hơn.';
        } else if (lowerMessage.includes('hotline') || lowerMessage.includes('liên hệ') || lowerMessage.includes('gọi')) {
            return 'Bạn có thể liên hệ hotline 1900-6420 (8h-22h hàng ngày) hoặc chat với chúng tôi tại đây. Chúng tôi luôn sẵn sàng hỗ trợ bạn!';
        } else if (lowerMessage.includes('cảm ơn') || lowerMessage.includes('thank')) {
            return 'Rất vui được hỗ trợ bạn! Chúc bạn có trải nghiệm xem phim tuyệt vời tại HotCinemas! 🎬🍿';
        } else if (lowerMessage.includes('xin chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return 'Xin chào! Rất vui được hỗ trợ bạn. Bạn cần tôi giúp gì về dịch vụ đặt vé xem phim?';
        } else {
            return 'Tôi hiểu câu hỏi của bạn. Bạn có thể hỏi tôi về:\n- Giá vé và cách đặt vé\n- Phim đang chiếu\n- Lịch chiếu và rạp\n- Thanh toán và khuyến mãi\n- Hoặc liên hệ hotline: 1900-6420';
        }
    };

    const handleSend = () => {
        if (!inputValue.trim()) {
            message.warning('Vui lòng nhập tin nhắn!');
            return;
        }

        // Add user message
        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: inputValue,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI typing and response
        setTimeout(() => {
            const botResponse = {
                id: Date.now() + 1,
                type: 'bot',
                text: generateAIResponse(inputValue),
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1500 + Math.random() * 1000); // Random delay 1.5-2.5s
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = [
        'Giá vé bao nhiêu?',
        'Cách đặt vé?',
        'Phim hot đang chiếu',
        'Lịch chiếu hôm nay'
    ];

    const handleQuickQuestion = (question) => {
        setInputValue(question);
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={380}
            closeIcon={<CloseOutlined />}
            className="chat-modal"
            mask={false}
            maskClosable={false}
            centered={false}
            title={
                <div className="chat-modal-header">
                    <Space>
                        <Avatar
                            size={36}
                            icon={<RobotOutlined />}
                            style={{
                                background: 'linear-gradient(135deg, #1890ff, #722ed1)'
                            }}
                        />
                        <div>
                            <div className="chat-modal-title">Trợ lý AI HotCinemas</div>
                            <div className="chat-modal-status">
                                <span className="status-dot"></span>
                                Đang hoạt động
                            </div>
                        </div>
                    </Space>
                </div>
            }
        >
            <div className="chat-modal-content">
                {/* Quick Questions */}
                {messages.length <= 1 && (
                    <div className="quick-questions">
                        <div className="quick-questions-title">Câu hỏi thường gặp:</div>
                        <div className="quick-questions-list">
                            {quickQuestions.map((question, index) => (
                                <Button
                                    key={index}
                                    size="small"
                                    onClick={() => handleQuickQuestion(question)}
                                    className="quick-question-btn"
                                >
                                    {question}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages */}
                <div className="chat-messages">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`chat-message ${msg.type === 'user' ? 'user-message' : 'bot-message'}`}
                        >
                            <div className="message-avatar">
                                <Avatar
                                    size={32}
                                    icon={msg.type === 'user' ? <UserOutlined /> : <RobotOutlined />}
                                    style={{
                                        background: msg.type === 'user'
                                            ? 'linear-gradient(135deg, #667eea, #764ba2)'
                                            : 'linear-gradient(135deg, #1890ff, #722ed1)'
                                    }}
                                />
                            </div>
                            <div className="message-content">
                                <div className="message-bubble">
                                    <div className="message-text">{msg.text}</div>
                                </div>
                                <div className="message-time">{msg.time}</div>
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="chat-message bot-message">
                            <div className="message-avatar">
                                <Avatar
                                    size={32}
                                    icon={<RobotOutlined />}
                                    style={{
                                        background: 'linear-gradient(135deg, #1890ff, #722ed1)'
                                    }}
                                />
                            </div>
                            <div className="message-content">
                                <div className="message-bubble typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="chat-input-container">
                    <TextArea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Nhập tin nhắn... (Enter để gửi)"
                        autoSize={{ minRows: 1, maxRows: 3 }}
                        className="chat-input"
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSend}
                        className="chat-send-btn"
                        disabled={!inputValue.trim()}
                    >
                        Gửi
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ChatModal;
