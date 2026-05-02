import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "@/lib/theme"

export default function TabsLayout() {
  const { colors } = useTheme()
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: { color: colors.text, fontWeight: "700" },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "덱",
          tabBarIcon: ({ color, size }) => <Ionicons name="albums-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: "전체 학습",
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: "북마크",
          tabBarIcon: ({ color, size }) => <Ionicons name="star-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="essays"
        options={{
          title: "에세이",
          tabBarIcon: ({ color, size }) => <Ionicons name="create-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "설정",
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
