import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Reactions from "../Home/Reaction";
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Posts = ({ userData }) => {
  const router = useRouter();

  return (
    <View>
      {userData && userData.length > 0 ? (
        userData.flatMap((user, userIndex) =>
          user.posts && user.posts.length > 0 ? (
            user.posts.map((post, postIndex) => {
              const profileImageUri = user.profileImage || null;
              const postImageUri = post.imageUrl || null;

              return (
                <View
                  key={`${userIndex}-${postIndex}`}
                  className="bg-white p-2 h-auto mb-3"
                >
                  {/* Header Section */}
                  <View className="flex flex-row justify-between items-center">
                    <View className="flex flex-row gap-3">
                      <TouchableOpacity
                        onPress={() =>
                          router.push(`/profile/${user.userName}`)
                        }
                      >
                        {profileImageUri && profileImageUri !== null ? (
                          <Image
                            source={{ uri: profileImageUri }}
                            className="w-16 h-16 border-white border-4 rounded-full"
                          />
                        ) : (
                          <View className="w-16 h-16 bg-gray-300 border-white border-4 rounded-full flex items-center justify-center">
                            <Text className="text-white text-sm">No Image</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      <View>
                        <View className="flex flex-row gap-2">
                          <Text className="font-bold text-xl">
                            {user.firstName || "First Name"}
                          </Text>
                          <Text className="font-bold text-xl">
                            {user.lastName || "Last Name"}
                          </Text>
                        </View>
                        <Text>{user.headline || "No headline available"}</Text>
                        <Text className="text-sm font-normal text-gray-600">
                          {user.location || "No location specified"}
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

                  {/* Post Content Section */}
                  <View className="py-3">
                    <Text className="text-lg font-semibold mx-3">
                      {post.content || "No content available"}
                    </Text>
                    {postImageUri && postImageUri !== null ? (
                      <Image
                        source={{ uri: postImageUri }}
                        className="w-full h-60 rounded-lg"
                      />
                    ) : (
                      <Text className="text-sm text-center text-gray-500">
                        No image available
                      </Text>
                    )}
                  </View>

                  {/* Reactions Section */}
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
