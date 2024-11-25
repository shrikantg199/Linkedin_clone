import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const AuthLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/");
    }
  }, [isSignedIn, isLoaded]);

  if (!isLoaded || isSignedIn) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AuthLayout;

const styles = StyleSheet.create({});