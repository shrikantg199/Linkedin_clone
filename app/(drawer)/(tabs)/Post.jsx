import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native";
import { db, storage } from "./../../../firebaseConfig";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import uuid from "react-native-uuid";
import { addDoc, collection } from "firebase/firestore";
const Post = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
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
    console.log(downloadUrl);
    return downloadUrl;
  };

  // add url in database
  const postHandler = async () => {
    // console.log("clicked");
    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImage(image);
    }
    try {
      await addDoc(collection(db, "posts"), {
        imageUrl: imageUrl,
      });
      console.log("Post added to Firestore successfully.");
      alert("Post created successfully!");

      setImage(null);
      router.back(); // Navigate back after successful post
    } catch (error) {
      console.error("Error adding post to Firestore: ", error);
      alert("Failed to create post.");
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Create Post",
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
      headerRight: () => (
        <TouchableOpacity className="mx-2" onPress={postHandler}>
          <Text className="bg-blue-600 px-3 py-2 rounded-xl text-white">
            Post
          </Text>
        </TouchableOpacity>
      ),
    });
  });
  return (
    <KeyboardAvoidingView
      className="h-screen"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View>
        <TextInput
          placeholder="Enter post content"
          className="text-2xl"
          multiline
          autoFocus={true}
        />
        {image && (
          <Image source={{ uri: image }} className="h-96 w-full mt-10" />
        )}
      </View>
      <TouchableOpacity
        onPress={pickImage}
        className="absolute bottom-36 right-10 bg-blue-600 px-3 py-3 rounded-full "
      >
        {/* image icon */}
        <FontAwesome5 name="photo-video" size={20} color="white" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default Post;
