import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useInvitations } from '@/features/layout/hooks/useInvitations';
import TabIcon from '@/features/layout/components/TabIcon';
import InvitationToast from '@/features/layout/components/InvitationToast';
import { layoutStyles as styles } from '@/features/layout/styles/layout.styles';
import { useLanguage } from '@/hooks/useLanguage';

export default function TabsLayout() {
  const { user, isAdmin, privileges } = useAuth();
  const { colors: COLORS } = useTheme();
  const { t } = useLanguage();

  const {
    invitation,
    slideAnim,
    handleAccept,
    handleReject
  } = useInvitations(user);

  return (
    <View style={styles.mainContainer}>
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
            title: t('tabs.home'),
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon name="House" focused={focused} colors={COLORS} />,
          }}
        />
        <Tabs.Screen
          name="movies"
          options={{
            title: t('tabs.movies'),
            tabBarIcon: ({ focused }) => <TabIcon name="FilmStrip" focused={focused} colors={COLORS} />,
          }}
        />
        <Tabs.Screen
          name="series"
          options={{
            title: t('tabs.series'),
            tabBarIcon: ({ focused }) => <TabIcon name="Television" focused={focused} colors={COLORS} />,
          }}
        />
        <Tabs.Screen
          name="books"
          options={{
            title: t('tabs.books'),
            tabBarIcon: ({ focused }) => <TabIcon name="Books" focused={focused} colors={COLORS} />,
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: t('tabs.library'),
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon name="BookmarkSimple" focused={focused} colors={COLORS} />,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            href: null,
            title: t('tabs.notifications'),
          }}
        />
        {(isAdmin || privileges?.can_view_admin_panel === 1) ? (
          <Tabs.Screen
            name="admin-dashboard"
            options={{
              title: t('tabs.admin'),
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
