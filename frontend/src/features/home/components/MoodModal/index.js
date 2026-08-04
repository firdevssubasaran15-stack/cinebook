import React, { useMemo } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import { EMOTION_TAGS } from '@/constants/emotions';
import { styles } from './styles';

const TAILWIND_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
  '#f87171', '#fb923c', '#fbbf24', '#facc15', '#a3e635', '#4ade80', '#34d399', '#2dd4bf', '#22d3ee', '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#fb7185'
];

export default function MoodModal({
  visible,
  onClose,
  moodRecommendations,
  moodLoading,
  doNotShowToday,
  onToggleDoNotShowToday,
  onMoodSelect,
  onClearRecommendations
}) {
  const { colors: COLORS } = useTheme();

  const randomizedEmotions = useMemo(() => {
    const shuffledColors = [...TAILWIND_COLORS].sort(() => 0.5 - Math.random());
    return EMOTION_TAGS.map((tag, index) => ({
      ...tag,
      randomColor: shuffledColors[index % shuffledColors.length]
    }));
  }, []);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className={styles.overlay}>
        <View className={styles.modalContainer}>
          <View className={styles.header}>
            <Text className={styles.title}>Bugün nasıl hissetmek istersiniz?</Text>
            <TouchableOpacity onPress={onClose} className={styles.closeButton}>
              <Icon name="X" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {!moodRecommendations ? (
            <View className={styles.tagsContainer}>
              {randomizedEmotions.map(tag => {
                const tagColor = tag.randomColor;
                return (
                  <TouchableOpacity
                    key={tag.id}
                    onPress={() => onMoodSelect(tag.id)}
                    style={{ borderColor: `${tagColor}50`, backgroundColor: `${tagColor}15` }}
                    className={styles.tagButton}
                  >
                    <Icon name={tag.iconName} size={18} color={tagColor} />
                    <Text style={{ color: tagColor }} className={styles.tagText}>{tag.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <ScrollView>
              {moodLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} className={styles.loadingIndicator} />
              ) : (
                <View>
                  <Text className={styles.recommendationsTitle}>Sizin için seçtiklerimiz:</Text>
                  {['movie', 'series', 'book'].map(type => {
                    const item = moodRecommendations[type];
                    if (!item) return null;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        className={styles.recommendationCard}
                        onPress={() => {
                          onClose();
                          router.push(`/detail/${item.id}`);
                        }}
                      >
                        <View className={styles.iconContainer}>
                          <Icon name={type === 'movie' ? 'FilmStrip' : type === 'series' ? 'Television' : 'Books'} size={24} color={COLORS.textMuted} weight="light" />
                        </View>
                        <View className={styles.recommendationContent}>
                          <Text className={styles.recommendationTitle} numberOfLines={1}>{item.title}</Text>
                          <Text className={styles.recommendationAuthor} numberOfLines={1}>{item.director_author}</Text>
                          <View className={styles.typeBadgeContainer} style={{ backgroundColor: `${COLORS.primary}20` }}>
                            <Text className={styles.typeBadgeText}>{type === 'movie' ? 'Film' : type === 'series' ? 'Dizi' : 'Kitap'}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                  {!moodRecommendations.movie && !moodRecommendations.series && !moodRecommendations.book && (
                    <Text className={styles.emptyText}>Bu duyguya ait henüz bir öneri bulunamadı.</Text>
                  )}
                  <TouchableOpacity
                    onPress={onClearRecommendations}
                    className={styles.backButton}
                  >
                    <Text className={styles.backButtonText}>Geri Dön</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}

          <TouchableOpacity 
            className={styles.doNotShowContainer} 
            onPress={onToggleDoNotShowToday}
          >
            <Icon name={doNotShowToday ? 'CheckSquare' : 'Square'} size={20} color={doNotShowToday ? COLORS.primary : COLORS.textMuted} />
            <Text className={styles.doNotShowText}>Bugün tekrar gösterme</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
