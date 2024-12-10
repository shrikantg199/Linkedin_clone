import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
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

  const [userName, setUserName] = useState("");

  // console.log(userData);
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const firstNameInputRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Edit Profile",
      headerTitleAlign: "center",
      headerLeft: () => (
        // icon
        <Entypo
          onPress={() => {
            // console.log("Back button pressed");
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

  useEffect(() => {
    // Automatically focus on the first input field when the component mounts
    firstNameInputRef.current.focus();
  }, []);

  const handleKeyboardShow = (event) => {
    setIsKeyboardVisible(true);
  };

  const handleKeyboardHide = (event) => {
    setIsKeyboardVisible(false);
  };
  useEffect(() => {
    // fetch users data

    fetchUserData();
  }, [user]);
  const fetchUserData = async () => {
    const userDocRef = doc(db, "users", user.id);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      setFirstName(data.firstName || user.firstName || "");
      setLastName(data.lastName || user.lastName || "");
      setHeadline(data.headline || "");
      setLocation(data.location || "");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Error", "First name and last name cannot be empty.");
      return;
    }
    setLoading(true);
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
            userName,
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
            userName,
          });
          router.back();
          // alert user
          Alert.alert("Success", "Profile created successfully");
        }
      } catch (error) {
        Alert.alert("Error", `Failed to save profile: ${error.message}`);
      }
    }
    setFirstName("");
    setLastName("");
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-white h-auto">
            <View className="mx-8 my-8">
              <Text className="text-3xl font-bold">Basic Info</Text>
              <TextInput
                ref={firstNameInputRef}
                placeholder="First name"
                className="focus:border-b-2 p-2 border-b my-3"
                value={firstName || user.firstName || "Default First Name"}
                onChangeText={(text) => setFirstName(text)}
              />
              <TextInput
                placeholder="Last name"
                className="focus:border-b-2 p-2 border-b"
                value={lastName || user.lastName || "Default Last Name"}
                onChangeText={(text) => setLastName(text)}
              />
              <TextInput
                placeholder="Username"
                className="focus:border-b-2 p-2 border-b"
                value={userName}
                onChangeText={(text) => setUserName(text)}
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
            disabled={loading}
            className={`absolute bg-blue-600 w-full py-4 flex-row justify-center rounded-full ${
              isKeyboardVisible ? "bottom-28" : "bottom-28"
            }`}
          >
            <Text className="text-xl text-white">
              {loading ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({});
