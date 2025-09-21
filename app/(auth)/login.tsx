import { login } from "@/services/authService";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handelLogin = async () => {
    setIsLoading(true);
    await login(email, password)
      .then((res) => {
        setIsLoading(true);
        router.push("/home");
        Alert.alert("Login success");
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
        Alert.alert("Login Failed , Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View className="justify-center flex-1 p-6 bg-gray-100">
      <Text className="mb-8 text-3xl font-extrabold text-center text-blue-700">
        Login to Task Manager
      </Text>
      <View className="mb-4">
        <TextInput
          placeholder="Email"
          className="px-4 py-3 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:border-blue-500"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View className="mb-6">
        <TextInput
          placeholder="Password"
          secureTextEntry
          className="px-4 py-3 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:border-blue-500"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity
        className="py-3 mb-4 bg-blue-600 rounded-lg shadow-md active:bg-blue-700"
        onPress={handelLogin}
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text className="text-lg font-semibold text-center text-white">
            Login
          </Text>
        )}
      </TouchableOpacity>
      <Pressable onPress={() => router.push("/register")}>
        <Text className="text-center text-blue-600 underline">
          Don't have an account? Register
        </Text>
      </Pressable>
    </View>
  );
};

export default Login;
