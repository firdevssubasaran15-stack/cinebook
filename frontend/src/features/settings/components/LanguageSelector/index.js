import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '@/features/icon/components/Icon';
import { getLanguageSelectorStyles } from './styles';

const LANGUAGES = [
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'tr', flag: '🇹🇷', label: 'Türkçe' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' }
];

export default function LanguageSelector({ currentLanguage, changeLanguage, COLORS, t }) {
  const styles = getLanguageSelectorStyles(COLORS);

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Icon name="Globe" size={22} color={COLORS.textSecondary} />
        <Text style={styles.title}>
          {t('settings.language.title')}
        </Text>
      </View>
      
      <View style={styles.flagsContainer}>
        {LANGUAGES.map((lang) => {
          const isActive = currentLanguage === lang.code;
          return (
             <TouchableOpacity
              key={lang.code}
              style={[styles.flagButton, isActive && styles.flagButtonActive]}
              onPress={() => changeLanguage(lang.code)}
              activeOpacity={0.7}
            >
              <Text style={styles.flagText}>{lang.flag}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
