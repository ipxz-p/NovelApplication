import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { useDispatch } from "react-redux";
import { changeNovelId, gotoCategory, changeImgFromNovelId } from "../store/actions/paramsAction";
import { useSelector } from "react-redux";




const HomeScreen = ({ route, navigation }) => {
  const ageFromUserId = useSelector((state) => state.params.ageFromUserId)
  const [Novel, setNovel] = useState([]);
  const [Recommend, setRecommend] = useState([]);
  const NewNovel = Novel.length - 1;
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://10.0.2.2:3500/novel/getNovels")
        .then((response) => {
          // จัดเรียงข้อมูลตามที่คุณต้องการ
          const sortedData = response.data.sort((a, b) =>  b.chapterViewsSum - a.chapterViewsSum);
  
          // กำหนดข้อมูลที่ถูกจัดเรียงให้กับ state
          setNovel(sortedData);
          setRecommend(sortedData);
        })
        .catch((err) => console.log(err));
    };
  
    fetchData();

    // Set up an interval to fetch data every second
    const intervalId = setInterval(() => {
      fetchData();
    }, 3000); // 1000 milliseconds = 1 second

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const gotoCategoryHandler = (navigation, categoryType) => {
    dispatch(gotoCategory(categoryType));
    navigation.navigate("CatagorysNavigators");
  };

  const novelIdHandler = (navigation, novelId) => {
    dispatch(changeNovelId(novelId));
    navigation.navigate("IndexFiction");
  };

  //นิยายรัก ดึง title views like
  const renderLoveCatagory = ({ item }) => {
    return item.category === "love" ? (
      <View>
        <TouchableOpacity
          onPress={() => {
            novelIdHandler(navigation, item._id);
          }}
        >
          {/* Card */}
          <View style={styles.cardfiction}>
            <Image
              style={styles.imagecardfiction}
              source={{ uri: `http://10.0.2.2:3500/img/${item.images}`}}
            />
            <View>
              <Text style={styles.titlecardfiction}>{item.title}</Text>
            </View>
            <View style={styles.usercardfiction}>
              <FontAwesome5 name="user-alt" size={16} color="#909090" />
              <Text style={styles.txtcardfiction}> {item.owner.username}</Text>
            </View>
            <View style={styles.count}>
              <Ionicons name="eye" size={18} color="#909090" />
              <Text style={styles.txtcardfiction}> {item.chapterViewsSum} </Text>
              <Ionicons name="heart-sharp" size={18} color="#909090" />
              <Text style={styles.txtcardfiction}> {item.chapterLikeSum} </Text>
            </View>
          </View>
          {/* End Card */}
        </TouchableOpacity>
      </View>
    ) : null;
  };

  const renderAdultCatagory = ({ item }) => {
    return item.category === "adult" && ageFromUserId > 18 ?  (
      <View>
        <TouchableOpacity
          onPress={() => {
            novelIdHandler(navigation, item._id);
            
          }}
        >
          {/* Card */}
          <View style={styles.cardfiction}>
            <Image
              style={styles.imagecardfiction}
              source={{ uri: `http://10.0.2.2:3500/img/${item.images}`}}
            />
            <View>
              <Text style={styles.titlecardfiction}>{item.title}</Text>
            </View>
            <View style={styles.usercardfiction}>
              <FontAwesome5 name="user-alt" size={16} color="#909090" />
              <Text style={styles.txtcardfiction}> {item.owner.username}</Text>
            </View>
            <View style={styles.count}>
              <Ionicons name="eye" size={18} color="#909090" />
              <Text style={styles.txtcardfiction}> {item.chapterViewsSum} </Text>
              <Ionicons name="heart-sharp" size={18} color="#909090" />
              <Text style={styles.txtcardfiction}> {item.like.length} </Text>
            </View>
          </View>
          {/* End Card */}
        </TouchableOpacity>
      </View>
    ) : null;
  };

  const renderFantasyCatagory = ({ item }) => {
    return item.category === "fantasy" ? (
      <View>
        <TouchableOpacity
          onPress={() => {
            novelIdHandler(navigation, item._id);
          }}
        >
          {/* Card */}
          <View style={styles.cardfiction}>
            <Image
              style={styles.imagecardfiction}
              source={{ uri: `http://10.0.2.2:3500/img/${item.images}`}}
            />
            <View>
              <Text style={styles.titlecardfiction}>{item.title}</Text>
            </View>
            <View style={styles.usercardfiction}>
              <FontAwesome5 name="user-alt" size={16} color="#909090" />
              <Text style={styles.txtcardfiction}> {item.owner.username}</Text>
            </View>
            <View style={styles.count}>
              <Ionicons name="eye" size={18} color="#909090" />
              <Text style={styles.txtcardfiction}> {item.chapterViewsSum} </Text>
              <Ionicons name="heart-sharp" size={18} color="#909090" />
              <Text style={styles.txtcardfiction}> {item.like.length} </Text>
            </View>
          </View>
          {/* End Card */}
        </TouchableOpacity>
      </View>
    ) : null;
  };

  const renderInvestigateCatagory = ({ item }) => {
    return item.category === "investigate" ? (
      <View>
        <TouchableOpacity
          onPress={() => {
            novelIdHandler(navigation, item._id);
          }}
        >
          {/* Card */}
          <View style={styles.cardfiction}>
            <Image
              style={styles.imagecardfiction}
              source={{ uri: `http://10.0.2.2:3500/img/${item.images}`}}
            />
            <View>
              <Text style={styles.titlecardfiction}>{item.title}</Text>
            </View>
            <View style={styles.usercardfiction}>
              <FontAwesome5 name="user-alt" size={16} color="#909090" />
              <Text style={styles.txtcardfiction}> {item.owner.username}</Text>
            </View>
            <View style={styles.count}>
              <Ionicons name="eye" size={18} color="#909090" />
              <Text style={styles.txtcardfiction}> {item.chapterViewsSum} </Text>
              <Ionicons name="heart-sharp" size={18} color="#909090" />
              <Text style={styles.txtcardfiction}> {item.like.length} </Text>
            </View>
          </View>
          {/* End Card */}
        </TouchableOpacity>
      </View>
    ) : null;
  };

  const renderYCatagory = ({ item }) => {
    return item.category === "y" ? (
      <View>
        <TouchableOpacity
          onPress={() => {
            novelIdHandler(navigation, item._id);
          }}
        >
          {/* Card */}
          <View style={styles.cardfiction}>
            <Image
              style={styles.imagecardfiction}
              source={{ uri: `http://10.0.2.2:3500/img/${item.images}`}}
            />
            <View>
              <Text style={styles.titlecardfiction}>{item.title}</Text>
            </View>
            <View style={styles.usercardfiction}>
              <FontAwesome5 name="user-alt" size={16} color="#909090" />
              <Text style={styles.txtcardfiction}> {item.owner.username}</Text>
            </View>
            <View style={styles.count}>
              <Ionicons name="eye" size={18} color="#909090" />
              <Text style={styles.txtcardfiction}> {item.chapterViewsSum} </Text>
              <Ionicons name="heart-sharp" size={18} color="#909090" />
              <Text style={styles.txtcardfiction}> {item.like.length} </Text>
            </View>
          </View>
          {/* End Card */}
        </TouchableOpacity>
      </View>
    ) : null;
  };

  const renderRecommend = ({ item }) => {
    return (
      <View style={styles.box}>
            <Image
              style={styles.titleimage}
              source={{ uri: `http://10.0.2.2:3500/img/${item.images}`}}
            />
            <View style={styles.box2}>
              <Text style={styles.txt1}>{item.title}</Text>
              <View style={styles.user}>
                <FontAwesome5 name="user-alt" size={17} color="#fff" />
                <Text style={styles.txt2}>
                  {" "}
                  {item.owner.username}
                </Text>
              </View>

              <View style={styles.fictionlove}>
                <Text style={styles.txt3}>
                  {item.category == "love"
                    ? "นิยายรัก"
                    : Novel[NewNovel].category == "adult"
                    ? "นิยาย18+"
                    : Novel[NewNovel].category == "y"
                    ? "นิยายวาย"
                    : Novel[NewNovel].category == "fantasy"
                    ? "นิยายแฟนตาซี"
                    : Novel[NewNovel].category == "investigate"
                    ? "นิยายสืบสวน"
                    : "error"}
                </Text>
              </View>

              <View style={styles.count2}>
              <Ionicons name="eye" size={18} color="#fff" />
              <Text style={styles.txtcardfiction2}> {item.chapterViewsSum} </Text>
              <Ionicons name="heart-sharp" size={18} color="#fff" />
              <Text style={styles.txtcardfiction2}> {item.like.length} </Text>
            </View>

              <LinearGradient
                colors={["#FBBC2C", "#FE8F7C"]}
                style={styles.btnreadgradient}
              >
                <TouchableOpacity
                  onPress={() => {
                    novelIdHandler(navigation, item._id);
                  }}
                  style={styles.btnreadnow}
                >
                  <Text style={styles.btnreadnowtext}>อ่านเลย</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
    );
  };
  
  
  return (
    <View>
      <ScrollView>
        {/* Top of the week */}
        <LinearGradient colors={["#5652C9", "#8151C5"]}>
          <Text style={styles.title}>นิยายยอดนิยม !</Text>
          {/* ตรงนี้ */}
          <ScrollView horizontal={true}>
            <View style={styles.rcmfiction}>
              <FlatList
                data={Novel}
                keyExtractor={(item) => item._id}
                renderItem={renderRecommend}
                numColumns={14}
              />
            </View>
          </ScrollView>
        </LinearGradient>

        {/* somecomponent */}
        <View style={styles.somecomponent}>
          {/* หมวดหมู่ */}
          <Text style={styles.titleofall}>หมวดหมู่</Text>
          <View style={styles.category}>
            <TouchableOpacity
              onPress={() => {
                gotoCategoryHandler(navigation, "love");
              }}
            >
              <View style={styles.categoryitem}>
                <Image
                  style={styles.categoryimage}
                  source={require("../assets/love.png")}
                />
                <Text>รัก</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { ageFromUserId > 18 ?
                gotoCategoryHandler(navigation, "adult") : null;
              }}
            >
              <View style={styles.categoryitem}>
                <Image
                  style={styles.categoryimage}
                  source={require("../assets/sex.png")}
                />
                <Text>18+</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                gotoCategoryHandler(navigation, "y");
              }}
            >
              <View style={styles.categoryitem}>
                <Image
                  style={styles.categoryimage}
                  source={require("../assets/why.png")}
                />
                <Text>วาย</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                gotoCategoryHandler(navigation, "fantasy");
              }}
            >
              <View style={styles.categoryitem}>
                <Image
                  style={styles.categoryimage}
                  source={require("../assets/fantasy.png")}
                />
                <Text>แฟนตาซี</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                gotoCategoryHandler(navigation, "investigate");
              }}
            >
              <View style={styles.categoryitem}>
                <Image
                  style={styles.categoryimage}
                  source={require("../assets/investigate.png")}
                />
                <Text>สืบสวน</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* ตอนใหม่ */}
          {/* <Text style={styles.titleofall}>ตอนใหม่</Text>
        <ScrollView horizontal={true} >
          <TouchableOpacity onPress={() => { navigation.navigate("ChapterFiction")}}>
          <View style={styles.newchapter}>
          <View style={styles.cardchapter}>
            <Image style={styles.imagecardchapter} source={{ uri: 'https://media.discordapp.net/attachments/1133035711919038534/1150913957478006806/large.png?width=562&height=562'}} />
            <View>
              <Text style={styles.titlecardchapter}>รักเธอที่สุด นายมาเฟีย</Text>
              <Text style={styles.chaptercardchapter}>ตอนที่1 แต่งงานกันนะไอต้าว</Text>
              <View style={styles.ctfictionlove}>
                <Text style={styles.txt3}>นิยายรัก</Text>
              </View>
            </View>
          </View>
        </View>
          </TouchableOpacity>
        </ScrollView> */}

          {/* นิยายแนะนำ */}
          {/* <Text style={styles.titleofall}>แนะนำนิยายสำหรับคุณ</Text>
          <ScrollView horizontal={true}>
            <View style={styles.rcmfiction}>
              <View style={styles.cardfiction}>
                <Image
                  style={styles.imagecardfiction}
                  source={{
                    uri: "https://media.discordapp.net/attachments/1133035711919038534/1150913957478006806/large.png?width=562&height=562",
                  }}
                />
                <View>
                  <Text style={styles.titlecardfiction}>
                    รักเธอที่สุด นายมาเฟีย
                  </Text>
                </View>
                <View style={styles.usercardfiction}>
                  <FontAwesome5 name="user-alt" size={16} color="#909090" />
                  <Text style={styles.txtcardfiction}> ingfah bbibbi</Text>
                </View>
                <View style={styles.count}>
                  <Ionicons name="eye" size={18} color="#909090" />
                  <Text style={styles.txtcardfiction}> 302k </Text>
                  <Ionicons name="heart-sharp" size={18} color="#909090" />
                  <Text style={styles.txtcardfiction}> 982</Text>
                </View>
              </View>
            </View>
          </ScrollView> */}


          



          {/* หมวดหมู่นิยาย */}
          <Text style={styles.titleofall}>หมวดหมู่นิยาย</Text>
          {/* นิยายรัก */}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 10, marginTop: 10, width: '40%' }}>นิยายรัก</Text>
            
          </View>
          
          {/* ScrollView ไว้ copy */}
          <ScrollView horizontal={true}>
            <View style={styles.rcmfiction}>
              {/* Card */}
              <FlatList
                data={Novel}
                keyExtractor={(item) => item._id}
                renderItem={renderLoveCatagory}
                numColumns={14}
              />
              {/* End Card */}
            </View>
          </ScrollView>

          {/* นิยาย 18+ */}
          {ageFromUserId > 18 && <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 10, marginTop: 10, width: '40%' }}>นิยาย18+</Text>
            
          </View>}
          {/* ScrollView ไว้ copy */}
          <ScrollView horizontal={true}>
            <View style={styles.rcmfiction}>
              {/* Card */}
              <FlatList
                data={Novel}
                keyExtractor={(item) => item._id}
                renderItem={renderAdultCatagory}
                numColumns={14}
              />
              {/* End Card */}
            </View>
          </ScrollView>

          {/* นิยายวาย */}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 10, marginTop: 10, width: '40%' }}>นิยายวาย</Text>
            
          </View>
          {/* ScrollView ไว้ copy */}
          <ScrollView horizontal={true}>
            <View style={styles.rcmfiction}>
              {/* Card */}
              <FlatList
                data={Novel}
                keyExtractor={(item) => item._id}
                renderItem={renderYCatagory}
                numColumns={14}
              />
              {/* End Card */}
            </View>
          </ScrollView>

          {/* นิยายแฟนตาซี */}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 10, marginTop: 10, width: '40%' }}>นิยายแฟนตาซี</Text>
            
          </View>
          {/* ScrollView ไว้ copy */}
          <ScrollView horizontal={true}>
            <View style={styles.rcmfiction}>
              {/* Card */}
              <FlatList
                data={Novel}
                keyExtractor={(item) => item._id}
                renderItem={renderFantasyCatagory}
                numColumns={14}
              />
              {/* End Card */}
            </View>
          </ScrollView>

          {/* นิยายสืบสวน */}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 10, marginTop: 10, width: '40%' }}>นิยายสืบสวน</Text>
          
          </View>
          {/* ScrollView ไว้ copy */}
          <ScrollView horizontal={true}>
            <View style={styles.rcmfiction}>
              {/* Card */}
              <FlatList
                data={Novel}
                keyExtractor={(item) => item._id}
                renderItem={renderInvestigateCatagory}
                numColumns={14}
              />
              {/* End Card */}
            </View>
          </ScrollView>

          {/* tag close somecomponent */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 6,
  },
  titleimage: {
    width: 130,
    height: 190,
    borderRadius: 10,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    paddingLeft: 25,
    paddingTop: 20,
  },
  box: {
    backgroundColor: "#856BD1",
    flexDirection: "row",
    margin: 20,
    padding: 20,
    borderRadius: 20,
    width: 355
  },
  box2: {
    marginLeft: 20,
    marginTop: 7,
  },
  txt1: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 16,
  },
  txt2: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 16,
  },
  txt3: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  txt4: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 4,
    marginRight: 10,
  },
  fiction: {
    flexDirection: "row",
  },
  count: {
    flexDirection: "row",
  },
  count2: {
    flexDirection: "row",
    marginBottom:10,
    marginTop: 10
  },
  user: {
    flexDirection: "row",
  },
  fictionlove: {
    backgroundColor: "#F8C678",
    width: 100,
    height: 25,
    borderRadius: 8,
    marginRight: 5,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fictionsex: {
    backgroundColor: "#F8C678",
    width: 100,
    height: 25,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnreadgradient: {
    borderRadius: 8,
  },
  btnreadnowtext: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  btnreadnow: {
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  somecomponent: {
    backgroundColor: "#F9F5F5",
  },
  categoryimage: {
    width: 65,
    height: 65,
    borderRadius: 100,
  },
  categoryitem: {
    alignItems: "center",
    margin: 4,
  },
  category: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 10,
  },
  titleofall: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 10,
  },
  // Card Chapter
  newchapter: {
    flexDirection: "row",
  },
  imagecardchapter: {
    width: 150,
    height: 150,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cardchapter: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: "white",
    width: 160,
    //มีขอบแล้วมันแปกไม่ค่อยสวย5555555555
    // borderWidth: 1,
    // borderColor: '#5652C9',
    padding: 5,
  },
  titlecardchapter: {
    fontSize: 15,
    marginTop: 4,
    fontWeight: "bold",
  },
  ctfictionlove: {
    backgroundColor: "#EEBED3",
    width: 70,
    height: 25,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  // Card Fiction All
  rcmfiction: {
    flexDirection: "row",
  },
  cardfiction: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: "white",
    width: 160,
    padding: 5,
  },
  usercardfiction: {
    flexDirection: "row",
    marginBottom: 4,
  },
  imagecardfiction: {
    width: 150,
    height: 150,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  titlecardfiction: {
    fontSize: 15,
    marginTop: 4,
    fontWeight: "bold",
    marginBottom: 4,
  },
  txtcardfiction: {
    color: "#7B7D7D",
  },
  txtcardfiction2: {
    color: "#fff",
    
  },
  chaptercardchapter: {
    marginBottom: 5,
  },
});

export default HomeScreen;
