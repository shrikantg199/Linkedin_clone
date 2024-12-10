import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import data from "../../../data.json";
const MyNetwork = () => {
    const isValidUrl = (url) => {
    return url && url.trim() !== "" && url.startsWith("http");
  };

  return (
    <View className="">
      <Text className="text-2xl font-bold mx-4 text-gray-400">Static Data</Text>
      <Text className="text-2xl font-bold mx-4">My network</Text>
      <FlatList
        data={data}
        numColumns={2}
        renderItem={({ item }) => (
          <View className="bg-white   shadow-black flex items-center rounded-2xl   h-64 w-52 m-2">
            {isValidUrl(item?.bannerPicUrl) ? (
              <Image
                source={{ uri: item.bannerPicUrl }}
                className="h-20 w-52 rounded-tl-xl rounded-tr-2xl"
              />
            ) : (
              <View className="h-20 w-52 bg-gray-200 rounded-tl-xl rounded-tr-2xl" />
            )}
            <Text className="absolute right-2">cross</Text>
            {isValidUrl(item?.profilePicUrl) ? (
              <Image
                source={{ uri: item.profilePicUrl }}
                className="h-32 w-32 absolute mt-2"
              />
            ) : (
              <View className="h-32 w-32 absolute mt-2 bg-gray-300 rounded-full" />
            )}
            <View className="mt-12 mb-3">
              <Text className="font-bold text-lg text-center">{item.name}</Text>
              <Text className="text-center">{item.title}</Text>
            </View>
            <View className="border-blue-600 border-2 px-8 py-2  rounded-full">
              <Text className="text-blue-700">Connect</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default MyNetwork;

const styles = StyleSheet.create({});
