import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
const ProfileData = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const { user } = useUser();
  useEffect(() => {
    const fetchData = async () => {
      const email = user.primaryEmailAddress.emailAddress;
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", email));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        setUserData(doc.data());
      });
    };
    fetchData();
  }, [user]);
  return (
    <ScrollView>
      <View>
        {/* Profile & banner Image */}
        <Image
          source={require("../assets/image.png")}
          className="w-screen h-44"
        />
        <TouchableOpacity className="absolute right-4 top-3 py-2 bg-white px-2 rounded-full">
          <MaterialIcons name="create" size={24} color="blue" />
        </TouchableOpacity>
      </View>
      <View className="bg-white py-2 mb-3">
        <View className="flex flex-row justify-between items-center -mt-12 px-4">
          <Image
            source={require("../assets/profile.png")}
            className="w-32 h-32 border-white border-4 rounded-full"
          />
          {/* edit icon */}
          <TouchableOpacity onPress={() => router.push("/editprofile")}>
            <MaterialIcons name="create" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {/* Name,Skills,Location */}
        <View className="mx-4 py-2">
          <Text className="text-2xl font-bold">
            {userData
              ? userData.firstName + " " + userData.lastName
              : user.fullName}
          </Text>
          <Text className="text-lg font-bold text-gray-600">
            {userData ? userData.headline : ""}
          </Text>
          <Text className="font-normal">
            {userData ? userData.location : ""}
          </Text>
        </View>
      </View>
      {/* About */}
      <View className="bg-white h-60 mb-3">
        <View className="flex flex-row justify-between items-center px-3 p-2">
          <Text className="text-2xl font-bold">About</Text>
          {/* icon */}
          <TouchableOpacity>
            <MaterialIcons name="create" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {/* about */}
        <Text className="p-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem a
          nemo nihil animi quis placeat natus facilis ipsa ipsum assumenda.
        </Text>
      </View>
      {/* Featured */}
      {/* <View className="bg-white h-60 mb-3">
        <View className="flex flex-row justify-between items-center px-3 p-2">
          <Text className="text-2xl font-bold">Featured</Text>
         
          <TouchableOpacity>
            <MaterialIcons name="create" size={24} color="black" />
          </TouchableOpacity>
        </View>
      
        <Text className="p-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem a
          nemo nihil animi quis placeat natus facilis ipsa ipsum assumenda.
        </Text>
      </View> */}
      {/* Activity */}
      <View className="bg-white h-60">
        <View className="flex flex-row justify-between items-center px-3 p-3">
          <Text className="text-2xl font-bold">Activity</Text>
          {/* icon */}
          <TouchableOpacity>
            <MaterialIcons name="create" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {/* Activity */}
        <View className="flex flex-row justify-between p-2">
          <View className="flex flex-row gap-2">
            <Image
              source={require("../assets/profile.png")}
              className="w-16 h-16  border-4 rounded-full"
            />
            <View className="">
              <Text className="text-xl font-bold">Expo coder</Text>
              <Text className="text-lg font-bold text-gray-600">
                React native | Expo
              </Text>
              <Text className="font-normal">India</Text>
            </View>
          </View>
          <Entypo name="dots-three-vertical" size={22} color="black" />
        </View>
        {/* posts */}
        <Text className="p-3">posts</Text>
      </View>
    </ScrollView>
  );
};

export default ProfileData;

const styles = StyleSheet.create({});
