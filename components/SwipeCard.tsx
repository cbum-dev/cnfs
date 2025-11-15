import { useMemo } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

import type { Item } from '@/types';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

const AnimatedView = Animated.createAnimatedComponent(View);

interface Props {
  item: Item;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
}

export function SwipeCard({ item, onSwipeRight, onSwipeLeft }: Props) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const rotateZ = useMemo(() => translateX.value / 20, [translateX.value]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx: any) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(width * 1.2, {}, () => {
          runOnJS(onSwipeRight)();
        });
        return;
      }
      if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-width * 1.2, {}, () => {
          runOnJS(onSwipeLeft)();
        });
        return;
      }
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotateZ: `${translateX.value / 20}deg` },
    ],
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <AnimatedView className="absolute w-full" style={cardStyle}>
        <View className="bg-white rounded-3xl overflow-hidden shadow-xl">
          <Image
            source={{ uri: item.photos[0] }}
            className="w-full h-96"
            contentFit="cover"
          />
          <View className="p-4">
            <Text className="text-xl font-bold text-gray-900 mb-1">{item.title}</Text>
            {item.brand ? (
              <Text className="text-gray-600 mb-1">{item.brand}</Text>
            ) : null}
            <Text className="text-gray-600 mb-1">Size: {item.size ?? 'N/A'}</Text>
            {item.price != null ? (
              <Text className="text-gray-900 font-semibold mb-1">${item.price}</Text>
            ) : (
              <Text className="text-green-600 font-semibold mb-1">Swap only</Text>
            )}
            <Text className="text-gray-500" numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </View>
      </AnimatedView>
    </PanGestureHandler>
  );
}
