import React, { memo } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import notifications from "../../../notification.json";
import { Entypo } from "@expo/vector-icons";
const Notifications = () => {
  return (
    <View className="flex-1 mb-12 h-full  m-1 mx-2 ">
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            className={`flex flex-row items-center gap-3 mb-3 p-3 shadow bg-white shadow-black rounded-xl`}
          >
            <Image source={{ uri: item.imageUrl }} className="w-12 h-12" />
            <View className="flex-1">
              <Text className="text-xl">{item.message}</Text>
              <Text className="text-sm text-gray-500">
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
            <Entypo name="dots-three-vertical" size={20} color="gray" />
          </View>
        )}
      />
    </View>
  );
};
export default Notifications;
