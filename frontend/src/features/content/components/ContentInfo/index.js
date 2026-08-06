import React from 'react';
import { View, Text } from 'react-native';
import { useLanguage } from '@/hooks/useLanguage';
import { detailStyles as styles } from '@/features/content/styles/detail.styles';
import { useMultiLangSummary } from '@/hooks/useMultiLangSummary';

export default function ContentInfo({ content, authorLabel }) {
  const { t } = useLanguage();
  const { getLocalizedSummary } = useMultiLangSummary();

  const localizedSummary = content?.summary ? getLocalizedSummary(content.summary) : null;

  return (
    <>
      <Text className={styles.titleText}>{content.title}</Text>
      <Text className={styles.authorText}>{authorLabel}: {content.director_author}</Text>
      {localizedSummary ? (
        <View className={styles.summaryContainer}>
          <Text className={styles.summaryTitle}>{t('detail.summary')}</Text>
          <Text className={styles.summaryText}>{localizedSummary}</Text>
        </View>
      ) : null}
    </>
  );
}
