import React from 'react';
import { Stack } from 'expo-router';
import SkeletonExample from '@/components/SkeletonExample';

export default function SkeletonExampleScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Skeleton UI Examples',
        headerShown: true,
      }} />
      <SkeletonExample />
    </>
  );
} 