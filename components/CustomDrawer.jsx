import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

const CustomDrawer = (props) => {
  const router = useRouter();
  const [userData, setUserData] = useState("");
  const { user } = useUser();
  useEffect(() => {
    fetchData();
  }, [user]);
  const fetchData = async () => {
    const email = user.primaryEmailAddress.emailAddress;
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // console.log(data);
      setUserData(data);
    });
  };

  return (
    <DrawerContentScrollView {...props}>
      <View className="mx-6 h-screen">
        <TouchableOpacity
          onPress={() => router.push(`/profile/${userData.userName}`)}
        >
          <Image
            source={{ uri: userData?.profileImage }}
            className="w-20 h-20"
          />
        </TouchableOpacity>
        <View>
          <Text className="text-2xl font-bold">{userData.firstName}</Text>
          <Text className="text-lg  ">React Native | Expo </Text>
          <Text className="text-xl  text-gray-500 font-bold">Location</Text>
        </View>
        <View className="border-b border-gray-300 h-4 my-3" />
        <TouchableOpacity activeOpacity={0.8} className="bg-white rounded-2xl">
          <View className="px-2 py-3 rounded-xl flex flex-row items-center border-dashed border-black border-2 m-[2px]">
            {/* icon */}
            <Entypo name="plus" size={24} color="gray" />
            <Text className="text-gray-400 font-bold text-xl ">
              {" "}
              Experience
            </Text>
          </View>
        </TouchableOpacity>
        <View className="border-b border-gray-300 h-4 my-2" />
        <View className="mx-3">
          <Text className="text-2xl my-3 font-bold">Saved Posts</Text>
          <Text className="text-2xl font-bold">Groups</Text>
        </View>
        <View className="border-b border-gray-300 h-4 my-2" />
        <View className="absolute bottom-12 flex flex-row gap-2 items-center">
          {/* icon */}
          <Ionicons name="settings-outline" size={24} color="black" />
          <Text className="text-xl font-bold">Settings</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({});
