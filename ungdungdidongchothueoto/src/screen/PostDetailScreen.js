import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  Modal,
  ScrollView,
  Image,
  FlatList,
  Text,
  TextInput,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {
  width,
  height,
  Region,
  formatMoney,
  openLink,
  call,
  sendEmail,
} from '../common/CommonComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
// import Detail from '../components/Detail';
// import Add from '../components/Add';
// import Edit from '../components/Edit';
// import ChooseTemplate from '../components/ChooseTemplate';
import Geocoder from 'react-native-geocoder';
import Axios from 'axios';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';

const api = Axios.create({
  baseURL: 'http:///10.0.2.2:8000/api/',
});
// const urlImage ="http:///10.0.2.2:8080/thueoto/public/Images/";

let CurrentSlide = 0;
let AnhxeSlide = 0;
let IntervalTime = 4000;

class PostDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anhxe: [],
      quangcao: [],
      nguoidung: [],
      chubaidang: [],
      binhluan: [],
      danhgia: '',
      sao: 5,
      hiendanhgia: false,
      hiensuabinhluan: false,
      hienbando: false,
      txtbinhluan: '',
      idbinhluan: 0,
      txtthembinhluan: '',
      chiduong: false,
      region: {
        latitude: parseFloat(this.props.Post.Lat),
        longitude: parseFloat(this.props.Post.Log),
        latitudeDelta: Region.latitudeDelta,
        longitudeDelta: Region.longitudeDelta,
      },
      destination: {
        latitude: parseFloat(this.props.Post.Lat),
        longitude: parseFloat(this.props.Post.Log),
        latitudeDelta: Region.latitudeDelta,
        longitudeDelta: Region.longitudeDelta,
      },
    };
  }

  flatList = createRef();
  flatListAnhxe = createRef();

  // TODO _goToNextPage()
  _goToNextPage = () => {
    try {
      if (CurrentSlide >= this.state.quangcao.length - 1) {
        CurrentSlide = -1;
      }
      if (AnhxeSlide >= this.state.anhxe.length - 1) {
        AnhxeSlide = -1;
      }
      this.flatList.current.scrollToIndex({
        index: ++CurrentSlide,
        animated: true,
      });
      this.flatListAnhxe.current.scrollToIndex({
        index: ++AnhxeSlide,
        animated: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  _startAutoPlay = () => {
    this._timerId = setInterval(this._goToNextPage, IntervalTime);
  };

  _stopAutoPlay = () => {
    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = null;
    }
  };

  onScroll() {
    console.log('lalala');
  }

  guiDanhGia = async () => {
    console.log(this.props.Post.Id);
    if (this.state.sao > 0 && this.state.sao <= 5) {
      api
        .post('guidanhgia', {
          IdUser: this.state.nguoidung[0].Id,
          IdBaiDang:parseInt (this.props.Post.Id),
          SoSao: this.state.sao,
        })
        .then((res) => {
          this.setState({
            hiendanhgia: false,
          });
        });
    }
  };

  loadDatabinhluan = async () => {
    api.post('binhluan', {IdBaiDang: this.props.Post.Id}).then((res) => {
      this.setState({
        binhluan: res.data,
      });
    });
  };

  capnhatbinhluan = async () => {
    if (this.state.txtbinhluan != '') {
      api
        .post('capnhatbinhluan', {
          Id: this.state.idbinhluan,
          NoiDung: this.state.txtbinhluan,
        })
        .then((res) => {
          this.setState({
            hiensuabinhluan: false,
            idbinhluan: 0,
            txtbinhluan: '',
          });
          this.loadDatabinhluan();
        });
    }
  };

  xoabinhluan = async () => {
    api
      .post('xoabinhluan', {
        Id: this.state.idbinhluan,
      })
      .then((res) => {
        this.setState({
          hiensuabinhluan: false,
          idbinhluan: 0,
          txtbinhluan: '',
        });
        this.loadDatabinhluan();
      });
  };

  thembinhluan = async () => {
    if (this.state.txtthembinhluan != '') {
      api
        .post('thembinhluan', {
          IdBaiDang: this.props.Post.Id,
          IdUser: this.state.nguoidung[0].Id,
          NoiDung: this.state.txtthembinhluan,
        })
        .then((res) => {
          this.setState({
            txtthembinhluan: '',
          });
          this.loadDatabinhluan();
        });
    }
  };

  clear() {
    if (this.google.getAddressText() != '') {
      this.google.clear();
      this.setState({
        region: {
          ...this.state.region,
          latitude: parseFloat(this.props.Post.Lat),
          longitude: parseFloat(this.props.Post.Log),
        },
      });
    }
  }

  chiduong = async () => {
    if (this.state.chiduong == false) {
      this.setState({
        chiduong: true,
      });
    } else {
      this.setState({
        chiduong: false,
      });
    }
  };

  async onDoublePress(coordinate, position) {
    var region = {
      latitudeDelta: Region.latitudeDelta,
      longitudeDelta: Region.longitudeDelta,
      latitude: coordinate.nativeEvent.coordinate.latitude,
      longitude: coordinate.nativeEvent.coordinate.longitude,
    };
    Geocoder.fallbackToGoogle('AIzaSyDNI_ZWPqvdS6r6gPVO50I4TlYkfkZdXh8');
    let ret = await Geocoder.geocodePosition({
      lat: coordinate.nativeEvent.coordinate.latitude,
      lng: coordinate.nativeEvent.coordinate.longitude,
    });
    this.setState({
      region: region,
    });
  }

  onStarRatingPress(rating) {
    this.setState({
      sao: rating,
    });
  }

  componentWillUnmount() {
    this._stopAutoPlay();
  }

  componentDidMount = async () => {
    var TenDangNhap = await AsyncStorage.getItem('@IdUser:key');
    BackHandler.removeEventListener('hardwareBackPress', function () {
      return true;
    });
    api
      .get('anhxe/' + this.props.Post.Id)
      .then((res) => {
        this.setState({
          anhxe: res.data,
        });
      })
      .catch((err) => console.log(err));
    this.loadDatabinhluan();
    api.get('quangcao').then((res) => {
      this.setState({
        quangcao: res.data,
      });
    });
    api.post('kiemtraid', {TenDangNhap: TenDangNhap}).then((res) => {
      this.setState({
        nguoidung: res.data,
      });
    });
    api.post('nguoidung', {Id: this.props.Post.IdUser}).then((res) => {
      this.setState({
        chubaidang: res.data,
      });
      console.log(res.data);
    });
    api.post('danhgia', {IdBaiDang: this.props.Post.Id}).then((res) => {
      this.setState({
        danhgia: res.data,
      });
    });
    Geolocation.getCurrentPosition(
      (position) => {
        var region = {
          latitudeDelta: Region.latitudeDelta,
          longitudeDelta: Region.longitudeDelta,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.setState({
          destination: region,
        });
      },
      (error) => {
        // See error code charts below.
        console.warn(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
    this._stopAutoPlay();
    this._startAutoPlay();
  };

  render() {
    return (
      <View style={styles.container}>
        {(() => {
          if (this.state.quangcao.length > 0) {
            return (
              <View
                style={{
                  width: width,
                  height: 80,
                  // backgroundColor:'red',
                  zIndex: 100,
                  position: 'absolute',
                }}>
                <FlatList
                  flatListRef={React.createRef()}
                  ref={this.flatList}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  style={{
                    width: width,
                    height: 80,
                    opacity: 1,
                  }}
                  data={this.state.quangcao}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() => {
                        openLink(item.Link);
                      }}
                      style={{width: width, height: 80}}>
                      <Image
                        style={{width: width, height: 80}}
                        resizeMode="stretch"
                        source={{
                          uri: item.Image,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                />
              </View>
            );
          }
        })()}

        <ScrollView
          keyboardShouldPersistTaps="always"
          style={[
            styles.container,
            {
              marginTop: this.state.quangcao.length > 0 ? 80 : 0,
              // height:500,
            },
          ]}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: width,
              height: 250,
            }}>
            <View
              style={{
                width: width,
                height: 40,
                backgroundColor: 'transparent',
                zIndex: 10,
                position: 'absolute',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name="chevron-back-sharp" size={27} color="white" />
              </TouchableOpacity>
              <View style={{flex: 14}}></View>
            </View>
            {(() => {
              if (this.state.anhxe.length > 0) {
                return (
                  <FlatList
                    flatListRef={React.createRef()}
                    ref={this.flatListAnhxe}
                    horizontal
                    pagingEnabled
                    style={{
                      width: width,
                      height: 250,
                      opacity: 1,
                    }}
                    data={this.state.anhxe}
                    renderItem={({item}) => (
                      <Image
                        style={{width: width, height: 250}}
                        resizeMode="stretch"
                        source={{
                          uri: item.Links,
                        }}
                      />
                    )}
                  />
                );
              } else {
                return (
                  <ContentLoader
                    speed={2}
                    width={500}
                    height={500}
                    viewBox="0 100 476 124"
                    backgroundColor="#ededed"
                    foregroundColor="#bfbbbb">
                    <Rect
                      width={500}
                      height={500}
                      stroke="black"
                      // rx="10"
                      // ry="10"
                    />
                  </ContentLoader>
                );
              }
            })()}
          </View>
          <View
            style={{
              height: 100,
              width: width,
              borderBottomColor: '#919191',
              borderBottomWidth: 0.5,
            }}>
            {(() => {
              if (this.props.Post.Tieude != '') {
                return (
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                      color: 'black',
                      fontFamily: 'UTM-DuepuntozeroBold',
                      fontSize: 17,
                    }}>
                    {' ' + this.props.Post.Tieude.toUpperCase()}
                  </Text>
                );
              }
            })()}

            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: '#C90927',
                fontFamily: 'UTM-DuepuntozeroBold',
                fontSize: 19,
              }}>
              {' ' + formatMoney(String(this.props.Post.Gia)) + ' VNĐ'}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: '#919191',
                fontFamily: 'UTM-DuepuntozeroBold',
                fontSize: 17,
              }}>
              {(() => {
                var startDate = new Date(this.props.Post.NgayDang);
                var endDate = new Date();
                var offset = endDate.getTime() - startDate.getTime();
                var totalDays = Math.round(offset / 1000 / 60 / 60 / 24);
                if (totalDays < 6) {
                  return ' ' + String(totalDays) + ' Ngày Trước ';
                } else {
                  return ' ' + this.props.Post.NgayDang;
                }
              })()}
            </Text>
          </View>
          <View
            style={{
              width: width,
              backgroundColor: 'white',
            }}>
            <View
              style={{
                width: width,
                height: 118,
                marginTop: 2,
              }}>
              {(() => {
                if (this.state.chubaidang.length > 0) {
                  return (
                    <View style={{flex: 1}}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                        }}>
                        <Image
                          source={{
                            uri:
                              this.state.chubaidang[0].AnhDaiDien != null
                                ? this.state.chubaidang[0].AnhDaiDien
                                : 'https://icons-for-free.com/iconfiles/png/512/home+page+profile+user+icon-1320184041392976124.png',
                          }}
                          style={{
                            flex: 2,
                            borderRadius: 250,
                            marginLeft: 5,
                            marginRight: 15,
                          }}
                        />
                        <View
                          style={{
                            flex: 13,
                            flexDirection: 'row',
                          }}>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={{
                              color: 'black',
                              fontFamily: 'UTM-DuepuntozeroBold',
                              fontSize: 17,
                            }}>
                            {this.state.chubaidang[0].HoVaTen != null
                              ? this.state.chubaidang[0].HoVaTen
                              : 'Anonymus User'}
                          </Text>
                        </View>
                      </View>
                      <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        contentContainerStyle={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: 'white',
                          marginTop: 10,
                        }}>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={{
                            color: 'black',
                            fontFamily: 'UVNCHUKY',
                            fontSize: 17,
                          }}>
                          {' Liên lạc:'}
                        </Text>
                        {(() => {
                          if (this.state.chubaidang[0].SDT != null) {
                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  call(this.state.chubaidang[0].SDT);
                                }}
                                activeOpacity={0.7}
                                style={{
                                  width: width / 6,
                                  flex: 1,
                                  marginLeft: 10,
                                  borderRadius: 10,
                                }}>
                                <Image
                                  source={require('../assets/images/call.png')}
                                  style={{width: 35, height: 35}}
                                />
                              </TouchableOpacity>
                            );
                          }
                        })()}
                        {(() => {
                          if (this.state.chubaidang[0].Email != null) {
                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  sendEmail(this.state.chubaidang[0].Email);
                                }}
                                activeOpacity={0.7}
                                style={{
                                  width: width / 6,
                                  flex: 1,
                                  marginLeft: 10,
                                  borderRadius: 10,
                                }}>
                                <Image
                                  source={require('../assets/images/gmail.png')}
                                  style={{width: 35, height: 35}}
                                />
                              </TouchableOpacity>
                            );
                          }
                        })()}
                        {(() => {
                          if (this.state.chubaidang[0].FB != null) {
                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  openLink(this.state.chubaidang[0].FB);
                                }}
                                activeOpacity={0.7}
                                style={{
                                  width: width / 6,
                                  flex: 1,
                                  marginLeft: 10,
                                  borderRadius: 10,
                                }}>
                                <Image
                                  source={require('../assets/images/facebook.png')}
                                  style={{width: 35, height: 35}}
                                />
                              </TouchableOpacity>
                            );
                          }
                        })()}
                        {(() => {
                          if (this.state.chubaidang[0].Zalo != null) {
                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  openLink(this.state.chubaidang[0].Zalo);
                                }}
                                activeOpacity={0.7}
                                style={{
                                  width: width / 6,
                                  flex: 1,
                                  marginLeft: 10,
                                  borderRadius: 10,
                                }}>
                                <Image
                                  source={require('../assets/images/zalo.png')}
                                  style={{width: 50, height: 50}}
                                />
                              </TouchableOpacity>
                            );
                          }
                        })()}
                      </ScrollView>
                    </View>
                  );
                } else {
                  return (
                    <ContentLoader
                      speed={2}
                      width={width}
                      height={118}
                      viewBox="0 0 476 124"
                      backgroundColor="#ededed"
                      foregroundColor="#bfbbbb">
                      <Rect
                        width="70"
                        height="70"
                        stroke="black"
                        rx="70"
                        ry="70"
                        x="10"
                      />
                      <Rect
                        x="90"
                        y="20"
                        rx="2"
                        ry="2"
                        width={width - 90}
                        height="35"
                      />
                      <Rect
                        x="10"
                        y="80"
                        rx="3"
                        ry="3"
                        width={width}
                        height="100"
                      />
                    </ContentLoader>
                  );
                }
              })()}
            </View>
            <View
              style={{
                width: width,
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.onScroll()}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRightWidth: 1,
                  borderRightColor: 'gray',
                }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: '#a89b9b',
                    fontFamily: 'UTM-DuepuntozeroBold',
                    fontSize: 17,
                    marginRight: 10,
                  }}>
                  Bình luận : {this.state.binhluan.length}
                </Text>
                <FontAwesome name="comments" size={19} color="#a89b9b" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  this.setState({
                    hiendanhgia: true,
                  })
                }
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: '#a89b9b',
                    fontFamily: 'UTM-DuepuntozeroBold',
                    fontSize: 17,
                    marginRight: 10,
                  }}>
                  Đánh giá :
                </Text>
                <AntDesign
                  name="star"
                  size={15}
                  color={this.state.danhgia >= 1 ? '#ff8d14' : '#a89b9b'}
                />
                <AntDesign
                  name="star"
                  size={15}
                  color={this.state.danhgia >= 2 ? '#ff8d14' : '#a89b9b'}
                />
                <AntDesign
                  name="star"
                  size={15}
                  color={this.state.danhgia >= 3 ? '#ff8d14' : '#a89b9b'}
                />
                <AntDesign
                  name="star"
                  size={15}
                  color={this.state.danhgia >= 4 ? '#ff8d14' : '#a89b9b'}
                />
                <AntDesign
                  name="star"
                  size={15}
                  color={this.state.danhgia >= 5 ? '#ff8d14' : '#a89b9b'}
                />
              </TouchableOpacity>
              <Modal
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                animationType="slide"
                transparent={true}
                visible={this.state.hiendanhgia}>
                <View
                  style={{
                    width: width,
                    height: height,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: width - 60,
                      height: 150,
                      borderRadius: 10,
                      backgroundColor: 'white',
                      borderColor: '#3465d9',
                      borderWidth: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: width - 60,
                        height: 30,
                        alignItems: 'flex-end',
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            hiendanhgia: false,
                          })
                        }>
                        <AntDesign
                          name="closecircleo"
                          size={26}
                          color="black"
                          style={{marginRight: 10}}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'UTM-Duepuntozero',
                        fontSize: 20,
                      }}>
                      ĐÁNH GIÁ
                    </Text>
                    <StarRating
                      disabled={false}
                      maxStars={5}
                      fullStarColor="#ff9a16"
                      emptyStarColor="#a89b9b"
                      rating={this.state.sao}
                      selectedStar={(rating) => this.onStarRatingPress(rating)}
                    />
                    <TouchableOpacity
                      onPress={() => this.guiDanhGia()}
                      style={{
                        width: '100%',
                        height: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#3465d9',
                          fontFamily: 'UTM-DuepuntozeroBold',
                          fontSize: 19,
                        }}>
                        Gửi
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
            <View
              style={{
                width: width,
                borderTopColor: '#919191',
                borderTopWidth: 0.5,
                marginTop: 10,
                paddingLeft: 5,
              }}>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'UTM-Duepuntozero',
                  fontSize: 17,
                }}>
                {' ' + this.props.Post.MoTa}
              </Text>
              <Text
                onPress={() => {
                  this.setState({
                    hienbando: true,
                  });
                }}
                style={{
                  color: '#3465d9',
                  fontFamily: 'UTM-Duepuntozero',
                  fontSize: 17,
                  paddingLeft: 2,
                }}>
                {this.props.Post.DiaChi}
              </Text>

              <Modal
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                animationType="slide"
                transparent={true}
                visible={this.state.hienbando}>
                <View
                  style={{
                    width: width,
                    height: height,
                  }}>
                  <View style={styles.searchBar}>
                    <TouchableOpacity
                      style={styles.back}
                      activeOpacity={0.7}
                      onPress={() =>
                        this.setState({
                          hienbando: false,
                        })
                      }>
                      <Ionicons
                        name="chevron-back-sharp"
                        size={29}
                        color="white"
                      />
                    </TouchableOpacity>

                    <GooglePlacesAutocomplete
                      ref={(ref) => {
                        this.google = ref;
                      }}
                      placeholder="Tìm kiếm..."
                      enablePoweredByContainer={false}
                      fetchDetails={true}
                      onPress={(data, details = null) => {
                        var region = {
                          latitudeDelta: Region.latitudeDelta,
                          longitudeDelta: Region.longitudeDelta,
                          latitude: details.geometry.location.lat,
                          longitude: details.geometry.location.lng,
                        };
                        this.setState({
                          region: region,
                        });
                      }}
                      query={{
                        /// kiếm key thì vô trang web này https://tranhieuit.com/share-google-maps-api-key/
                        // hoặc tìm kiếm với từ khoa share key api google
                        key: 'AIzaSyCJqpC7oo-YYJJ1pRVZJgf84qExlHZCWSc',
                        language: 'vn',
                      }}
                      styles={{
                        container: {
                          flex: 13,
                          marginRight: 20,
                          marginTop: 10,
                        },
                        textInput: {
                          paddingRight: 25,
                          height: 40,
                        },
                      }}
                    />

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => this.clear()}
                      style={styles.close}>
                      <Ionicons
                        name="md-close-outline"
                        size={25}
                        color="gray"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => this.chiduong()}
                      style={{
                        width: 35,
                        height: 40,
                        marginTop: 10,
                        right: 25,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        borderTopRightRadius: 5,
                        borderBottomRightRadius: 5,
                      }}>
                      <FontAwesome5
                        name="directions"
                        size={25}
                        color="#3465d9"
                      />
                    </TouchableOpacity>
                  </View>
                  <MapView
                    onDoublePress={(coordinate, position) => {
                      this.onDoublePress(coordinate, position);
                    }}
                    // showsUserLocation={true}
                    provider={PROVIDER_GOOGLE}
                    region={this.state.region}
                    mapType={'satellite'}
                    style={{
                      width: width,
                      height: height,
                    }}>
                    {(() => {
                      if (this.state.chiduong) {
                        return (
                          <MapViewDirections
                            optimizeWaypoints={true}
                            timePrecision={'now'}
                            precision="high"
                            origin={this.state.region}
                            destination={this.state.destination}
                            apikey={'AIzaSyA66KwUrjxcFG5u0exynlJ45CrbrNe3hEc'}
                            strokeWidth={5}
                            strokeColor="#38e4ff"
                          />
                        );
                      }
                    })()}

                    <Marker
                      draggable
                      coordinate={this.state.region}
                      onDragEnd={(e) => {
                        var region = {
                          latitudeDelta: Region.latitudeDelta,
                          longitudeDelta: Region.longitudeDelta,
                          latitude: e.nativeEvent.coordinate.latitude,
                          longitude: e.nativeEvent.coordinate.longitude,
                        };
                        this.setState({
                          region: region,
                        });
                      }}
                    />
                  </MapView>
                </View>
              </Modal>
            </View>
          </View>
          <View
            style={{
              width: width,
              paddingLeft: 5,
              marginTop: 15,
              backgroundColor: 'white',
            }}>
            <View
              style={{
                width: width,
                backgroundColor: 'white',
                flexDirection: 'row',
              }}>
              <Image
                source={require('../assets/images/hang.png')}
                style={{width: 28, height: 28, marginRight: 10}}
              />
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'UTM-Duepuntozero',
                  fontSize: 18,
                }}>
                Hãng: {this.props.Post.Hang}
              </Text>
            </View>
            <View
              style={{
                width: width,
                backgroundColor: 'white',
                flexDirection: 'row',
              }}>
              <Image
                source={require('../assets/images/dongxe.png')}
                style={{width: 28, height: 28, marginRight: 10}}
              />
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'UTM-Duepuntozero',
                  fontSize: 18,
                }}>
                Dòng xe: {this.props.Post.DongXe}
              </Text>
            </View>
            <View
              style={{
                width: width,
                backgroundColor: 'white',
                flexDirection: 'row',
              }}>
              <Image
                source={require('../assets/images/namsanxuat.png')}
                style={{width: 28, height: 28, marginRight: 10}}
              />
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'UTM-Duepuntozero',
                  fontSize: 18,
                }}>
                Năm sản xuất: {this.props.Post.NamSanXuat}
              </Text>
            </View>
            <View
              style={{
                width: width,
                backgroundColor: 'white',
                flexDirection: 'row',
              }}>
              <Image
                source={require('../assets/images/sokmdadi.png')}
                style={{width: 28, height: 28, marginRight: 10}}
              />
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'UTM-Duepuntozero',
                  fontSize: 18,
                }}>
                Số km đã đi: {this.props.Post.SoKmDaDi}
              </Text>
            </View>
            <View
              style={{
                width: width,
                backgroundColor: 'white',
                flexDirection: 'row',
              }}>
              <Image
                source={require('../assets/images/tinhtrang.png')}
                style={{width: 28, height: 28, marginRight: 10}}
              />
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'UTM-Duepuntozero',
                  fontSize: 18,
                }}>
                Tình trạng: {this.props.Post.TinhTrang}
              </Text>
            </View>
            <View
              style={{
                width: width,
                backgroundColor: 'white',
                flexDirection: 'row',
              }}>
              <Image
                source={require('../assets/images/hopso.png')}
                style={{width: 28, height: 28, marginRight: 10}}
              />
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'UTM-Duepuntozero',
                  fontSize: 18,
                }}>
                Hộp số: {this.props.Post.HopSo}
              </Text>
            </View>
            <View
              style={{
                width: width,
                backgroundColor: 'white',
                flexDirection: 'row',
              }}>
              <Image
                source={require('../assets/images/nhienlieu.png')}
                style={{width: 28, height: 28, marginRight: 10}}
              />
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'UTM-Duepuntozero',
                  fontSize: 18,
                }}>
                Nhiên liệu: {this.props.Post.NhienLieu}
              </Text>
            </View>
            <View
              style={{
                width: width,
                backgroundColor: 'white',
                flexDirection: 'row',
              }}>
              <Image
                source={require('../assets/images/xuatxu.png')}
                style={{width: 28, height: 28, marginRight: 10}}
              />
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'UTM-Duepuntozero',
                  fontSize: 18,
                }}>
                Xuất xứ: {this.props.Post.XuatSu}
              </Text>
            </View>
            <View
              style={{
                width: width,
                backgroundColor: 'white',
                flexDirection: 'row',
              }}>
              <Image
                source={require('../assets/images/kieudang.png')}
                style={{width: 28, height: 28, marginRight: 10}}
              />
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'UTM-Duepuntozero',
                  fontSize: 18,
                }}>
                Kiểu dáng: {this.props.Post.KieuDang}
              </Text>
            </View>
            <View
              style={{
                width: width,
                backgroundColor: 'white',
                flexDirection: 'row',
              }}>
              <Image
                source={require('../assets/images/sochongoi.png')}
                style={{width: 28, height: 28, marginRight: 10}}
              />
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'UTM-Duepuntozero',
                  fontSize: 18,
                }}>
                Số chỗ: {this.props.Post.SoCho}
              </Text>
            </View>
            <View
              style={{
                width: width,
                backgroundColor: 'white',
                flexDirection: 'row',
              }}>
              <Image
                source={require('../assets/images/maluc.png')}
                style={{width: 30, height: 28, marginRight: 10}}
              />
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'UTM-Duepuntozero',
                  fontSize: 18,
                }}>
                Mã lực: {this.props.Post.MaLuc}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: width,
              marginTop: 10,
            }}>
            <Text
              style={{
                color: 'black',
                fontFamily: 'UVNCHUKY',
                fontSize: 19,
                marginLeft: 5,
                width: '80%',
                marginBottom: 10,
              }}>
              Bình luận
            </Text>
            <View
              style={{
                width: width,
                marginBottom: 10,
                flexDirection: 'row',
              }}>
              <TextInput
                placeholder="Bạn nghĩ như thế nào về bài viết này ?"
                style={{
                  width: '85%',
                  height: 50,
                  marginLeft: 10,
                  backgroundColor: '#fcfcfc',
                  borderRadius: 10,
                  borderColor: '#d6d6d6',
                  borderWidth: 1,
                  paddingRight: 5,
                }}
                value={this.state.txtthembinhluan}
                onChangeText={(text) => this.setState({txtthembinhluan: text})}
              />
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 10,
                }}
                onPress={() => this.thembinhluan()}>
                <FontAwesome
                  name="send"
                  size={23}
                  color="#3465d9"
                  style={{marginRight: 10}}
                />
              </TouchableOpacity>
            </View>
            {(() => {
              if (this.state.binhluan.length != 0) {
                return (
                  <FlatList
                    // flatListRef={React.createRef()}
                    // ref={this.flatList}
                    // horizontal
                    // pagingEnabled
                    showsVerticalScrollIndicator={false}
                    style={{
                      width: width,
                      // height: 80,
                      // opacity: 1,
                    }}
                    contentContainerStyle={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    data={this.state.binhluan}
                    renderItem={({item}) => (
                      <View
                        style={{
                          width: width - 10,
                          marginBottom: 10,
                        }}>
                        <View
                          style={{
                            width: width - 10,
                            flexDirection: 'row',
                          }}>
                          <Image
                            source={{
                              uri:
                                item.AnhDaiDien != null
                                  ? item.AnhDaiDien
                                  : 'https://icons-for-free.com/iconfiles/png/512/home+page+profile+user+icon-1320184041392976124.png',
                            }}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 30,
                            }}
                          />
                          <Text
                            style={{
                              color: 'black',
                              fontFamily: 'UVF-Funkydori',
                              fontSize: 19,
                              marginLeft: 5,
                              width: '80%',
                            }}>
                            {item.HoVaTen != null
                              ? item.HoVaTen
                              : 'Anonymus User'}
                          </Text>

                          {(() => {
                            if (
                              this.state.nguoidung.length != 0 &&
                              this.props.Post.IdUser ==
                                this.state.nguoidung[0].Id
                            ) {
                              return (
                                <View
                                  style={{
                                    width: '10%',
                                    height: 50,
                                  }}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.setState({
                                        idbinhluan: item.Id,
                                      });
                                      Alert.alert(
                                        'Thông báo',
                                        'Bạn thật sự muốn xóa bình luận này ?',
                                        [
                                          {
                                            text: 'Hủy',
                                            onPress: () =>
                                              console.log('Cancel Pressed'),
                                            style: 'cancel',
                                          },
                                          {
                                            text: 'Xóa',
                                            onPress: () => {
                                              this.xoabinhluan();
                                            },
                                          },
                                        ],
                                      );
                                    }}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}>
                                    <Entypo
                                      name="dots-three-vertical"
                                      color="#a89b9b"
                                      size={18}
                                    />
                                  </TouchableOpacity>
                                </View>
                              );
                            }
                          })()}

                          {(() => {
                            if (
                              this.state.nguoidung.length != 0 &&
                              item.IdNguoiDung == this.state.nguoidung[0].Id
                            ) {
                              return (
                                <View
                                  style={{
                                    width: '10%',
                                    height: 50,
                                  }}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.setState({
                                        hiensuabinhluan: true,
                                        txtbinhluan: item.NoiDung,
                                        idbinhluan: item.Id,
                                      });
                                    }}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}>
                                    <Entypo
                                      name="dots-three-vertical"
                                      color="#a89b9b"
                                      size={18}
                                    />
                                  </TouchableOpacity>
                                </View>
                              );
                            }
                          })()}
                        </View>
                        <View
                          style={{
                            width: width - 10,
                            paddingLeft: 30,
                            marginTop: -20,
                          }}>
                          <Text
                            style={{
                              color: 'black',
                              fontFamily: 'UVNCHUKY',
                              fontSize: 19,
                              marginLeft: 5,
                              width: '90%',
                            }}>
                            {item.NoiDung}
                          </Text>
                        </View>
                      </View>
                    )}
                  />
                );
              }
            })()}
            <Modal
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              animationType="slide"
              transparent={true}
              visible={this.state.hiensuabinhluan}>
              <View
                style={{
                  width: width,
                  height: height,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: width - 10,
                    height: 130,
                    borderRadius: 10,
                    backgroundColor: 'white',
                    borderColor: '#3465d9',
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: width - 10,
                      height: 20,
                      alignItems: 'flex-end',
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          hiensuabinhluan: false,
                          txtbinhluan: '',
                          idbinhluan: 0,
                        })
                      }>
                      <AntDesign
                        name="closecircleo"
                        size={26}
                        color="black"
                        style={{marginRight: 10}}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'UTM-Duepuntozero',
                      fontSize: 20,
                    }}>
                    BÌNH LUẬN
                  </Text>
                  <TextInput
                    placeholder="Bạn nghĩ như thế nào về bài viết này ?"
                    style={{
                      width: width - 20,
                      height: 50,
                      backgroundColor: '#fcfcfc',
                      borderRadius: 10,
                    }}
                    value={this.state.txtbinhluan}
                    onChangeText={(text) => this.setState({txtbinhluan: text})}
                  />
                  <View
                    style={{
                      width: '95%',
                      height: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      onPress={() => this.capnhatbinhluan()}
                      style={{
                        width: '50%',
                        height: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#3465d9',
                          fontFamily: 'UTM-DuepuntozeroBold',
                          fontSize: 19,
                        }}>
                        Cập nhật bình luận
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.xoabinhluan()}
                      style={{
                        width: '50%',
                        height: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#3465d9',
                          fontFamily: 'UTM-DuepuntozeroBold',
                          fontSize: 19,
                        }}>
                        Xóa bình luận
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  map: {
    width: width,
    height: height,
    // backgroundColor: 'blue',
  },
  image: {
    width: width,
    height: height / 1.4,
    // backgroundColor: 'red',
  },
  searchBar: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 10,
    width: width,
    // backgroundColor:'blue',
    marginTop: 35,
    justifyContent: 'center',
  },
  back: {
    // backgroundColor:'red',
    // marginTop: 35,
    marginLeft: 15,
    marginTop: 13,
    flex: 2,
  },
  close: {
    position: 'absolute',
    zIndex: 10,
    // backgroundColor: 'black',
    width: 20,
    height: 40,
    marginTop: 10,
    right: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  information: {
    position: 'absolute',
    zIndex: 10,
    height: height / 2.5,
    width: width,
    backgroundColor: 'white',
    top: height - height / 2.5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    // backgroundColor:'blue',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
  },
  body: {
    flexDirection: 'column',
    width: '100%',
    paddingTop: 5,
    paddingBottom: 5,
    // backgroundColor:'blue',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    width: width,
    // backgroundColor:'red',
    alignItems: 'center',
    marginBottom: 10,
    paddingRight: 5,
  },
  icon: {
    marginLeft: 20,
    marginRight: 8,
    width: 19,
    height: 19,
    // backgroundColor: 'blue',
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    color: '#383838',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'yellow',
  },
  searchBar: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 10,
    width: width,
    // backgroundColor:'blue',
    marginTop: 35,
    justifyContent: 'center',
  },
});
function mapStateToProps(state) {
  return {
    Post: state.Post,
  };
}
export default connect(mapStateToProps)(PostDetailScreen);
