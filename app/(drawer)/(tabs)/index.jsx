import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";

import Posts from "../../../components/Home/Posts";

const index = () => {
  return (
    <ScrollView>
      <Posts />
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({});
