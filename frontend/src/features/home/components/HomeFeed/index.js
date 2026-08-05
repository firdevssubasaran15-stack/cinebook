import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/features/icon/components/Icon';
import FeedCommentItem from '@/features/comments/components/FeedCommentItem';
import { useShareManager } from '../../../share/hooks/useShareManager';
import ShareBottomSheet from '../../../share/components/ShareBottomSheet';
import { styles } from './styles';

export default function HomeFeed({ feedComments, onToggleLike, onToggleDislike }) {
  const { colors: COLORS } = useTheme();
  const { 
    isShareModalVisible, 
    shareData, 
    openShareSheet, 
    closeShareSheet, 
    handleShareAction 
  } = useShareManager();

  return (
    <>
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
              onShare={() => openShareSheet(comment)}
            />
          ))}
        </View>
      )}
      </View>
    <ShareBottomSheet 
      visible={isShareModalVisible} 
      onClose={closeShareSheet} 
      shareData={shareData} 
      onShare={handleShareAction} 
    />
    </>
  );
}
