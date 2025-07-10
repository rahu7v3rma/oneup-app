import { BlurView } from '@react-native-community/blur';
import type React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MessageState } from '../../../types/GameChat';

interface GameChatActionMenuProps {
  showActionMenu: boolean;
  selectedMessage: MessageState | null;
  onCloseActionMenu: () => void;
  onLikeToggle: (message: MessageState) => void;
  onReply: (message: MessageState) => void;
  onWagers: () => void;
  onReport: () => void;
  menuPosition?: { x: number; y: number };
  chatViewLayout?: { x: number; y: number; width: number; height: number };
}

const GameChatActionMenu: React.FC<GameChatActionMenuProps> = ({
  showActionMenu,
  selectedMessage,
  onCloseActionMenu,
  onLikeToggle,
  onReply,
  onWagers,
  onReport,
  menuPosition,
  chatViewLayout,
}) => {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  if (!showActionMenu || !selectedMessage) return null;

  const MENU_WIDTH = 200;
  const MENU_HEIGHT = 250;
  const MARGIN = 20; // Margin from edges

  // Calculate safe area bounds with better bottom margin for keyboard/input area
  let safeLeft, safeRight, safeTop, safeBottom;
  const BOTTOM_MARGIN = 120; // Extra margin for keyboard and input area

  if (chatViewLayout) {
    safeLeft = chatViewLayout.x + MARGIN;
    safeRight = chatViewLayout.x + chatViewLayout.width - MARGIN;
    safeTop = chatViewLayout.y + MARGIN;
    safeBottom =
      chatViewLayout.y + chatViewLayout.height - MARGIN - BOTTOM_MARGIN;
  } else {
    safeLeft = insets.left + MARGIN;
    safeRight = screenWidth - insets.right - MARGIN;
    safeTop = insets.top + MARGIN;
    safeBottom = screenHeight - insets.bottom - MARGIN - BOTTOM_MARGIN;
  }

  // Calculate menu position while keeping it within safe bounds
  let menuX = menuPosition?.x ?? safeLeft;
  let menuY = menuPosition?.y ?? safeTop;

  // Adjust X position to keep menu within horizontal bounds
  if (menuX + MENU_WIDTH > safeRight) {
    menuX = safeRight - MENU_WIDTH;
  }
  if (menuX < safeLeft) {
    menuX = safeLeft;
  }

  // Adjust Y position to keep menu within vertical bounds
  if (menuY + MENU_HEIGHT > safeBottom) {
    // Try to show above the tap if not enough space below
    const aboveY = (menuPosition?.y ?? safeTop) - MENU_HEIGHT - 12;
    if (aboveY > safeTop) {
      menuY = aboveY;
    } else {
      // If not enough space above either, position it at the top with some margin
      menuY = safeTop + 10;
    }
  }
  if (menuY < safeTop) {
    menuY = safeTop + 10;
  }

  return (
    <View style={styles.actionMenuOverlay}>
      <BlurView
        style={styles.actionMenuBackdrop}
        blurType={Platform.OS === 'ios' ? 'dark' : 'dark'}
        blurAmount={10}
        reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.8)"
      />
      <TouchableOpacity
        style={styles.actionMenuBackdrop}
        onPress={onCloseActionMenu}
        activeOpacity={1}
      />
      <View
        style={[
          styles.actionMenuContainer,
          styles.actionMenuPositioned,
          {
            top: menuY,
            left: menuX,
          },
        ]}
      >
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
          <Text style={styles.modalDescriptionText} numberOfLines={2}>
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
    zIndex: 1000,
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
    width: 200, // Match MENU_WIDTH constant
  },
  actionMenu: {
    borderWidth: 1,
    borderColor: '#8f8184',
    backgroundColor: '#090F17',
    borderRadius: 12,
    paddingVertical: 8,
    width: '100%',
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
    width: '100%',
    marginTop: 8,
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
  actionMenuPositioned: {
    position: 'absolute',
  },
});

export default GameChatActionMenu;
