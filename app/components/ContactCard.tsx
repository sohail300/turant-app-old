import { Colors } from "@/constants/Colors";
import { styles } from "@/constants/styles";
import { View, Text, Image } from "react-native";

const ContactCard = ({ name, number, state, district, block }) => {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: Colors.light.border,
        padding: 16,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderRadius: 8,
        gap: 32,
        marginBottom: 20,
      }}
    >
      <Image
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-WDVXiZSuSUUeURxbBZl4SvMnwmDNdO65LA&s",
        }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Text
          style={{
            ...styles.ContentText,
            fontFamily: "HindVadodara500",
            color: Colors.light.subheading,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            ...styles.ContentText2,
            color: Colors.light.accent,
            marginVertical: 2,
          }}
        >
          {number}
        </Text>
        <Text style={styles.ContentText2}>State- {state}</Text>
        <Text style={styles.ContentText2}>District- {district}</Text>
        <Text style={styles.ContentText2}>Block- {block}</Text>
      </View>
    </View>
  );
};

export default ContactCard;
