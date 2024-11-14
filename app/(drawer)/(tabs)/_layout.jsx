import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { Redirect, Tabs, useNavigation } from "expo-router";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { TouchableOpacity } from "react-native";
import { DrawerActions } from "@react-navigation/native";
// if not signed in redirect to /signin
const TabLayout = () => {
  const navigation = useNavigation();
  const { isSignedIn } = useAuth();
  if (!isSignedIn) {
    return <Redirect href={"/signin"} />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: true,
        tabBarActiveTintColor: "black",
        tabBarStyle: {
          height: 60,
        },
        tabBarIconStyle: {
          marginBottom: -10,
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            className="mx-2"
          >
            <Image
              source={require("../../../assets/profile.png")}
              className="h-12 w-12"
            />
          </TouchableOpacity>
        ),
        headerTitle: () => (
          <View className="bg-blue-400/20 gap-2  px-2 rounded-lg  flex flex-row items-center">
            {/* search icon */}
            <FontAwesome name="search" size={20} color="gray" />
            <TextInput
              placeholder="search"
              className=" py-2  w-[260px] text-xl"
            />
          </View>
        ),
        headerTitleAlign: "center",
        headerRight: () => (
          // settings

          <View className="flex flex-row items-center">
            <AntDesign name="message1" size={24} color="black" />
            <Ionicons
              name="settings-outline"
              size={24}
              color="black"
              style={{ marginHorizontal: 6 }}
            />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`${
                focused ? "font-extrabold" : "font-normal"
              } -mt-2 text-base`}
            >
              Home
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="MyNetwork"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`${
                focused ? "font-extrabold" : "font-normal"
              } -mt-2 text-base`}
            >
              My Network
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Post"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`${
                focused ? "font-extrabold" : "font-normal"
              } -mt-2 text-base`}
            >
              Post
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Feather name="plus-square" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Notification"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`${
                focused ? "font-extrabold" : "font-normal"
              } -mt-2 text-base`}
            >
              Notification
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome name="bell" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Jobs"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`${
                focused ? "font-extrabold" : "font-normal"
              } -mt-2 text-base`}
            >
              Jobs
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="business-center" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
