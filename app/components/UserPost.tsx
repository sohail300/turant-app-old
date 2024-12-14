import { View, Text } from "react-native";
import { useEffect, useState} from "react";
import { FlatList } from "react-native-gesture-handler";
import Card from "./Card";
import { baseURL } from "@/constants/config";
import { useSelector } from "react-redux";

const UserPost = ({ ...props }) => {
  const token = useSelector((state) => state.token.data);
  const limit = 10;
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(false); // To avoid duplicate requests
  const [hasMore, setHasMore] = useState(true); // To stop fetching if no more data
  const [data, setData] = useState([]);
  // const [data, setData] = useState([
  //   {
  //     id: 1,
  //     heading:
  //       "Beyond Economics, Dr Bibek Debroy's Tongue-In-Cheek Take On Current Events",
  //     imageUrl:
  //       "https://fl-i.thgim.com/public/incoming/svh489/article68831258.ece/alternates/LANDSCAPE_1200/Bibek%20Debroy%20Obit.jpg",
  //     author: "Rahul Kumar",
  //     authorImage:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
  //     content:
  //       "A being with a thousand heads, a thousand eyes and a thousand feet 'surrounds the entire universe yet there is more of him that is left over'. Dr Bibek Debroy's explanation of the Supreme in one of his around 50 books",
  //     details: "Ranchi, Jharkhand | 1 Nov 2024 | 2:00 PM",
  //   },
  //   {
  //     id: 2,
  //     heading:
  //       "Beyond Economics, Dr Bibek Debroy's Tongue-In-Cheek Take On Current Events",
  //     imageUrl:
  //       "https://fl-i.thgim.com/public/incoming/svh489/article68831258.ece/alternates/LANDSCAPE_1200/Bibek%20Debroy%20Obit.jpg",
  //     author: "Rahul Kumar",
  //     authorImage:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
  //     content:
  //       "A being with a thousand heads, a thousand eyes and a thousand feet 'surrounds the entire universe yet there is more of him that is left over'. Dr Bibek Debroy's explanation of the Supreme in one of his around 50 books",
  //     details: "Ranchi, Jharkhand | 1 Nov 2024 | 2:00 PM",
  //   },
  //   {
  //     id: 3,
  //     heading:
  //       "Beyond Economics, Dr Bibek Debroy's Tongue-In-Cheek Take On Current Events",
  //     imageUrl:
  //       "https://fl-i.thgim.com/public/incoming/svh489/article68831258.ece/alternates/LANDSCAPE_1200/Bibek%20Debroy%20Obit.jpg",
  //     author: "Rahul Kumar",
  //     authorImage:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
  //     content:
  //       "A being with a thousand heads, a thousand eyes and a thousand feet 'surrounds the entire universe yet there is more of him that is left over'. Dr Bibek Debroy's explanation of the Supreme in one of his around 50 books",
  //     details: "Ranchi, Jharkhand | 1 Nov 2024 | 2:00 PM",
  //   },
  // ]);

  async function getData(initialLoad = false) {
    if (loading || !hasMore) return; // Avoid fetching if already loading or no more data
    setLoading(true);

    try {
      const request = await fetch(`${baseURL}/user/own-posts`,{
        method : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body : JSON.stringify({
          limit : limit,
          offset : offset
        })
      })
      const response = await request.json();
      const posts = response.posts[0].posts;
      console.log(posts)
      if (posts.length === 0) {
        setHasMore(false); // No more data to load
      } else {
        setData((prevData) => (initialLoad ? posts : [...prevData, ...posts]));
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
      keyExtractor={(item) => String(item.id)}
      data={data}
      ListEmptyComponent={<Text style={{textAlign : 'center', paddingVertical : 4, backgroundColor :  'white'}}>No Posts</Text>}
      renderItem={({ item }) => (
        <Card
          heading={item.heading}
          imageUrl={item.imageUrl}
          content={item.content}
          author={item.author}
          authorImage={item.authorImage}
          details={item.details}
        />
      )}
    />
  );
};

export default UserPost;
