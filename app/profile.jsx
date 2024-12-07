import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import React, { memo, useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useUser } from "@clerk/clerk-expo";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

const profile = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [username, setUserName] = useState("");
  const { user } = useUser();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: username,
      headerTitleAlign: "center",
      headerRight: () => (
        <Ionicons name="settings-outline" size={24} color="black" />
      ),
    });
  }, [navigation, username]);

  useEffect(() => {
    fetchUserData();
  }, [user]);
  const fetchUserData = async () => {
    const email = user.primaryEmailAddress?.emailAddress;
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // console.log("Fetched user data:", data);

          setUserName(data.firstName + " " + data.lastName);
        });
      } else {
        console.log("No matching user data found");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="mt-20">
        <ActivityIndicator size="large" className="flex-1 " color={"blue"} />
      </View>
    );
  }
  return <View>
    {/*  */}
  </View>;
};

export default profile;

const styles = StyleSheet.create({});
