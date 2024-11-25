import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const Reaction = () => {
  return (
    <View className="flex flex-row justify-between px-2 py-3 items-center">
      <TouchableOpacity>
        <MaterialIcons name="thumb-up-off-alt" size={24} color="black" />
        <Text>Like</Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex items-center">
        <MaterialCommunityIcons
          name="message-reply-text-outline"
          size={24}
          color="black"
        />
        <Text className="">comments</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <MaterialCommunityIcons
          name="rotate-3d-variant"
          size={24}
          color="black"
        />
        <Text>repost</Text>
      </TouchableOpacity>
      <TouchableOpacity className="">
        <MaterialCommunityIcons name="send-outline" size={24} color="black" />
        <Text>send</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Reaction;

const styles = StyleSheet.create({});
