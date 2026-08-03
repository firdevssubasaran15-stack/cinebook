import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { API_BASE_URL } from '@/constants/api';

export default function FeedCommentUserHeader({ comment, onPressUser }) {
  return (
    <TouchableOpacity className="flex-row items-center mb-3" onPress={onPressUser}>
      {comment.profile_image ? (
        <Image 
          source={{ uri: `${API_BASE_URL}${comment.profile_image}` }} 
          className="w-9 h-9 rounded-full mr-2.5"
          contentFit="cover" 
        />
      ) : (
        <View className="w-9 h-9 rounded-full mr-2.5 bg-brand-primary justify-center items-center">
          <Text className="text-white font-bold text-sm">
            {comment.username ? comment.username[0].toUpperCase() : 'U'}
          </Text>
        </View>
      )}
      <View className="flex-1">
        <Text className="text-[15px] font-bold text-text-lightPrimary dark:text-text-darkPrimary" numberOfLines={1}>
          {comment.username}
        </Text>
        <Text className="text-xs mt-0.5 text-text-lightMuted dark:text-text-darkMuted">
          {new Date(comment.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
