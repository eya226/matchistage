import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Circle } from 'lucide-react-native';

interface MatchIndicatorProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
}

export default function MatchIndicator({
  percentage,
  size = 60,
  strokeWidth = 4,
  showPercentage = true
}: MatchIndicatorProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const getColor = (percent: number) => {
    if (percent >= 80) return '#10B981'; // Green
    if (percent >= 60) return '#F59E0B'; // Yellow
    if (percent >= 40) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  const color = getColor(percentage);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.circleContainer}>
        {/* Background circle */}
        <View
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: '#E5E7EB',
            }
          ]}
        />
        {/* Progress circle */}
        <View
          style={[
            styles.circle,
            styles.progressCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              transform: [{ rotate: '-90deg' }],
            }
          ]}
        />
      </View>
      {showPercentage && (
        <View style={styles.textContainer}>
          <Text style={[styles.percentage, { color }]}>
            {Math.round(percentage)}%
          </Text>
          <Text style={styles.label}>Match</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    position: 'relative',
  },
  circle: {
    position: 'absolute',
  },
  progressCircle: {
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  label: {
    fontSize: 8,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: -2,
  },
});