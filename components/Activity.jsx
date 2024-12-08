import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import Reactions from "../components/Home/Reaction";
const Activity = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState("");

  useEffect(() => {
    // fetch firestore data
    fetchUserPostData();
  }, [user]);
  const fetchUserPostData = async () => {
    const email = user?.primaryEmailAddress.emailAddress; // Get the email from Clerk
    const q = query(collection(db, "users"), where("email", "==", email)); // Query by email

    try {
      const querySnapshot = await getDocs(q);
      const posts = [];
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          posts.push(doc.data());
          // console.log(doc.data());
        });
        setUserData(posts);
      } else {
        console.log("No matching user data found");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error.message);
    }
  };
  return (
    <View className="bg-white h-auto p-2 mb-3">
      <View className="flex flex-row justify-between items-center px-3">
        <Text className="text-2xl font-bold">Activity</Text>
        <MaterialIcons name="create" size={24} color="black" />
      </View>
      {/* posts here */}

      <View className="">
        {userData &&
          userData.flatMap((user, userIndex) =>
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
                      <Image
                        source={{ uri: user?.profileImage }}
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
                    {post.content}
                  </Text>
                  <Image
                    source={{ uri: post?.imageUrl }}
                    className="w-full h-60 rounded-lg"
                  />
                </View>
 
                <Reactions />
              </View>
            ))
          )}
      </View>
    </View>
  );
};

export default Activity;

const styles = StyleSheet.create({});
