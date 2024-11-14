import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Button,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Create Post",
      headerLeft: () => (
        // icon
        <TouchableOpacity onPress={() => router.back()}>
          <Entypo name="cross" size={32} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity className="mx-2">
          <Text className="bg-blue-600 px-2 py-2 rounded-xl text-white">
            Post
          </Text>
        </TouchableOpacity>
      ),
    });
  });
  return (
    <View className="">
      <View>
        <TextInput
          placeholder="Enter Post content"
          className="text-2xl"
          multiline
          autoFocus={true}
        />
      </View>
      {/* image */}
      <Button title="image picker" onPress={pickImage} />
      {image && <Image source={{ uri: image }} className="h-44 w-full" />}
    </View>
  );
};
export default Post;

const styles = StyleSheet.create({});
