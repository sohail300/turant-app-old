import { View, Text } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import Card from "./Card";
import { AdCard } from "./AdComponent";

const CardFlatlistComponent = ({ data, ...props }) => {
  if (!data || data.length === 0) {
    return (
      <View style={{ padding: 16, alignItems: "center" }}>
        <Text>No posts available.</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        {...props}
        keyExtractor={(item, index) =>
          item.isAd ? `ad-${item.ad_id}-${index}` : item.post_id.toString()
        }
        data={data}
        renderItem={({ item }) =>
          item.isAd ? (
            <AdCard
              ad_id={item.ad_id}
              target_url={item.target_url}
              image={item.image}
              videoUrl={item.videoUrl}
            />
          ) : (
            <Card
              post_id={item.post_id}
              type={item.type}
              title={item.title}
              snippet={item.snippet}
              likes={item.likes}
              comments={item.comments}
              shares={item.shares}
              views={item.video_views}
              created_at={item.created_at}
              thumbnail={item.thumbnail}
              authorId={item.user.user_id}
              author={item.user.display_name}
              authorImage={item.user.image}
              liked={item?.liked}
              saved={item?.saved}
              full={false}
            />
          )
        }
      />
    </View>
  );
};

export default CardFlatlistComponent;
