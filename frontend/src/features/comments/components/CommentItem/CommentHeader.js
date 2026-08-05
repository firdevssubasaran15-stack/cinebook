import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { API_BASE_URL } from '@/constants/api';

import { useLanguage } from '@/hooks/useLanguage';

export default function CommentHeader({ comment }) {
  const { language } = useLanguage();
  const date = new Date(comment.created_at).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US');

  return (
    <>
      <TouchableOpacity 
        className="w-9 h-9 rounded-full bg-light-border dark:bg-dark-border justify-center items-center mr-3 overflow-hidden" 
        onPress={() => comment.user_id && router.push(`/user/${comment.user_id}`)}
      >
        {comment.profile_image ? (
          <Image 
            source={{ uri: `${API_BASE_URL}${comment.profile_image}` }} 
            style={{ width: '100%', height: '100%', borderRadius: 18 }} 
            contentFit="cover" 
          />
        ) : (
          <Text className="text-text-lightPrimary dark:text-text-darkPrimary text-[15px] font-bold">
            {comment.username?.[0]?.toUpperCase() || '?'}
          </Text>
        )}
      </TouchableOpacity>
      <View className="flex-1 justify-center">
        <TouchableOpacity onPress={() => comment.user_id && router.push(`/user/${comment.user_id}`)}>
          <Text className="font-bold text-[15px] text-text-lightPrimary dark:text-text-darkPrimary mb-0.5">
            {comment.username}
          </Text>
        </TouchableOpacity>
        <Text className="text-xs text-text-lightSecondary dark:text-text-darkSecondary">{date}</Text>
      </View>
    </>
  );
}
