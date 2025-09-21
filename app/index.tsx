import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

const Index = () => {
  const router = useRouter();

  const { user, loading } = useAuth();
  console.log("user data ", user);

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/(dashboard)/home");
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 w-full">
        <ActivityIndicator size="large" />
      </View>
    );
  }
  // Fallback UI if navigation fails
  return (
    <View className="items-center justify-center flex-1 w-full">
      <ActivityIndicator size="large" />
      <Text className="mt-4 text-center text-red-500">
        Unable to navigate. Please check your routes or try again.
      </Text>
    </View>
  );
};

export default Index;
