import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import Reactions from "../components/Home/Reaction";
import { useRouter } from "expo-router";

const Activity = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    fetchUserPostData();
  }, [user]);

  const fetchUserPostData = async () => {
    setIsLoading(true);
    try {
      if (!user?.primaryEmailAddress?.emailAddress) {
        return;
      }
      const email = user.primaryEmailAddress.emailAddress;
      const q = query(collection(db, "users"), where("email", "==", email));

      const querySnapshot = await getDocs(q);
      const posts = [];
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          posts.push(doc.data());
        });
        setUserData(posts);
      } else {
        console.log("No matching user data found");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const hasNoPosts =
    !userData || !userData.length || !userData[0]?.posts?.length;

  return (
    <View className="bg-white h-auto p-2 mb-3">
      <View className="flex flex-row justify-between items-center px-3">
        <Text className="text-2xl font-bold">Activity</Text>
        {/* <MaterialIcons name="create" size={24} color="black" /> */}
      </View>

      {/* No Posts Message */}
      {hasNoPosts ? (
        <View className="py-8 px-4 items-center">
          <MaterialIcons name="post-add" size={50} color="#9ca3af" />
          <Text className="text-gray-400 text-lg text-center mt-2">
            You haven't posted anything yet
          </Text>
          <TouchableOpacity
            className="mt-4 bg-blue-500 px-6 py-2 rounded-full"
            onPress={() => router.push("/Post")}
          >
            <Text className="text-white font-semibold">Create a Post</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Posts List */
        <View>
          {userData.flatMap((user, userIndex) =>
            user.posts.map((post, postIndex) => (
              <View
                key={`${userIndex}-${postIndex}`}
                className="bg-white p-2 h-auto mb-3"
              >
                <View className="flex flex-row justify-between items-center">
                  <View className="flex flex-row gap-3">
                    <TouchableOpacity
                      onPress={() =>
                        router.push(
                          `/profile/${user.firstName + user.lastName}`
                        )
                      }
                    >
                      {user?.profileImage ? (
                        <Image
                          source={{ uri: user.profileImage }}
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
                          {user.firstName || ""}
                        </Text>
                        <Text className="font-bold text-xl">
                          {user.lastName || ""}
                        </Text>
                      </View>
                      <Text>{user.headline || ""}</Text>
                      <Text className="text-sm font-normal text-gray-600">
                        {user.location || ""}
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
                    {post.content || ""}
                  </Text>
                  {post?.imageUrl && (
                    <Image
                      source={{ uri: post.imageUrl }}
                      className="w-full h-60 rounded-lg"
                    />
                  )}
                </View>

                <Reactions />
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
};

export default Activity;

const styles = StyleSheet.create({});
