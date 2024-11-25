import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Alert } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Entypo } from "@expo/vector-icons";

const EditProfile = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [userData, setUserData] = useState(null);
  console.log(userData);
  const { user } = useUser();
  const router = useRouter();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Edit Profile",
      headerTitleAlign: "center",
      headerLeft: () => (
        // icon
        <Entypo
          onPress={() => {
            console.log("Back button pressed");
            router.back();
          }}
          name="cross"
          size={32}
          color="black"
        />
      ),
    });
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      handleKeyboardShow
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardHide
    );

    return () => {
      showSubscription.remove();
    };
  }, []);

  const handleKeyboardShow = (event) => {
    setIsKeyboardVisible(true);
  };

  const handleKeyboardHide = (event) => {
    setIsKeyboardVisible(false);
  };
  useEffect(() => {
    // fetch users data
    const fetchUserData = async () => {
      const userDocRef = doc(db, "users", user.id);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setHeadline(data.headline || "");
        setLocation(data.location || "");
      }
    };
    fetchUserData();
  }, [user]);
  const handleSave = async () => {
    // console.log(firstName, lastName, headline, location);
    if (user) {
      const uid = user.id;
      const email = user.primaryEmailAddress.emailAddress;
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      try {
        if (userDocSnap.exists()) {
          // update the user document
          await updateDoc(userDocRef, {
            firstName,
            lastName,
            headline,
            location,
            email,
          });
          // alert user
          Alert.alert("Success", "Profile updated successfully");
          router.back();
        } else {
          // create the user document
          await setDoc(doc(db, "users", uid), {
            firstName,
            lastName,
            headline,
            location,
            email,
          });
          router.back();
          // alert user
          Alert.alert("Success", "Profile created successfully");
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="bg-white h-screen">
        <View className="mx-8 my-8 h-screen">
          <Text className="text-3xl font-bold">Basic Info</Text>
          <TextInput
            placeholder="First name"
            className="focus:border-b-2 p-2 border-b my-3"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />
          <TextInput
            placeholder="Last name"
            className="focus:border-b-2 p-2 border-b"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />
          <TextInput
            placeholder="headline"
            className="focus:border-b-2 p-2 border-b my-3"
            value={headline}
            onChangeText={(text) => setHeadline(text)}
          />
          <TextInput
            placeholder="Location"
            className="focus:border-b-2 p-2 border-b my-3"
            value={location}
            onChangeText={(text) => setLocation(text)}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={handleSave}
        className={`absolute bg-blue-600 w-full  py-4 flex-row justify-center rounded-full ${
          isKeyboardVisible ? "bottom-28" : "bottom-28"
        }`}
      >
        <Text className="text-xl text-white">Save</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({});
