import { Tabs } from "expo-router"
import { Text } from "react-native"
import { COLORS } from "../../lib/constants"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: 4,
          paddingTop: 4,
          height: 56,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTintColor: COLORS.textPrimary,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 17,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Decks",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🗂</Text>,
          headerTitle: "Flip & Flow",
          headerTitleStyle: {
            color: COLORS.primary,
            fontWeight: "700",
            fontSize: 20,
          },
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: "전체 학습",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📖</Text>,
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: "Bookmarks",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⭐</Text>,
        }}
      />
    </Tabs>
  )
}
