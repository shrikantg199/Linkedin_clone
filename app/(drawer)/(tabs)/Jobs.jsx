import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useAuth, useUser } from "@clerk/clerk-expo";

const Jobs = () => {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const { user } = useUser();
  return (
    <View className="flex-1 justify-center items-center">
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Text className=" ">Index</Text>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <Button title="sign out" onPress={() => signOut()} />
      </TouchableOpacity>
    </View>
  );
};

export default Jobs;

const styles = StyleSheet.create({});
