import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";

import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Feather } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useUser } from "@clerk/clerk-expo";

// tailwind components styling error
const CustomDrawer = (props) => {
  const router = useRouter();
  const { user } = useUser();
  const [userData, setUserData] = useState("");
  useEffect(() => {
    fetchUserData();
  }, [user]);
  const fetchUserData = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    
    const email = user.primaryEmailAddress.emailAddress;
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          setUserData(data || {}); // Ensure we always set an object
        });
      } else {
        console.log("No matching user data found");
        setUserData({}); // Set empty object if no data found
      }
    } catch (error) {
      console.error("Error fetching user data: ", error.message);
      setUserData({}); // Set empty object on error
    }
  };
  return (
    <DrawerContentScrollView {...props}>
      <View className="mx-6 h-screen">
        <TouchableOpacity
          onPress={() => router.push(`/profile/${userData.userName}`)}
        >
          {userData?.profileImage && userData?.profileImage !== null ? (
            <Image
              source={{ uri: userData?.profileImage }}
              className="w-16 h-16 object-cover rounded-full"
            />
          ) : (
            <View className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <Text className="text-white text-sm">No Image</Text>
            </View>
          )}
        </TouchableOpacity>
        <View className="mb-4 mt-4">
          <Text className="text-2xl font-semibold">
            {(userData?.firstName || "") + " " + (userData?.lastName || "")}
          </Text>
          <Text className="text-lg my-1">{userData?.headline || ""}</Text>
          <Text className="text-lg text-gray-400 font-semibold my-1">
            {userData?.location || ""}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-gray-200/40 rounded-lg"
          activeOpacity={0.8}
        >
          <View className=" py-3 flex flex-row  items-center px-4 border-dashed border-gray-500 m-[2px] rounded-md border-2">
            <Entypo name="plus" size={24} color="#4b5563" />
            <Text className="text-gray-600 text-xl  font-semibold">
              Experience
            </Text>
          </View>
        </TouchableOpacity>
        <View className={` border-b border-gray-300  h-4`} />
        <View className="my-3 ">
          <Text className="text-lg text-gray-600 my-3"> Profile Viewers</Text>
          <Text className="text-lg text-gray-600"> Post impression</Text>
        </View>
        <View className={` border-b border-gray-300  h-4`} />
        <View className="">
          <Text className="font-extrabold my-4 text-2xl">Saved posts</Text>
          <Text className="font-extrabold my-2 text-2xl">Groups</Text>
          <Text className="font-extrabold my-4 text-2xl">Puzzle Games</Text>
        </View>
        <View className={` border-b border-gray-300  h-4`} />
        <View className="absolute bottom-8 flex  flex-row items-center ">
          <AntDesign name="setting" size={24} color="black" />
          <Text className="text-black text-2xl font-semibold mx-2">
            Settings
          </Text>
        </View>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;
