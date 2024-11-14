import { Image, StyleSheet, Text, View } from "react-native";
import React, { memo, useEffect } from "react";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ProfileData from "../components/ProfileData";

const profile = memo(() => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Expo",
      headerTitleAlign: "center",
      headerRight: () => (
        <Ionicons name="settings-outline" size={24} color="black" />
      ),
    });
  });
  return (
    <View>
      <ProfileData />
    </View>
  );
});

export default profile;

const styles = StyleSheet.create({});
