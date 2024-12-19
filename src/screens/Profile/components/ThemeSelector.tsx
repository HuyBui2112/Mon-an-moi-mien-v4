import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { Typography } from '../../../components/shared';
import { useTheme } from '../../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';

export const ThemeSelector = () => {
  const {
    currentTheme,
    setTheme,
    availableThemes,
    defaultLightTheme,
    defaultDarkTheme,
  } = useTheme();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const contentHeight = useRef(0);

  if (!user) return null;

  const toggleExpand = () => {
    setExpanded(!expanded);
    Animated.timing(animatedHeight, {
      toValue: expanded ? 0 : contentHeight.current,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.cubic),
    }).start();
  };

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    contentHeight.current = height;
    if (expanded) {
      animatedHeight.setValue(height);
    }
  };

  const lightThemes = availableThemes.filter(t => !t.id.includes('dark') && !t.id.includes('-special'));
  const darkThemes = availableThemes.filter(t => t.id.includes('dark') && !t.id.includes('-special'));
  const specialThemes = availableThemes.filter(t => t.id.includes('-special'));

  const renderThemeButton = (theme: any, isDefaultTheme: boolean) => (
    <TouchableOpacity
      key={theme.id}
      style={[
        styles.themeButton,
        {
          backgroundColor: theme.colors.background.default,
          borderColor: theme.colors.border,
          borderWidth: 1,
        },
      ]}
      onPress={() => setTheme(theme.id)}
    >
      <View
        style={[
          styles.colorPreview,
          { backgroundColor: theme.colors.primary.main },
        ]}
      />
      <Typography
        variant="caption"
        style={[
          styles.themeName,
          { color: theme.colors.text.primary },
        ]}
      >
        {theme.name}
      </Typography>
      {isDefaultTheme && (
        <View
          style={[
            styles.defaultDot,
            { backgroundColor: theme.colors.primary.main },
          ]}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { borderRadius: 16, overflow: 'hidden' }]}>
      <TouchableOpacity
        style={[
          styles.header,
          {
            backgroundColor: currentTheme.colors.background.paper,
          },
        ]}
        onPress={toggleExpand}
      >
        <View style={styles.headerContent}>
          <Ionicons
            name="color-palette-outline"
            size={20}
            color={currentTheme.colors.primary.main}
            style={{ marginRight: 8 }}
          />
          <Typography
            variant="h3"
            style={{
              color: currentTheme.colors.text.primary,
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            Tùy chỉnh giao diện
          </Typography>
        </View>
        <Ionicons
          name={expanded ? 'chevron-down' : 'chevron-up'}
          size={20}
          color={currentTheme.colors.text.secondary}
        />
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.animatedContent,
          {
            height: animatedHeight,
            backgroundColor: currentTheme.colors.background.paper,
            opacity: animatedHeight.interpolate({
              inputRange: [0, contentHeight.current],
              outputRange: [0, 1],
            }),
          },
        ]}
      >
        <View style={styles.content} onLayout={onLayout}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="sunny-outline"
                size={18}
                color={currentTheme.colors.text.primary}
                style={{ marginRight: 6 }}
              />
              <Typography
                variant="subtitle1"
                style={[
                  styles.sectionTitle,
                  { color: currentTheme.colors.text.primary },
                ]}
              >
                Chế độ sáng
              </Typography>
            </View>
            <View style={styles.themeGrid}>
              {lightThemes.map((theme) =>
                renderThemeButton(theme, theme.id === defaultLightTheme)
              )}
            </View>
          </View>

          <View style={[styles.section]}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="moon-outline"
                size={18}
                color={currentTheme.colors.text.primary}
                style={{ marginRight: 6 }}
              />
              <Typography
                variant="subtitle1"
                style={[
                  styles.sectionTitle,
                  { color: currentTheme.colors.text.primary },
                ]}
              >
                Chế độ tối
              </Typography>
            </View>
            <View style={styles.themeGrid}>
              {darkThemes.map((theme) =>
                renderThemeButton(theme, theme.id === defaultDarkTheme)
              )}
            </View>
          </View>

          {specialThemes.length > 0 && (
            <View style={[styles.section]}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="star-outline"
                  size={18}
                  color={currentTheme.colors.text.primary}
                  style={{ marginRight: 6 }}
                />
                <Typography
                  variant="subtitle1"
                  style={[
                    styles.sectionTitle,
                    { color: currentTheme.colors.text.primary },
                  ]}
                >
                  Giao diện đặc biệt
                </Typography>
              </View>
              <View style={styles.themeGrid}>
                {specialThemes.map((theme) =>
                  renderThemeButton(theme, false)
                )}
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeButton: {
    width: 90,
    height: 90,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  colorPreview: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginBottom: 8,
  },
  themeName: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 11,
  },
  defaultDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: 6,
    right: 6,
  },
  animatedContent: {
    overflow: 'hidden',
  },
});
