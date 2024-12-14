import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import Card from "./Card";
import { baseURL } from "@/constants/config";
import { useSelector } from "react-redux";

const UserPost = ({ ...props }) => {
  const token = useSelector((state) => state.token.data);
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false); // To avoid duplicate requests
  const [hasMore, setHasMore] = useState(true); // To stop fetching if no more data
  const [data, setData] = useState([]);

  async function getData(initialLoad = false) {
    if (loading || !hasMore) return; // Avoid fetching if already loading or no more data
    setLoading(true);

    try {
      const request = await fetch(`${baseURL}/user/own-posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: limit,
          offset: offset,
        }),
      });

      const response = await request.json();
      // console.log(response.posts[0].posts[0].user);

      if (response.posts[0].posts.length === 0) {
        setHasMore(false); // No more data to load
      } else {
        setData((prevData) =>
          initialLoad
            ? response.posts[0].posts
            : [...prevData, ...response.posts[0].posts]
        );
        setOffset((prevOffset) => prevOffset + limit); // Increment offset for next fetch
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData(true); // Initial load
  }, []); // Empty dependency array to run only once

  return (
    <FlatList
      {...props}
      keyExtractor={(item) => String(item.post_id)}
      data={data}
      ListEmptyComponent={
        <Text
          style={{
            textAlign: "center",
            paddingVertical: 4,
            backgroundColor: "white",
          }}
        >
          No Posts
        </Text>
      }
      renderItem={({ item }) => (
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
      )}
    />
  );
};

export default UserPost;
