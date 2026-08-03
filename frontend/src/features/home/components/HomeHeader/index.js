import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { GRADIENTS } from '@/constants/colors';
import { API_BASE_URL } from '@/constants/api';
import Icon from '@/features/icon/components/Icon';

export default function HomeHeader({ unreadCount }) {
  const { colors: COLORS, isDark } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient 
      colors={isDark ? GRADIENTS.hero : [COLORS.background, COLORS.surfaceElevated]} 
      className="px-6 pb-6"
      style={{ paddingTop: Math.max(insets.top + 16, 16) }}
    >
      <View className="flex-row justify-between items-center mb-5">
        <View className="flex-1 pr-2">
          <Text className="text-[22px] font-extrabold text-text-lightPrimary dark:text-text-darkPrimary" numberOfLines={1}>
            Merhaba, {user?.username} 👋
          </Text>
          <Text className="text-[13px] mt-1 text-text-lightMuted dark:text-text-darkMuted">
            Bugün ne keşfetmek istersin?
          </Text>
        </View>
        
        <View className="flex-row items-center gap-1.5">
          <TouchableOpacity onPress={() => router.push('/(tabs)/notifications')} className="bg-transparent py-1.5 px-1.5 relative">
            <Icon name="Bell" size={24} color={isDark ? '#FFF' : COLORS.primary} weight="fill" />
            {unreadCount > 0 && (
              <View style={{
                position: 'absolute',
                top: 4,
                right: 6,
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: '#FF3B30',
                borderWidth: 1.5,
                borderColor: isDark ? '#1A0A3A' : '#FFF'
              }} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push(`/user/${user?.id}`)} className="bg-transparent py-1.5 px-1.5">
            {user?.profile_image ? (
              <Image 
                source={{ uri: `${API_BASE_URL}${user.profile_image}` }} 
                style={{ width: 26, height: 26, borderRadius: 13 }} 
                contentFit="cover" 
              />
            ) : (
              <View style={{ 
                width: 26, height: 26, borderRadius: 13, 
                backgroundColor: isDark ? '#FFF' : COLORS.primary, 
                justifyContent: 'center', alignItems: 'center' 
              }}>
                <Text style={{ color: isDark ? COLORS.primary : '#FFF', fontWeight: 'bold', fontSize: 14 }}>
                  {user?.username ? user.username[0].toUpperCase() : 'U'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push('/settings')} className="bg-transparent py-1.5 px-1.5">
            <Icon name="Gear" size={24} color={isDark ? '#FFF' : COLORS.primary} weight="fill" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}
