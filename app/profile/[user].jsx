import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import EditBannerImage from "../../components/EditBannerImage";
import EditProfileImage from "../../components/EditProfileImage";
const UserProfile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUser();
  const [username, setUsername] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: username,
      headerTitleAlign: "center",
      headerRight: () => (
        // setting icon
        <Ionicons name="settings-sharp" size={24} color="black" />
      ),
    });
    fetchData();
  }, [user, userData, navigation, username]);
  const fetchData = async () => {
    const email = user.primaryEmailAddress.emailAddress;
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.data());
      const data = doc.data();
      setUserData(data);
      setUsername(data.firstName + " " + data.lastName);
    });
    setRefreshing(false);
  };
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          colors={["blue"]}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      }
    >
      <View>
        {/* Profile & banner Image */}
        <EditBannerImage />
      </View>
      <View className="bg-white py-2 mb-3">
        <EditProfileImage />

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
      <View className="bg-white h-auto mb-3 p-3">
        <View className="flex flex-row justify-between items-center px-3 p-2">
          <Text className="text-2xl font-bold">About</Text>
          {/* icon */}
          <TouchableOpacity onPress={() => router.push("/about")}>
            <MaterialIcons name="create" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {/* about */}
        <Text className="p-3">
          {userData && userData.about ? (
            userData?.about
          ) : (
            <View>
              <Text className="text-gray-400 text-3xl">Add About</Text>
            </View>
          )}
        </Text>
      </View>

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
              source={require("../../assets/profile.png")}
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

export default UserProfile;

const styles = StyleSheet.create({});
