import React, { Component, useEffect, useState } from "react";
import {
  StyleSheet,
  Platform,
  Image,
  ScrollView,
  FlatList,
  TextInput,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import * as ProfileAction from "../../store/actions/profile";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as UserActions from "../../store/actions/users";
import * as FacilitiesActions from "../../store/actions/facilities";

import {
  Container,
  Header,
  View,
  DeckSwiper,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Icon,
  Content,
  H1,
  H2,
  H3,
  Button,
  ListItem,
  DatePicker,
  Input,
  Form,
  Label,
} from "native-base";

import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { resetData } from "../../store/actions/BuildingMap";
import { State } from "react-native-gesture-handler";

// const dataFromServer = {};
const DummyDataFromServer = {
  "2020-08-09": [{ name: "Zumba", time: new Date("1995-12-17T03:24:00") }],
  "2020-08-10": [{ name: "MMA" }],
  "2020-08-11": [],
  "2020-08-12": [{ name: "Crossfit" }, { name: "Zumba" }],
  "2020-08-13": [{ name: "Zumba" ,  time: new Date("1995-12-17T03:24:00") }],
  "2020-08-14": [{ name: "MMA" }],
  "2020-08-11": [{ name: "New MMA" }],
  "2020-08-12": [{ name: "Kick Box" }],
};

const Home = (props) => {
  const dispatch = useDispatch();

  const [master, setIsMaster] = useState();
  const [day2Display, setDay2Display] = useState(0);

  const user = useSelector((state) => state.users.usid);
  const classArr = useSelector((state) => state.clas.myClasses);
  /*
  @param dataFromServerKeys - array of keys, for example: ["2020-05-09","2020-05-10","2020-05-11","2020-05-12","2020-06-11","2020-06-12"]
  */
  const markItems = (dataFromServerKeys) => {
    const markedDays = {};
    for (let i = 0; i < dataFromServerKeys.length; i++) {
      const key = dataFromServerKeys[i];
      markedDays[key] = { marked: true };
    }
    return markedDays;
  };

  const fetchClass = async () => {
    await dispatch(FacilitiesActions.fetchClasses());

    for (let i = 0; i < classArr.length; i++) {
      var arr = [
        {
          name: classArr[i].desc,
          time: classArr[i].time,
        },
      ];
      if (!dataFromServer[classArr[1]]) {
        dataFromServer[classArr[1]] = arr;
      } else {
        dataFromServer[classArr[1]].push({ name: classArr[3] });
      }
    }

    for (var i = 0; i < dataFromServer.length; i++) {
      var new_key = classArr[i].date;
      var old_key = "Class";
      if (old_key !== new_key) {
        Object.defineProperty(
          dataFromServer,
          new_key,
          Object.getOwnPropertyDescriptor(dataFromServer, old_key)
        );
        delete dataFromServer[old_key];
      }
    }
  };

  const addEvent = async (
    _dataFromServer,
    eventDate,
    eventTime,
    eventDetalis
  ) => {
    var obj = {
      date: eventDate,
      time: eventTime,
      name: eventDetalis,
    };

    // console.log("dataFromServer is ", dataFromServer);
    let newData = Object.assign({}, dataFromServer);
    // console.log("object is ", newData);
    if (newData[eventDate]) {
      newData[eventDate].push(obj);
    } else {
      newData[eventDate] = [obj];
    }
    setDummyData(newData);

    return dataFromServer;
  };

  const profiles = async () => {
    try {
      await dispatch(ProfileAction.fetchProfiles());
    } catch (err) {
      console.log(err);
    }
  };

  const isAdmin = async () => {
    try {
      await dispatch(UserActions.fetchUsers());
      if (user.admin === "true") {
        setIsMaster(true);
      } else {
        setIsMaster(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    profiles();
    isAdmin();
    // fetchClass();
  }, []);

  const [value, onChangeText] = useState("");
  const [pickedDate, setPickedDate] = useState(new Date());
  const [dataFromServer, setDummyData] = useState(DummyDataFromServer);

  // console.log("DummyData is", dataFromServer);

  const dateExtractor = (myDate) => {
    var dd = myDate.getDate();
    var mm = myDate.getMonth() + 1;
    var yyyy = myDate.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    var formatedDate = yyyy + "-" + mm + "-" + dd;

    return formatedDate;
  };

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [timeBTNshow, seTtimeBTNshow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    seTtimeBTNshow(true);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
    // console.log(getTimeString(date));
  };

  const getTimeString = (date) => {
    if (!date) {
      return "00:00";
    }

    console.log("date is ", date);

    let minuts = date.getMinutes();
    let hours = date.getHours();
    if (minuts < 10) {
      minuts = "0" + minuts;
    }
    if (hours < 10) {
      hours = "0" + hours;
    }
    return hours + ":" + minuts;
  };

  if (isAdmin) {
    return (
      <Container>
        <Content>
          <View style={styles.container}>
            <H1>Create Event</H1>
            <View style={styles.topContainer}>
              <DatePicker
                defaultDate={new Date()}
                locale={"il"}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={"fade"}
                androidMode={"default"}
                placeHolderText="Select date"
                textStyle={{ color: "green" }}
                placeHolderTextStyle={{ color: "#d3d3d3" }}
                onDateChange={setPickedDate}
                disabled={false}
              />
              <Button onPress={showTimepicker} title="Show time picker!">
                <Text>{!timeBTNshow ? "Event time" : getTimeString(date)}</Text>
              </Button>

              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  timeZoneOffsetInMinutes={0}
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>
            <View style={styles.midContainer}>
              <TextInput
                style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                onChangeText={(text) => onChangeText(text)}
                value={value}
                placeholder={"Enter event here"}
              />
            </View>
            <Button
              onPress={() => {
                let tim = date;
                let dt = dateExtractor(pickedDate);
                addEvent(dataFromServer, dt, tim, value);
                //console.log(dataFromServer);
              }}
              style={styles.btn}
            >
              <Text>Add</Text>
            </Button>
          </View>
          <View>
            <Card style={{ flex: 0 }}>
              <CardItem>
                <Left>
                  <Thumbnail source={require("../../assets/pics/gym.png")} />
                  <Body>
                    <Text>Buildin</Text>
                    <Text note>Gym</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem>
                <Body>
                  <Image
                    source={require("../../assets/pics/gym2.jpg")}
                    style={{ height: 200, width: 200, flex: 1 }}
                  />
                  <Text> </Text>
                  <Text>Welcom To The Gym</Text>
                  <Text> </Text>
                  <Text>Open every day 8:00 to 17:00</Text>
                </Body>
              </CardItem>
              <CardItem>
                <Left>
                  <Button transparent textStyle={{ color: "#87838B" }}>
                    <Icon name="logo-github" />
                    <Text>5 stars facility</Text>
                  </Button>
                </Left>
              </CardItem>
            </Card>
          </View>
          <View style={styles.pad}>
            <Agenda
              // The list of items that have to be displayed in agenda. If you want to render item as empty date
              // the value of date key has to be an empty array []. If there exists no value for date key it is
              // considered that the date in question is not yet loaded
              items={dataFromServer}
              // Callback that gets called on day press
              onDayPress={(day) => {
                setDay2Display(day.timestamp);
                // console.log("day pressed " + JSON.stringify(day));
              }}
              // Callback that gets called when day changes while scrolling agenda list
              onDayChange={(day) => {
                // console.log("day changed");
              }}
              // Max amount of months allowed to scroll to the past. Default = 50
              pastScrollRange={0}
              // Max amount of months allowed to scroll to the future. Default = 50
              futureScrollRange={1}
              // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
              renderItem={(item, firstItemInDay) => {
                //console.log("got called with: " + item.name);

                return (
                  <ScrollView>
                    <Card>
                      <CardItem>
                        <Body>
                          <Text>
                            {console.log("time obj is ",item.time)}
                            {getTimeString(item.time) + "  -   " + item.name}
                          </Text>
                        </Body>
                      </CardItem>
                    </Card>
                  </ScrollView>
                );
              }}
              // Specify how each date should be rendered. day can be undefined if the item is not first in that day.
              renderDay={(day, item) => {
                if (!day) {
                  return null;
                }
                return (
                  <View style={styles.dayTxt}>
                    <Text> {day.day + "/" + day.month + "    "}</Text>
                  </View>
                );
              }}
              // Specify how empty date content with no items should be rendered
              renderEmptyDate={() => {
                return <Text></Text>;
              }}
              // Specify what should be rendered instead of ActivityIndicator
              renderEmptyData={() => {
                return (
                  <View>
                    <Card>
                      <CardItem>
                        <Body>
                          <Text>No Hugim today!</Text>
                        </Body>
                      </CardItem>
                    </Card>
                  </View>
                );
              }}
              // Specify your item comparison function for increased performance
              rowHasChanged={(r1, r2) => {
                return r1.text !== r2.text;
              }}
              // By default, agenda dates are marked if they have at least one item, but you can override this if needed
              markedDates={markItems(Object.keys(dataFromServer))}
              // Agenda theme
              theme={{
                agendaDayTextColor: "yellow",
                agendaDayNumColor: "green",
                agendaTodayColor: "red",
                agendaKnobColor: "blue",
              }}
              // Agenda container style
              style={{}}
            />
          </View>
        </Content>
      </Container>
    );
  } else {
    return (
      <Container>
        <Content>
          <View>
            <Card style={{ flex: 0 }}>
              <CardItem>
                <Left>
                  <Thumbnail source={require("../../assets/pics/gym.png")} />
                  <Body>
                    <Text>Buildin</Text>
                    <Text note>Gym</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem>
                <Body>
                  <Image
                    source={require("../../assets/pics/gym2.jpg")}
                    style={{ height: 200, width: 200, flex: 1 }}
                  />
                  <Text> </Text>
                  <Text>Welcom To The Gym</Text>
                  <Text> </Text>
                  <Text>Open every day 8:00 to 17:00</Text>
                </Body>
              </CardItem>
              <CardItem>
                <Left>
                  <Button transparent textStyle={{ color: "#87838B" }}>
                    <Icon name="logo-github" />
                    <Text>5 stars facility</Text>
                  </Button>
                </Left>
              </CardItem>
            </Card>
          </View>
          <View style={styles.pad}>
            <Agenda
              // The list of items that have to be displayed in agenda. If you want to render item as empty date
              // the value of date key has to be an empty array []. If there exists no value for date key it is
              // considered that the date in question is not yet loaded
              items={dataFromServer}
              // Callback that gets called on day press
              onDayPress={(day) => {
                setDay2Display(day.timestamp);
                // console.log("day pressed " + JSON.stringify(day));
              }}
              // Callback that gets called when day changes while scrolling agenda list
              onDayChange={(day) => {
                // console.log("day changed");
              }}
              // Max amount of months allowed to scroll to the past. Default = 50
              pastScrollRange={0}
              // Max amount of months allowed to scroll to the future. Default = 50
              futureScrollRange={1}
              // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
              renderItem={(item, firstItemInDay) => {
                //console.log("got called with: " + item.name);

                return (
                  <ScrollView>
                    <Card>
                      <CardItem>
                        <Body>
                          <Text>
                            
                            {getTimeString(date) + "  -   " + item.name}
                          </Text>
                        </Body>
                      </CardItem>
                    </Card>
                  </ScrollView>
                );
              }}
              // Specify how each date should be rendered. day can be undefined if the item is not first in that day.
              renderDay={(day, item) => {
                if (!day) {
                  return null;
                }
                return (
                  <View style={styles.dayTxt}>
                    <Text> {day.day + "/" + day.month + "    "}</Text>
                  </View>
                );
              }}
              // Specify how empty date content with no items should be rendered
              renderEmptyDate={() => {
                return <Text>test</Text>;
              }}
              // Specify what should be rendered instead of ActivityIndicator
              renderEmptyData={() => {
                return (
                  <View>
                    <Card>
                      <CardItem>
                        <Body>
                          <Text>No Hugim today!</Text>
                        </Body>
                      </CardItem>
                    </Card>
                  </View>
                );
              }}
              // Specify your item comparison function for increased performance
              rowHasChanged={(r1, r2) => {
                return r1.text !== r2.text;
              }}
              // By default, agenda dates are marked if they have at least one item, but you can override this if needed
              markedDates={markItems(Object.keys(dataFromServer))}
              // Agenda theme
              theme={{
                agendaDayTextColor: "yellow",
                agendaDayNumColor: "green",
                agendaTodayColor: "red",
                agendaKnobColor: "blue",
              }}
              // Agenda container style
              style={{}}
            />
          </View>
        </Content>
      </Container>
    );
  }
};

Home.navigationOptions = (navData) => {
  return {
    headerTitle: "Home",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  card: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },
  title: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    padding: 50,
    alignItems: "center",
  },
  dayTxt: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  topContainer: {
    backgroundColor: "beige",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "80%",
    padding: 10,
    margin: 10,
    flex: 1,
    alignItems: "center",
  },
  midContainer: {
    width: "80%",
    backgroundColor: "beige",
    padding: 10,
    margin: 10,
    flex: 1,
  },
  container: {
    alignContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 10,
  },
  btn: {
    width: "50%",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-around",
  },
  pad: {
    padding: 10,
    marginBottom: 10,
  },
});

export default Home;
