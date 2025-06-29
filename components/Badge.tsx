import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Award, Star, Target, TrendingUp, Users, Zap } from 'lucide-react-native';

interface BadgeProps {
  type: 'achievement' | 'skill' | 'milestone' | 'social' | 'performance' | 'special';
  title: string;
  description?: string;
  earned?: boolean;
  size?: 'small' | 'medium' | 'large';
  showTitle?: boolean;
}

const badgeIcons = {
  achievement: Award,
  skill: Target,
  milestone: TrendingUp,
  social: Users,
  performance: Star,
  special: Zap,
};

const badgeColors = {
  achievement: '#F59E0B',
  skill: '#2563EB',
  milestone: '#10B981',
  social: '#8B5CF6',
  performance: '#EF4444',
  special: '#06B6D4',
};

export default function Badge({
  type,
  title,
  description,
  earned = true,
  size = 'medium',
  showTitle = true
}: BadgeProps) {
  const IconComponent = badgeIcons[type];
  const color = badgeColors[type];
  
  const sizeStyles = {
    small: { width: 32, height: 32, iconSize: 16 },
    medium: { width: 48, height: 48, iconSize: 24 },
    large: { width: 64, height: 64, iconSize: 32 },
  };

  const currentSize = sizeStyles[size];

  return (
    <View style={styles.container}>
      <View style={[
        styles.badge,
        {
          width: currentSize.width,
          height: currentSize.height,
          backgroundColor: earned ? `${color}15` : '#F3F4F6',
          borderColor: earned ? color : '#D1D5DB',
        }
      ]}>
        <IconComponent 
          size={currentSize.iconSize} 
          color={earned ? color : '#9CA3AF'} 
          fill={earned ? color : 'transparent'}
        />
      </View>
      {showTitle && (
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: earned ? '#111827' : '#9CA3AF' }]}>
            {title}
          </Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    maxWidth: 80,
  },
  badge: {
    borderRadius: 50,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginBottom: 2,
  },
  description: {
    fontSize: 8,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
});