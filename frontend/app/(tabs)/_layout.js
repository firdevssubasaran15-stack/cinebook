import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useInvitations } from '@/features/layout/hooks/useInvitations';
import TabIcon from '@/features/layout/components/TabIcon';
import InvitationToast from '@/features/layout/components/InvitationToast';

export default function TabsLayout() {
  const { user, isAdmin, privileges } = useAuth();
  const { colors: COLORS } = useTheme();

  const {
    invitation,
    slideAnim,
    handleAccept,
    handleReject
  } = useInvitations(user);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: COLORS.surface,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.textPrimary,
          headerTitleStyle: { fontWeight: '700' }
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Ana Sayfa',
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon name="House" focused={focused} colors={COLORS} />,
          }}
        />
        <Tabs.Screen
          name="movies"
          options={{
            title: 'Filmler',
            tabBarIcon: ({ focused }) => <TabIcon name="FilmStrip" focused={focused} colors={COLORS} />,
          }}
        />
        <Tabs.Screen
          name="series"
          options={{
            title: 'Diziler',
            tabBarIcon: ({ focused }) => <TabIcon name="Television" focused={focused} colors={COLORS} />,
          }}
        />
        <Tabs.Screen
          name="books"
          options={{
            title: 'Kitaplar',
            tabBarIcon: ({ focused }) => <TabIcon name="Books" focused={focused} colors={COLORS} />,
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Kitaplık',
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon name="BookmarkSimple" focused={focused} colors={COLORS} />,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            href: null,
            title: 'Bildirimler',
          }}
        />
        {(isAdmin || privileges?.can_view_admin_panel === 1) ? (
          <Tabs.Screen
            name="admin-dashboard"
            options={{
              title: 'Admin',
              headerShown: false,
              tabBarIcon: ({ focused }) => <TabIcon name="Gear" focused={focused} colors={COLORS} />,
            }}
          />
        ) : (
          <Tabs.Screen
            name="admin-dashboard"
            options={{ href: null }}
          />
        )}
      </Tabs>

      <InvitationToast 
        invitation={invitation}
        slideAnim={slideAnim}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </View>
  );
}
