import type React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { MessageState } from '../../../types/GameChat';

interface GameChatActionMenuProps {
  showActionMenu: boolean;
  selectedMessage: MessageState | null;
  onCloseActionMenu: () => void;
  onLikeToggle: (message: MessageState) => void;
  onReply: (message: MessageState) => void;
  onWagers: () => void;
  onReport: () => void;
}

const GameChatActionMenu: React.FC<GameChatActionMenuProps> = ({
  showActionMenu,
  selectedMessage,
  onCloseActionMenu,
  onLikeToggle,
  onReply,
  onWagers,
  onReport,
}) => {
  if (!showActionMenu || !selectedMessage) return null;

  return (
    <View style={styles.actionMenuOverlay}>
      <TouchableOpacity
        style={styles.actionMenuBackdrop}
        onPress={onCloseActionMenu}
      />
      <View style={styles.actionMenuContainer}>
        <View style={styles.actionMenu}>
          <TouchableOpacity
            style={styles.actionMenuItem}
            onPress={() => {
              onLikeToggle(selectedMessage);
              onCloseActionMenu();
            }}
          >
            <Text style={styles.actionMenuText}>
              {selectedMessage.isLiked ? 'Unlike' : 'Like'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionMenuItem,
              selectedMessage.parentId && styles.actionMenuItemDisabled,
            ]}
            onPress={() => {
              if (!selectedMessage.parentId) {
                onReply(selectedMessage);
                onCloseActionMenu();
              }
            }}
            disabled={!!selectedMessage.parentId}
          >
            <Text
              style={[
                styles.actionMenuText,
                selectedMessage.parentId && styles.actionMenuTextDisabled,
              ]}
            >
              Reply
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionMenuItem}
            onPress={() => {
              onWagers();
              onCloseActionMenu();
            }}
          >
            <Text style={styles.actionMenuText}>Wager</Text>
          </TouchableOpacity>

          <View style={styles.actionMenuSeparator} />

          <TouchableOpacity
            style={styles.actionMenuItem}
            onPress={() => {
              onReport();
              onCloseActionMenu();
            }}
          >
            <Text style={styles.actionMenuText}>Report</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modalDescription}>
          <Text style={styles.modalDescriptionText}>
            {selectedMessage.text}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  actionMenuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  actionMenuContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  actionMenu: {
    borderWidth: 1,
    borderColor: '#8f8184',
    backgroundColor: '#090F17',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 200,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionMenuItemDisabled: {
    opacity: 0.5,
  },
  actionMenuText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  actionMenuTextDisabled: {
    opacity: 0.5,
  },
  actionMenuSeparator: {
    height: 1,
    backgroundColor: '#8F8184',
    marginHorizontal: 8,
  },
  modalDescription: {
    backgroundColor: '#45435F',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
    shadowColor: '#fff',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalDescriptionText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
  },
});

export default GameChatActionMenu;
