import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { getSettingsStyles } from '@/features/settings/styles/settings.styles';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSelector from '@/features/settings/components/LanguageSelector';
import Toast from 'react-native-toast-message';
import { notificationsApi } from '@/api/endpoints/notifications.api';

export default function SettingsScreen() {
  const { user, logout, updateUser } = useAuth();
  const { colors: COLORS, toggleTheme, isDark } = useTheme();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  
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
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.contentContainer}>
        {/* Bildirimler */}
        <View style={styles.notificationToggleRow}>
          <View style={styles.settingLabelRow}>
            <Icon name="Bell" size={22} color={COLORS.textSecondary} />
            <Text style={styles.settingLabel}>
              {t('settings.notificationsTitle')}
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
            <Text style={styles.intervalTitle}>{t('settings.notificationInterval')}</Text>
            <View style={styles.intervalOptionsRow}>
              {[
                { label: t('settings.hour'), value: 'hourly' },
                { label: t('settings.day'), value: 'daily' },
                { label: t('settings.week'), value: 'weekly' },
                { label: t('settings.month'), value: 'monthly' }
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
            
            <TouchableOpacity
              style={[styles.actionRow, { marginTop: 24 }]}
              onPress={() => {
                notificationsApi.testPush();
                Toast.show({
                  type: 'info',
                  text1: 'Test',
                  text2: 'Bildirim 5 saniye içinde gelecek.',
                });
              }}
            >
              <Icon name="PaperPlaneTilt" size={22} color={COLORS.primary} />
              <Text style={[styles.actionText, { color: COLORS.primary }]}>
                Bildirim Testi Gönder
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tema Değiştir */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={toggleTheme}
        >
          <Icon name={isDark ? "Sun" : "Moon"} size={22} color={COLORS.textSecondary} />
          <Text style={styles.actionText}>
            {isDark ? t('settings.lightTheme') : t('settings.darkTheme')}
          </Text>
        </TouchableOpacity>

        {/* Dil Değiştir (Language Selector) */}
        <LanguageSelector 
          currentLanguage={currentLanguage}
          changeLanguage={changeLanguage}
          COLORS={COLORS}
          t={t}
        />

        {/* Çıkış Yap */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={handleLogout}
        >
          <Icon name="SignOut" size={22} color={COLORS.error} />
          <Text style={styles.logoutText}>{t('settings.logout')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
