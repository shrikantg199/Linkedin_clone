import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import Posts from "../../../components/Home/Posts";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useUser } from "@clerk/clerk-expo";

const index = () => {
  // const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState("");
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  // if (loading) {
  //   return (
  //     <View className="mt-10">
  //       <ActivityIndicator size="large" className="flex-1 " color={"blue"} />
  //     </View>
  //   );
  // }
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };
  useEffect(() => {
    fetchData();
  }, [user]);
  const fetchData = async () => {
    const userRef = collection(db, "users");
    const q = query(userRef);
    // setLoading(true);
    try {
      const querySnapshot = await getDocs(q);
      const posts = [];
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          posts.push(doc.data());
        });
        setUserData(posts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
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
      <Posts userData={userData} />
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({});
