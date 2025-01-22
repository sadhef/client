class WebSocketClient {
    constructor(options = {}) {
      this.url = options.url || this.getWebSocketUrl();
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
      this.reconnectInterval = options.reconnectInterval || 5000;
      this.handlers = new Map();
      this.ws = null;
      this.isConnecting = false;
    }
  
    getWebSocketUrl() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const hostname = window.location.hostname;
      const port = process.env.NODE_ENV === 'development' ? ':3000' : '';
      return `${protocol}//${hostname}${port}/ws`;
    }
  
    connect() {
      if (this.isConnecting) return;
      this.isConnecting = true;
  
      try {
        this.ws = new WebSocket(this.url);
        
        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.handlers.get('open')?.forEach(handler => handler());
        };
  
        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.isConnecting = false;
          this.handlers.get('close')?.forEach(handler => handler());
          this.reconnect();
        };
  
        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.handlers.get('error')?.forEach(handler => handler(error));
        };
  
        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handlers.get('message')?.forEach(handler => handler(data));
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
  
      } catch (error) {
        console.error('Error creating WebSocket:', error);
        this.isConnecting = false;
        this.reconnect();
      }
    }
  
    reconnect() {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.log('Max reconnection attempts reached');
        return;
      }
  
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    }
  
    on(event, handler) {
      if (!this.handlers.has(event)) {
        this.handlers.set(event, new Set());
      }
      this.handlers.get(event).add(handler);
    }
  
    off(event, handler) {
      if (this.handlers.has(event)) {
        this.handlers.get(event).delete(handler);
      }
    }
  
    send(data) {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(data));
      } else {
        console.warn('WebSocket is not connected');
      }
    }
  
    close() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
    }
  }
  
  // Create singleton instance
  const wsClient = new WebSocketClient();
  
  export default wsClient;