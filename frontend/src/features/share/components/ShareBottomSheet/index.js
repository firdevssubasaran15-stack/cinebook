import React, { useRef, useEffect } from 'react';
import { View, Text, Modal, Animated, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import SharePreviewCard from '../SharePreviewCard';
import { getShareStrategies } from '../../constants/shareStrategies';
import { styles } from './styles';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * Modern slide-up bottom sheet for sharing.
 */
export default function ShareBottomSheet({ visible, onClose, shareData, onShare }) {
  const { colors: COLORS, isDark } = useTheme();
  const { t } = useLanguage();
  const slideAnim = useRef(new Animated.Value(300)).current; // Start below screen
  const viewShotRef = useRef(null);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade" // Fade the backdrop, slide the sheet
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View 
              style={[
                styles.sheetContainer, 
                { 
                  backgroundColor: COLORS.surfaceElevated,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <View style={[styles.dragHandle, { backgroundColor: COLORS.border }]} />
              
              <Text style={[styles.sheetTitle, { color: COLORS.textPrimary }]}>{t('shareStrategies.share')}</Text>

              {/* Preview Card */}
              <SharePreviewCard ref={viewShotRef} shareData={shareData} />

              {/* Share Options (Strategy Pattern) */}
              <View style={styles.optionsContainer}>
                {getShareStrategies(t).map((strategy) => (
                  <TouchableOpacity 
                    key={strategy.id} 
                    style={styles.optionButton}
                    onPress={() => onShare(strategy, viewShotRef)}
                  >
                    <View style={[styles.iconWrapper, { backgroundColor: isDark ? '#262626' : '#f3f4f6' }]}>
                      <Icon name={strategy.icon} size={28} color={strategy.color} />
                    </View>
                    <Text style={[styles.optionLabel, { color: COLORS.textSecondary }]}>
                      {strategy.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
