import { MaterialIcons } from "@expo/vector-icons";
import {
  Image,
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
import { useNavigation, useRouter } from "expo-router";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { db, storage } from "../firebaseConfig";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import uuid from "react-native-uuid";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
const EditBannerImage = () => {
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState("");
  const { user } = useUser();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 1],
      quality: 1,
    });

    // console.log(result?.assets[0]?.uri);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };
  // upload function
  const uploadImage = async (uri) => {
    // fetch
    const response = await fetch(uri);
    // blob
    const blob = await response.blob();
    // unique id package
    const uniqueName = uuid.v4();
    //
    const storageRef = ref(storage, `image${uniqueName}`);
    await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(storageRef);
    // console.log(downloadUrl);
    const email = user?.primaryEmailAddress?.emailAddress;
    // error
    const q = query(collection(db, "users"), where("email", "==", email));
    const docs = await getDocs(q);

    docs.forEach((docSnapshot) => {
      // id
      const docRef = doc(collection(db, "users"), docSnapshot?.id);
      updateDoc(docRef, {
        bannerImage: downloadUrl,
      });
      console.log("banner image updated");
    });
    return downloadUrl;
  };
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
          setUserData(data); // Set user data
        });
      } else {
        console.log("No matching user data found");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };
  return (
    <View>
      <Image
        source={
          userData.bannerImage
            ? { uri: userData.bannerImage }
            : require("../assets/image.png")
        }
        className="w-screen h-44"
      />

      <TouchableOpacity
        onPress={pickImage}
        className="absolute right-4 top-3 py-2 bg-white px-2 rounded-full"
      >
        <MaterialIcons name="create" size={24} color="blue" />
      </TouchableOpacity>
    </View>
  );
};

export default EditBannerImage;

const styles = StyleSheet.create({});
