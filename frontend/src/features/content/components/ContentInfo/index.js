import React from 'react';
import { View, Text } from 'react-native';
import { useLanguage } from '@/hooks/useLanguage';
import { detailStyles as styles } from '@/features/content/styles/detail.styles';

export default function ContentInfo({ content, authorLabel }) {
  const { t } = useLanguage();

  return (
    <>
      <Text className={styles.titleText}>{content.title}</Text>
      <Text className={styles.authorText}>{authorLabel}: {content.director_author}</Text>
      {content.summary ? (
        <View className={styles.summaryContainer}>
          <Text className={styles.summaryTitle}>{t('detail.summary')}</Text>
          <Text className={styles.summaryText}>{content.summary}</Text>
        </View>
      ) : null}
    </>
  );
}
