/**
 * WebSocket Service for Real-time Seat Updates
 */

class WebSocketService {
    constructor() {
        this.ws = null;
        this.reconnectTimeout = null;
        this.heartbeatInterval = null;
        this.messageHandlers = new Map();
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    /**
     * Connect to WebSocket server
     */
    connect(showtimeId, onStatusChange) {
        try {
            // Thay đổi URL này theo backend của bạn
            const wsUrl = `ws://localhost:8080/ws/seats/${showtimeId}`;

            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log('WebSocket connected to showtime:', showtimeId);
                this.isConnected = true;
                this.reconnectAttempts = 0;

                if (onStatusChange) {
                    onStatusChange(true);
                }

                this.startHeartbeat();
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.isConnected = false;

                if (onStatusChange) {
                    onStatusChange(false);
                }
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.isConnected = false;
                this.stopHeartbeat();

                if (onStatusChange) {
                    onStatusChange(false);
                }

                // Auto reconnect with exponential backoff
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
                    this.reconnectAttempts++;

                    console.log(`Attempting to reconnect in ${delay}ms... (attempt ${this.reconnectAttempts})`);

                    this.reconnectTimeout = setTimeout(() => {
                        this.connect(showtimeId, onStatusChange);
                    }, delay);
                }
            };

        } catch (error) {
            console.error('Error connecting WebSocket:', error);
        }
    }

    /**
     * Disconnect from WebSocket server
     */
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        this.stopHeartbeat();
        this.isConnected = false;
        this.messageHandlers.clear();
    }

    /**
     * Send message to WebSocket server
     */
    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
            return true;
        } else {
            console.warn('WebSocket is not connected');
            return false;
        }
    }

    /**
     * Register message handler for specific message type
     */
    on(messageType, handler) {
        if (!this.messageHandlers.has(messageType)) {
            this.messageHandlers.set(messageType, []);
        }
        this.messageHandlers.get(messageType).push(handler);
    }

    /**
     * Unregister message handler
     */
    off(messageType, handler) {
        if (this.messageHandlers.has(messageType)) {
            const handlers = this.messageHandlers.get(messageType);
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    /**
     * Handle incoming WebSocket message
     */
    handleMessage(data) {
        console.log('WebSocket message received:', data);

        const handlers = this.messageHandlers.get(data.type);
        if (handlers && handlers.length > 0) {
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error('Error in message handler:', error);
                }
            });
        }
    }

    /**
     * Start heartbeat to keep connection alive
     */
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.send({ type: 'ping' });
            }
        }, 30000); // Ping every 30 seconds
    }

    /**
     * Stop heartbeat
     */
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    /**
     * Send seat reservation request
     */
    reserveSeats(showtimeId, seatIds, userId) {
        return this.send({
            type: 'reserve_seats',
            showtimeId,
            seatIds,
            userId: userId || this.getUserId()
        });
    }

    /**
     * Send seat release request
     */
    releaseSeats(showtimeId, seatIds, userId) {
        return this.send({
            type: 'release_seats',
            showtimeId,
            seatIds,
            userId: userId || this.getUserId()
        });
    }

    /**
     * Get or generate user ID
     */
    getUserId() {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
            localStorage.setItem('userId', userId);
        }
        return userId;
    }

    /**
     * Check if WebSocket is connected
     */
    isConnectedToServer() {
        return this.isConnected && this.ws && this.ws.readyState === WebSocket.OPEN;
    }
}

// Export singleton instance
const websocketService = new WebSocketService();
export default websocketService;
