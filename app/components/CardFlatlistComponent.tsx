import { View, Text } from "react-native";
import React, { useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import Card from "./Card";

const CardFlatlistComponent = ({ data, ...props }) => {
  return (
    <View>
      <FlatList
        {...props}
        keyExtractor={(item) => item.id}
        data={data}
        renderItem={({ item }) => (
          <Card
            heading={item.heading}
            imageUrl={item.imageUrl}
            content={item.content}
            author={item.author}
            authorImage={item.authorImage}
            details={item.details}
            full={false}
          />
        )}
      />
    </View>
  );
};

export default CardFlatlistComponent;
