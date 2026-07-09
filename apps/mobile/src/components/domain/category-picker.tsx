import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { CategoryChip } from "@/components/domain/category-chip";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { ItemCategory } from "@/lib/types";

export type CategoryPickerProps = {
  categories: ItemCategory[];
  value: string | null;
  onChange: (categoryId: string) => void;
  loading?: boolean;
};

export function CategoryPicker({ categories, value, onChange, loading }: CategoryPickerProps) {
  const theme = useTheme();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.text} size="small" />
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {categories.map((c) => (
        <CategoryChip
          key={c.id}
          label={c.name}
          selected={value === c.id}
          onPress={() => onChange(c.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: Spacing.three,
    alignItems: "center",
  },
  scrollContent: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
});
