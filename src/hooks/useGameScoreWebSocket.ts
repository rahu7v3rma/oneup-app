import { useEffect, useRef, useCallback, useState } from 'react';

import { updateEventScores } from '../reducers/match';
import {
  WebSocketService,
  WebSocketConfig,
  WebSocketCallbacks,
} from '../utils/WebSocketService';

import useAppDispatch from './useAppDispatch';

interface ScoreUpdateData {
  type: 'score_update';
  data: {
    event_id: number;
    scores: {
      home_team_score: number;
      away_team_score: number;
    };
    last_update: string;
  };
  timestamp: string;
}

interface UseGameScoreWebSocketProps {
  eventId: string;
  wsUrl: string | null;
  enabled?: boolean;
}

export const useGameScoreWebSocket = ({
  eventId,
  wsUrl,
  enabled = true,
}: UseGameScoreWebSocketProps) => {
  const dispatch = useAppDispatch();
  const webSocketServiceRef = useRef<WebSocketService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleMessage = useCallback(
    (message: string) => {
      try {
        console.log('the type of eventId is', typeof eventId);
        console.log('Messsage received:', message);
        const data: ScoreUpdateData = JSON.parse(message);
        if (
          data.type === 'score_update' &&
          data.data.event_id.toString() === eventId.toString()
        ) {
          dispatch(
            updateEventScores({
              eventId: data.data.event_id.toString(),
              homeScore: data.data.scores.home_team_score,
              awayScore: data.data.scores.away_team_score,
              lastUpdate: data.data.last_update,
            }),
          );
        }
      } catch (e) {
        console.error('❌ Error processing WebSocket message:', e);
      }
    },
    [eventId, dispatch],
  );

  const handleConnected = useCallback(() => {
    setIsConnected(true);
    setError(null);
  }, []);

  const handleDisconnected = useCallback(() => {
    setIsConnected(false);
  }, []);

  const handleError = useCallback((err: Error) => {
    setError(err);
  }, []);

  useEffect(() => {
    if (enabled && eventId && wsUrl) {
      const config: WebSocketConfig = { url: wsUrl };
      const callbacks: WebSocketCallbacks = {
        onConnected: handleConnected,
        onDisconnected: handleDisconnected,
        onMessage: handleMessage,
        onError: handleError,
      };

      try {
        const service = new WebSocketService(config, callbacks);
        webSocketServiceRef.current = service;

        return () => {
          service.destroy();
          webSocketServiceRef.current = null;
        };
      } catch (err) {
        console.error('Failed to create WebSocket service:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } else {
      // Clean up any existing connection if conditions are no longer met
      if (webSocketServiceRef.current) {
        webSocketServiceRef.current.destroy();
        webSocketServiceRef.current = null;
        setIsConnected(false);
      }
    }
  }, [
    enabled,
    eventId,
    wsUrl,
    handleConnected,
    handleDisconnected,
    handleMessage,
    handleError,
  ]);

  const forceReconnect = useCallback(() => {
    webSocketServiceRef.current?.forceReconnect();
  }, []);

  return {
    isConnected,
    error,
    forceReconnect,
  };
};
