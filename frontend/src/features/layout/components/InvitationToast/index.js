import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import { styles } from './styles';

export default function InvitationToast({ invitation, slideAnim, onAccept, onReject }) {
  const { colors: COLORS } = useTheme();

  if (!invitation) return null;

  return (
    <Animated.View style={[
      styles.toastContainer, 
      { 
        backgroundColor: COLORS.surfaceElevated, 
        borderColor: COLORS.border,
        transform: [{ translateY: slideAnim }] 
      }
    ]}>
      <View>
        <View style={styles.contentContainer}>
          <Icon name="EnvelopeSimpleOpen" size={20} color={COLORS.primary} weight="fill" />
          <Text style={[styles.titleText, { color: COLORS.textPrimary }]}>Yeni Liste Daveti!</Text>
        </View>
        
        <Text style={[styles.descriptionText, { color: COLORS.textSecondary }]}>
          <Text style={[styles.boldText, { color: COLORS.textPrimary }]}>@{invitation.owner_username}</Text> seni "{invitation.name}" listesine davet ediyor.
        </Text>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={onReject} style={styles.rejectButton}>
            <Text style={[styles.rejectButtonText, { color: COLORS.textMuted }]}>Reddet</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onAccept} style={[styles.acceptButton, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.acceptButtonText}>Kabul Et</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}
