import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import data from "../../data.json";
import Reaction from "./Reaction";
const Posts = () => {
  // console.log(data);
  return (
    <View>
      {data.map((item, index) => (
        <View key={index} className="bg-white h-[400px] w-screen p-2 mb-3 py-2">
          <View className="flex flex-row justify-between items-center">
            <View className="flex flex-row gap-2 p-2">
              <Image
                source={require("../../assets/profile.png")}
                className="w-14 h-14   rounded-full"
              />
              <View className="">
                <Text className="text-xl font-bold">{item.name}</Text>
                <Text className="text-lg  text-gray-600">{item.title}</Text>
                <Text className="font-normal"> {item.location}</Text>
              </View>
            </View>
            <Entypo name="dots-three-vertical" size={22} color="black" />
          </View>
          {item.posts.map((post, index) => (
            <View key={index} className="">
              <Text className="p-2">{post.content}</Text>
              <Image
                source={{ uri: post.mediaUrl }}
                className=" h-60 rounded-lg"
              />
            </View>
          ))}
          {/* reactions */}
          <Reaction />
        </View>
      ))}
    </View>
  );
};

export default Posts;

const styles = StyleSheet.create({});
