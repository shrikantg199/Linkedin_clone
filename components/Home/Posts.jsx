import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Reactions from "../Home/Reaction";
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

const Posts = ({ userData }) => {
  const router = useRouter();
  console.log(userData);
  return (
    <View className="">
      {userData && userData.length > 0 ? (
        userData.flatMap((user, userIndex) =>
          user.posts && user.posts.length > 0 ? (
            user.posts.map((post, postIndex) => {
              // If post data is missing or empty
              if (!post || !post.content) {
                return (
                  <View
                    key={`${userIndex}-${postIndex}`}
                    className="bg-white p-2 h-auto mb-3"
                  >
                    <Text className="text-center text-gray-500">
                      No content available
                    </Text>
                  </View>
                );
              }

              return (
                <View
                  key={`${userIndex}-${postIndex}`}
                  className="bg-white p-2 h-auto mb-3"
                >
                  <View className="flex flex-row justify-between items-center">
                    <View className="flex flex-row gap-3">
                      <TouchableOpacity
                        onPress={() =>
                          router.push(`/profile/${userData.userName}`)
                        }
                      >
                        <Image
                          source={{ uri: user.profileImage }}
                          className="w-16 h-16 border-white border-4 rounded-full"
                        />
                      </TouchableOpacity>
                      <View className="">
                        <View className="flex flex-row gap-2">
                          <Text className="font-bold text-xl">
                            {user.firstName}
                          </Text>
                          <Text className="font-bold text-xl">
                            {user.lastName}
                          </Text>
                        </View>
                        <Text>{user.headline}</Text>
                        <Text className="text-sm font-normal text-gray-600">
                          {user.location}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity>
                      <Entypo
                        name="dots-three-vertical"
                        size={20}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>

                  <View className="py-3">
                    <Text className="text-lg font-semibold mx-3">
                      {post.content || "No content available"}
                    </Text>
                    {post.imageUrl ? (
                      <Image
                        source={{ uri: post.imageUrl }}
                        className="w-full h-60 rounded-lg"
                      />
                    ) : (
                      <Text className="text-sm text-center text-gray-500">
                        No image available
                      </Text>
                    )}
                  </View>

                  <Reactions />
                </View>
              );
            })
          ) : (
            <Text key={userIndex} className="text-center text-gray-500">
              No posts available for this user.
            </Text>
          )
        )
      ) : (
        <Text className="text-center text-gray-500">
          No users or posts available
        </Text>
      )}
    </View>
  );
};

export default Posts;

const styles = StyleSheet.create({});
