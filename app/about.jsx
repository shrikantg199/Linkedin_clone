import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard } from "react-native";
import { useState } from "react";
import { Platform } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { TouchableOpacity } from "react-native";
import { Alert } from "react-native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigation, useRouter } from "expo-router";
import { db } from "../firebaseConfig";
import { Entypo } from "@expo/vector-icons";

const About = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(true);
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
  const handleKeyboardShow = (event) => {
    setIsKeyboardVisible(true);
  };

  const handleKeyboardHide = (event) => {
    setIsKeyboardVisible(false);
  };
  const handleSave = async () => {
    if (user) {
      try {
        const email = user.primaryEmailAddress.emailAddress;

        // update the user document
        const q = query(collection(db, "users"), where("email", "==", email));
        const userDocSnap = await getDocs(q);
        userDocSnap.forEach(async (docSnap) => {
          const userDocRef = doc(db, "users", docSnap.id);
          await updateDoc(userDocRef, {
            about,
          });
        });
        // alert user
        Alert.alert("Success", "about updated successfully");
        router.back();

        // alert user
        Alert.alert("Success", "about created successfully");
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    }
  };
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Edit About",
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
    fetchData();
  }, [user]);
  const fetchData = async () => {
    const email = user.primaryEmailAddress.emailAddress;
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      setAbout(data.about);
      setLoading(false);
    });
  };

  return (
    <View>
      <KeyboardAvoidingView
        className="h-screen"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className=" mx-2">
          <TextInput
            placeholder="Enter post content"
            className="text-2xl"
            multiline
            autoFocus={true}
            value={about}
            onChangeText={(text) => setAbout(text)}
          />
        </View>
        <TouchableOpacity
          onPress={handleSave}
          className={`absolute bg-blue-600 self-center w-[90%]  py-4 flex-row justify-center rounded-full ${
            isKeyboardVisible ? "bottom-44" : "bottom-24"
          }`}
        >
          <Text className="text-xl text-white">Save</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({});
