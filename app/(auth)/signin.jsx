import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
const SignIn = () => {
  const [toggle, setToggle] = useState(false);
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn, getToken } = useAuth();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  // Check for existing session on component mount
  useEffect(() => {
    checkExistingSession();
  }, [isSignedIn]);

  const checkExistingSession = async () => {
    try {
      if (isSignedIn) {
        router.push("/");
        return;
      }

      const token = await getToken();
      if (token) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error checking existing session:", error);
      await SecureStore.deleteItemAsync("sessionToken");
    }
  };

  // Enhanced authentication handler with persistence
  const handleAuthentication = useCallback(
    async (sessionId) => {
      try {
        await setActive({ session: sessionId });
        await SecureStore.setItemAsync("sessionToken", sessionId);
        router.push("/");
      } catch (error) {
        console.error("Error setting active session:", error);
        Alert.alert(
          "Authentication Error",
          "Failed to complete sign-in process."
        );
      }
    },
    [setActive, router]
  );

  // OAuth Google sign-in flow
  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onGoogleSignInPress = useCallback(async () => {
    try {
      const { createdSessionId } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/", { scheme: "myapp" }),
      });
      if (createdSessionId) {
        await handleAuthentication(createdSessionId);
      } else {
        console.log("No session created, additional steps may be required");
      }
    } catch (err) {
      console.error("OAuth error", JSON.stringify(err, null, 2));
      Alert.alert(
        "Google Sign-In Error",
        err.message || "An error occurred during Google Sign-in."
      );
    }
  }, [handleAuthentication]);

  // Email and password sign-in flow
  const onEmailSignInPress = useCallback(async () => {
    if (!isLoaded) {
      Alert.alert("Loading", "Please wait for loading to complete.");
      return;
    }

    if (!emailAddress || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await handleAuthentication(signInAttempt.createdSessionId);
      } else {
        console.log("Sign-in not complete, status:", signInAttempt.status);
        Alert.alert("Sign-In Error", "Sign-in requires further steps.");
      }
    } catch (err) {
      console.error("Email sign-in error", JSON.stringify(err, null, 2));
      Alert.alert(
        "Sign-In Error",
        err.message || "An error occurred during sign-in."
      );
    }
  }, [isLoaded, emailAddress, password, handleAuthentication]);

  return (
    <SafeAreaView className="bg-white h-screen flex-1">
      <View className="flex flex-col justify-center h-[80%] items-center gap-4 ">
        <Text className="text-6xl">Sign In</Text>

        {/* Sign In with Email & Password*/}
        {/* email */}
        <View className="border border-black w-[300px] rounded-lg my-2">
          <TextInput
            placeholder="Email or Phone"
            className="text-xl py-3 px-2"
            value={emailAddress}
            onChangeText={setEmailAddress}
          />
        </View>
        {/* Password */}
        <View className="border flex flex-row justify-between items-center px-3 border-black w-[300px] rounded-lg">
          <TextInput
            placeholder="Password"
            secureTextEntry={toggle}
            className="text-xl py-3 "
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setToggle(!toggle)}
          >
            <Text className="text-blue-500 font-bold text-lg">show</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-blue-500 font-bold text-lg">
          Forgot Password ?
        </Text>
        {/* Button */}
        <TouchableOpacity
          onPress={onEmailSignInPress}
          className="bg-blue-600 my-2 py-4 rounded-3xl w-[80%]"
        >
          <Text className="text-white text-lg text-center">Sign In</Text>
        </TouchableOpacity>
        <Text>OR</Text>

        {/* Sign In with Google */}

        <TouchableOpacity
          onPress={onGoogleSignInPress}
          className="border border-gray-400 rounded-3xl px-10 py-3 flex flex-row items-center"
        >
          <Image source={require("../../assets/google.png")} className="h-8 w-8" />
          <Text>Sign In with Google</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
