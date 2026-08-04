import React from 'react';
import { View, Text } from 'react-native';
import Icon from '@/features/icon/components/Icon'; // If they have an Icon wrapper, or we can use phosphor directly
import { CheckCircle, XCircle, Info, Moon, Sun } from 'phosphor-react-native';

const BaseToastUI = ({ text1, text2, icon: IconComponent, colorClass, bgClass, borderClass }) => (
  <View className={`flex-row items-center w-[90%] p-4 rounded-xl shadow-sm border-l-4 ${bgClass} ${borderClass}`}>
    <View className="mr-3">
      {IconComponent}
    </View>
    <View className="flex-1">
      {!!text1 && <Text className="font-bold text-[15px] text-text-lightPrimary dark:text-text-darkPrimary mb-0.5">{text1}</Text>}
      {!!text2 && <Text className="text-[13px] text-text-lightSecondary dark:text-text-darkSecondary">{text2}</Text>}
    </View>
  </View>
);

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <BaseToastUI 
      text1={text1} 
      text2={text2} 
      icon={<CheckCircle size={24} weight="fill" color="#10b981" />} 
      bgClass="bg-light-surfaceElevated dark:bg-dark-surfaceElevated"
      borderClass="border-l-[#10b981]"
    />
  ),
  
  error: ({ text1, text2 }) => (
    <BaseToastUI 
      text1={text1} 
      text2={text2} 
      icon={<XCircle size={24} weight="fill" color="#ef4444" />} 
      bgClass="bg-light-surfaceElevated dark:bg-dark-surfaceElevated"
      borderClass="border-l-[#ef4444]"
    />
  ),
  
  info: ({ text1, text2 }) => (
    <BaseToastUI 
      text1={text1} 
      text2={text2} 
      icon={<Info size={24} weight="fill" color="#3b82f6" />} 
      bgClass="bg-light-surfaceElevated dark:bg-dark-surfaceElevated"
      borderClass="border-l-[#3b82f6]"
    />
  ),

  themeChange: ({ text1, text2, props }) => {
    const isDark = props?.isDark;
    const IconCmp = isDark ? <Moon size={24} weight="fill" color="#8b5cf6" /> : <Sun size={24} weight="fill" color="#f59e0b" />;
    const borderColor = isDark ? 'border-l-[#8b5cf6]' : 'border-l-[#f59e0b]';
    
    return (
      <BaseToastUI 
        text1={text1} 
        text2={text2} 
        icon={IconCmp} 
        bgClass="bg-light-surfaceElevated dark:bg-dark-surfaceElevated"
        borderClass={borderColor}
      />
    );
  }
};
