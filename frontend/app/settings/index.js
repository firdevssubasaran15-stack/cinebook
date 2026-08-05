import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { getSettingsStyles } from '@/features/settings/styles/settings.styles';

export default function SettingsScreen() {
  const { user, logout, updateUser } = useAuth();
  const { colors: COLORS, toggleTheme, isDark } = useTheme();
  
  const {
    handleToggleNotifications,
    handleChangeInterval,
    handleLogout
  } = useSettings(user, logout, updateUser);

  const styles = getSettingsStyles(COLORS, user);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="ArrowLeft" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.contentContainer}>
        {/* Bildirimler */}
        <View style={styles.notificationToggleRow}>
          <View style={styles.settingLabelRow}>
            <Icon name="Bell" size={22} color={COLORS.textSecondary} />
            <Text style={styles.settingLabel}>
              Bildirimler
            </Text>
          </View>
          <Switch
            value={user?.notifications_enabled !== 0}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={'#fff'}
          />
        </View>

        {user?.notifications_enabled !== 0 && (
          <View style={styles.intervalSection}>
            <Text style={styles.intervalTitle}>Bildirim Alma Aralığı</Text>
            <View style={styles.intervalOptionsRow}>
              {[
                { label: 'Saat', value: 'hourly' },
                { label: 'Gün', value: 'daily' },
                { label: 'Hafta', value: 'weekly' },
                { label: 'Ay', value: 'monthly' }
              ].map((opt) => {
                const isSelected = (user?.notification_interval || 'hourly') === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={styles.intervalOption(isSelected)}
                    onPress={() => handleChangeInterval(opt.value)}
                  >
                    <Text style={styles.intervalOptionText(isSelected)}>{opt.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Tema Değiştir */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={toggleTheme}
        >
          <Icon name={isDark ? "Sun" : "Moon"} size={22} color={COLORS.textSecondary} />
          <Text style={styles.actionText}>
            {isDark ? "Açık Temaya Geç" : "Koyu Temaya Geç"}
          </Text>
        </TouchableOpacity>

        {/* Çıkış Yap */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={handleLogout}
        >
          <Icon name="SignOut" size={22} color={COLORS.error} />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
