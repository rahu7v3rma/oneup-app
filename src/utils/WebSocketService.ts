import { AppState, AppStateStatus } from 'react-native';

// Default configuration values
const defaultConfig = {
  maxRetries: 5,
  initialBackoffMs: 1000,
  connectionTimeoutMs: 10000,
  heartbeatIntervalMs: 30000,
} as const;

// --- Interfaces and Types ---

// Note: The global WebSocket interface might differ slightly from the standard DOM definition.
// We define our own to match React Native's environment and ensure type safety.
interface CustomWebSocket {
  readyState: number;
  onopen: ((event: Event) => void) | null;
  onclose: ((event: CloseEvent) => void) | null;
  onmessage: ((event: MessageEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  send(data: string | ArrayBuffer | Blob): void;
  close(code?: number, reason?: string): void;
}

interface Event {
  type: string;
}
interface CloseEvent extends Event {
  code: number;
  reason: string;
  wasClean?: boolean;
}
interface MessageEvent extends Event {
  data: string | ArrayBuffer | Blob;
}

// Ready states from the WebSocket spec
const WebSocketReadyState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
} as const;

declare global {
  interface Window {
    WebSocket: new (url: string) => CustomWebSocket;
  }
}

export interface WebSocketConfig {
  url: string;
  maxRetries?: number;
  initialBackoffMs?: number;
  connectionTimeoutMs?: number;
  heartbeatIntervalMs?: number;
}

export interface WebSocketCallbacks {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onMessage?: (message: string) => void;
  onError?: (error: Error) => void;
}

export class WebSocketService {
  private socket: CustomWebSocket | null = null;
  private _isConnected = false;
  private readonly config: Required<WebSocketConfig>;
  private readonly callbacks: WebSocketCallbacks;
  private appState: AppStateStatus = 'active';
  private isManuallyDisconnected = false;
  private connectionTimeout: ReturnType<typeof setTimeout> | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private appStateListener: { remove: () => void } | undefined;
  private retryCount = 0;

  constructor(config: WebSocketConfig, callbacks: WebSocketCallbacks = {}) {
    this.config = { ...defaultConfig, ...config };
    this.callbacks = callbacks;

    if (typeof WebSocket === 'undefined') {
      console.warn('WebSocket is not supported in this environment.');
      this.callbacks.onError?.(new Error('WebSocket not supported'));
      return;
    }

    this.connect();
    this.appStateListener = AppState.addEventListener(
      'change',
      this.handleAppStateChange.bind(this),
    );
  }

  // --- Public API ---

  public connect(): void {
    if (
      this._isConnected ||
      this.socket?.readyState === WebSocketReadyState.CONNECTING
    ) {
      console.log('WebSocket already connected or connecting.');
      return;
    }
    this.isManuallyDisconnected = false;
    this.initializeSocket();
  }

  public disconnect(): void {
    if (!this.socket) return;
    console.log('🔴 Disconnecting WebSocket manually.');
    this.isManuallyDisconnected = true;
    this.cleanup();
  }

  public send(data: Record<string, unknown>): void {
    if (this.socket?.readyState !== WebSocketReadyState.OPEN) {
      const error = new Error('WebSocket is not open. Message not sent.');
      console.warn(error.message);
      this.callbacks.onError?.(error);
      return;
    }
    try {
      this.socket.send(JSON.stringify(data));
    } catch (error) {
      console.error('❌ Failed to send WebSocket message:', error);
      this.callbacks.onError?.(error as Error);
    }
  }

  public forceReconnect(): void {
    console.log('🔄 Force reconnecting WebSocket...');
    this.cleanup();
    // Short delay to allow resources to be fully released before reconnecting
    setTimeout(() => this.connect(), 100);
  }

  public destroy(): void {
    console.log('💥 Destroying WebSocket service instance.');
    this.isManuallyDisconnected = true;
    this.cleanup();
    this.appStateListener?.remove();
  }

  public get isConnected(): boolean {
    return this._isConnected;
  }

  public get url(): string {
    return this.config.url;
  }

  public get readyState(): number | undefined {
    return this.socket?.readyState;
  }

  // --- Private Methods ---

  private initializeSocket(): void {
    if (this.socket) {
      this.cleanup();
    }

    console.log(`🔌 Attempting to connect to: ${this.config.url}`);
    try {
      // @ts-ignore
      this.socket = new WebSocket(this.config.url);
      this.setupSocketEvents();

      this.connectionTimeout = setTimeout(() => {
        this.handleSocketError(new Error('Connection timeout'));
      }, this.config.connectionTimeoutMs);
    } catch (error) {
      this.handleSocketError(error as Error);
    }
  }

  private setupSocketEvents(): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log('🟢 WebSocket connected.');
      this._isConnected = true;
      this.retryCount = 0;
      this.clearConnectionTimeout();
      this.startHeartbeat();
      this.callbacks.onConnected?.();
    };

    this.socket.onmessage = (event: MessageEvent) => {
      if (typeof event.data === 'string') {
        this.callbacks.onMessage?.(event.data);
      }
    };

    this.socket.onclose = (event: CloseEvent) => {
      console.log(
        `🔴 WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`,
      );
      this.cleanup();
    };

    this.socket.onerror = () => {
      this.handleSocketError(new Error('A WebSocket error occurred.'));
    };
  }

  private handleSocketError(error: Error): void {
    if (error.message.includes('instance has been disposed')) return; // Ignore benign errors
    console.error('❌ WebSocket Error:', error.message);
    this.callbacks.onError?.(error);

    if (this.socket && this.socket.readyState !== WebSocketReadyState.CLOSED) {
      this.socket.close();
    }
    this.cleanup();
  }

  private scheduleReconnect(): void {
    if (this.retryCount >= this.config.maxRetries) {
      console.log('❌ Max reconnect attempts reached.');
      this.callbacks.onError?.(new Error('Max reconnect attempts reached'));
      return;
    }

    const delay = this.config.initialBackoffMs * Math.pow(2, this.retryCount);
    this.retryCount++;

    console.log(
      `🔄 Scheduling reconnect in ${delay}ms (attempt ${this.retryCount}/${this.config.maxRetries})`,
    );
    this.reconnectTimeout = setTimeout(() => {
      this.initializeSocket();
    }, delay);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat(); // Ensure no multiple heartbeats
    this.heartbeatInterval = setInterval(() => {
      this.send({ type: 'heartbeat' });
    }, this.config.heartbeatIntervalMs);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleAppStateChange(nextAppState: AppStateStatus): void {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('📱 App has come to the foreground, ensuring connection.');
      this.forceReconnect();
    } else if (nextAppState.match(/inactive|background/)) {
      console.log('📱 App has gone to the background, disconnecting.');
      this.disconnect();
    }
    this.appState = nextAppState;
  }

  private cleanup(): void {
    this.clearConnectionTimeout();
    this.stopHeartbeat();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onerror = null;
      this.socket.onclose = null;
      if (
        this.socket.readyState === WebSocketReadyState.OPEN ||
        this.socket.readyState === WebSocketReadyState.CONNECTING
      ) {
        this.socket.close();
      }
      this.socket = null;
    }

    if (this._isConnected) {
      this._isConnected = false;
      this.callbacks.onDisconnected?.();
    }

    if (!this.isManuallyDisconnected) {
      this.scheduleReconnect();
    }
  }

  private clearConnectionTimeout(): void {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
  }
}
