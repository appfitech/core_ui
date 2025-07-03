import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  themeColors?: {
    background: string;
    text: string;
    border: string;
    icon: string;
  };
};

export const Accordion = ({ title, children, themeColors }: AccordionProps) => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  useEffect(() => {
    Animated.timing(animation, {
      toValue: expanded ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.ease,
    }).start();
  }, [expanded]);

  const maxHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1000],
  });

  return (
    <View style={[styles.container, { borderColor: themeColors?.border }]}>
      <TouchableOpacity
        onPress={toggleExpand}
        style={[styles.header, { backgroundColor: themeColors?.background }]}
      >
        <Text style={[styles.title, { color: themeColors?.text }]}>
          {title}
        </Text>
        <Feather
          color={themeColors?.icon}
          size={18}
          name={expanded ? 'chevrons-up' : 'chevrons-down'}
        />
      </TouchableOpacity>

      <Animated.View style={{ overflow: 'hidden', maxHeight }}>
        <View
          style={[styles.content, { backgroundColor: themeColors?.background }]}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    // borderWidth: 1,
    // borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    // padding: 16,
  },
});
