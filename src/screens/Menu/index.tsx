import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Loading } from '../../components/shared';
import { SearchBar } from '../../components/shared/SearchBar';
import { useMenuData } from './hooks/useMenuData';
import { useRecipeFilter } from './hooks/useRecipeFilter';
import { RegionFilter } from './components/RegionFilter';
import { RecipeList } from './components/RecipeList';
import { Ionicons } from '@expo/vector-icons';
import { useGridZoom } from './hooks/useGridZoom';
import { createStyles } from './styles';

export default function MenuScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const {
    savedRecipes,
    isRefreshing,
    isLoading,
    refreshSavedRecipes,
    handleDeleteRecipe,
  } = useMenuData();

  const {
    searchQuery,
    setSearchQuery,
    selectedRegion,
    setSelectedRegion,
    filteredRecipes,
    regions,
  } = useRecipeFilter(savedRecipes);

  const {
    currentConfig,
    calculateItemWidth,
    zoomIn,
    zoomOut,
    canZoomIn,
    canZoomOut,
  } = useGridZoom();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background.default,
      }}
    >
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Tìm theo tên món hoặc nguyên liệu..."
      />

      <View style={styles.headerControls}>
        <RegionFilter
          regions={regions}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />

        <View style={styles.zoomControls}>
          <TouchableOpacity
            onPress={zoomOut}
            disabled={!canZoomOut}
            style={[
              styles.zoomButton,
              !canZoomOut && styles.zoomButtonDisabled,
            ]}
          >
            <Ionicons
              name="remove"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={zoomIn}
            disabled={!canZoomIn}
            style={[styles.zoomButton, !canZoomIn && styles.zoomButtonDisabled]}
          >
            <Ionicons name="add" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <Loading text="Đang tải..." />
      ) : (
        <RecipeList
          isRefreshing={isRefreshing}
          isLoading={isLoading}
          filteredRecipes={filteredRecipes}
          savedRecipes={savedRecipes}
          onRefresh={refreshSavedRecipes}
          onDeleteRecipe={handleDeleteRecipe}
          currentConfig={currentConfig}
          calculateItemWidth={calculateItemWidth}
        />
      )}
    </View>
  );
}
