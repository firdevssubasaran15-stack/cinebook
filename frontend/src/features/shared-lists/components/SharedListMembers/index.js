import React from 'react';
import { View, Text, ScrollView, Image as RNImage } from 'react-native';
import { API_BASE_URL } from '@/constants/api';
import { useLanguage } from '@/hooks/useLanguage';
import { sharedListDetailStyles as styles } from '@/features/shared-lists/styles/sharedListDetail.styles';

export default function SharedListMembers({ members }) {
  const { t } = useLanguage();

  return (
    <>
      <Text className={styles.sectionTitle}>{t('sharedList.members')} ({members?.length || 0})</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className={styles.membersScroll}>
        {members?.map(m => (
          <View key={m.id} className={styles.memberItem}>
            <View className={styles.memberAvatarContainer}>
              {m.profile_image ? (
                <RNImage source={{ uri: `${API_BASE_URL}${m.profile_image}` }} className={styles.memberAvatarImage} />
              ) : (
                <Text className={styles.memberAvatarFallback}>{m.username[0].toUpperCase()}</Text>
              )}
            </View>
            <Text className={styles.memberUsername} numberOfLines={1}>@{m.username}</Text>
            <Text className={`${styles.memberRoleBase} ${m.status === 'owner' ? styles.memberRoleOwner : styles.memberRoleOther}`}>
              {m.status === 'owner' ? t('sharedList.founder') : m.status === 'pending' ? t('sharedList.pending') : t('sharedList.member')}
            </Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
}
