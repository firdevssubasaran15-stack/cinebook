import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import FeedCommentItem from '@/features/comments/components/FeedCommentItem';
import { styles } from './styles';

export default function HomeFeed({ feedComments, onToggleLike, onToggleDislike }) {
  const { colors: COLORS } = useTheme();

  return (
    <View className={styles.container}>
      <View className={styles.headerContainer}>
        <View className={styles.headerTitleContainer}>
          <Icon name="ChatCircle" size={20} color={COLORS.primary} weight="fill" />
          <Text className={styles.titleText}>Son Yorumlar</Text>
        </View>
      </View>

      {feedComments.length === 0 ? (
        <Text className={styles.emptyText}>Henüz yorum yapılmamış.</Text>
      ) : (
        <View>
          {feedComments.map((comment) => (
            <FeedCommentItem 
              key={comment.id} 
              comment={comment}
              onToggleLike={onToggleLike}
              onToggleDislike={onToggleDislike}
            />
          ))}
        </View>
      )}
    </View>
  );
}
