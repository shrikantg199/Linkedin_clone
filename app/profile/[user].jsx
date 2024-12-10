import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
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
import Activity from "../../components/Activity";

const UserProfile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const [username, setUsername] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ 
      headerShown: true,
      headerTitle: username,
      headerTitleAlign: "center",
      headerRight: () => (
        <Ionicons name="settings-sharp" size={24} color="black" />
      ),
    });
    fetchData();
  }, [user, userData, navigation, username]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", email));

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          setUserData(data);
          setUsername(data.firstName + " " + data.lastName);
        });
      } else {
        console.log("No matching user data found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0284c7" />
        <Text className="text-gray-500 mt-2">Loading profile...</Text>
      </View>
    );
  }

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
            {`${userData.firstName || user.firstName || ""} ${
              userData.lastName || user.lastName || ""
            }`.trim() || "No Name Available"}
          </Text>
          <Text className="text-lg font-bold text-gray-600">
            {userData.headline || "No Headline"}
          </Text>
          <Text className="font-normal">
            {userData.location || "No Location"}
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
            <>
              {userData?.about}
              {/* Edit button for existing about text */}
              <TouchableOpacity onPress={() => router.push("/edit-about")}>
                <Text className="text-blue-500">Edit</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View>
              <Text className="text-gray-400 text-3xl">Add About</Text>
            </View>
          )}
        </Text>
      </View>
      <Activity />
    </ScrollView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({});
