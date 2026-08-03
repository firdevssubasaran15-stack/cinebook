import React from 'react';
import { View, Text } from 'react-native';
import Icon from '@/features/icon/components/Icon';
import { useTheme } from '@/context/ThemeContext';

export const passwordRules = [
  {
    id: 'length',
    label: '8-12 karakter arası',
    test: (pw) => pw.length >= 8 && pw.length <= 12,
  },
  {
    id: 'uppercase',
    label: 'En az 1 büyük harf',
    test: (pw) => /[A-Z]/.test(pw),
  },
  {
    id: 'lowercase',
    label: 'En az 1 küçük harf',
    test: (pw) => /[a-z]/.test(pw),
  },
  {
    id: 'number',
    label: 'En az 1 rakam',
    test: (pw) => /[0-9]/.test(pw),
  },
  {
    id: 'special',
    label: 'En az 1 özel karakter (<>|! vs.)',
    test: (pw) => /[<>|!@#$%^&*()_+\-=\[\]{};':"\\,./?~`]/.test(pw),
  },
];

export const isPasswordValid = (password) => {
  return passwordRules.every(rule => rule.test(password));
};

export default function PasswordValidator({ password }) {
  const { colors: COLORS } = useTheme();

  if (password.length === 0) return null;

  return (
    <View className="mt-2 p-3 bg-light-surfaceElevated dark:bg-dark-surfaceElevated rounded-xl border border-light-border dark:border-dark-border">
      <Text className="text-[13px] font-bold mb-2 text-text-lightSecondary dark:text-text-darkSecondary uppercase tracking-wider">
        Şifre Kuralları
      </Text>
      {passwordRules.map((rule) => {
        const isValid = rule.test(password);
        return (
          <View key={rule.id} className="flex-row items-center mb-1.5">
            <View className="w-5 items-center justify-center mr-2">
              {isValid ? (
                <Icon name="CheckCircle" size={16} color={COLORS.success || '#4ade80'} weight="fill" />
              ) : (
                <Icon name="XCircle" size={16} color={COLORS.textMuted} weight="bold" />
              )}
            </View>
            <Text className={`text-[13px] ${isValid ? 'text-status-success' : 'text-text-lightMuted dark:text-text-darkMuted'}`}>
              {rule.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
