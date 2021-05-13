import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {
  getDate,
  toUpper,
  changePhoneNumber,
  shareEmail,
  width,
  height,
  formatMoney,
} from '../common/CommonComponent';
import Axios from 'axios';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';

const api = Axios.create({
  baseURL: 'http:///10.0.2.2:8000/api/',
});
// const urlImage ="http:///10.0.2.2:8080/thueoto/public/Images/";

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anhxe: [],
    };
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextState.anhxe != this.state.anhxe) {
  //     console.log(nextState.anhxe[0].Links);
  //   }
  //   return true;
  // }

  componentDidMount() {
    api.get('anhxe/' + this.props.baidang.Id).then((res) => {
      this.setState({
        anhxe: res.data,
      });
    });
    // console.log(this.props.baidang);
  }
  render() {
    return (
      <View style={styles.item}>
        {(() => {
          if (this.state.anhxe.length > 0) {
            console.log(this.state.anhxe);
            return (
              <View style={styles.item}>
                <View
                  style={{
                    flex: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    resizeMode="cover"
                    source={{uri: this.state.anhxe[0].Links}}
                    style={styles.image}
                  />
                </View>
                <View
                  style={{
                    flex: 10,
                  }}>
                  <View
                    style={{
                      flex: 5,
                    }}>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.companyname}>
                      {this.props.baidang.Tieude.toUpperCase()}
                    </Text>
                  </View>
                  <View style={{flex: 2}}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.companyname,
                        {
                          color: '#919191',
                        },
                      ]}>
                      {toUpper(String(this.props.baidang.NamSanXuat))} -{' '}
                      {toUpper(this.props.baidang.HopSo)} -{' '}
                      {toUpper(String(this.props.baidang.SoKmDaDi) + ' Km')}
                    </Text>
                  </View>
                  <View style={{flex: 2}}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.companyname,
                        {
                          color: '#C90927',
                        },
                      ]}>
                      {formatMoney(String(this.props.baidang.Gia)) + ' VNĐ'}
                    </Text>
                  </View>
                  <View style={{flex: 2}}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.companyname,
                        {
                          color: '#919191',
                        },
                      ]}>
                      {(() => {
                        var startDate = new Date(this.props.baidang.NgayDang);
                        var endDate = new Date();
                        var offset = endDate.getTime() - startDate.getTime();
                        var totalDays = Math.round(
                          offset / 1000 / 60 / 60 / 24,
                        );
                        if (totalDays < 6) {
                          return ' ' + String(totalDays) + ' Ngày Trước ';
                        } else {
                          return ' ' + this.props.baidang.NgayDang;
                        }
                      })()}
                    </Text>
                  </View>
                  <View style={{flex: 3}}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.companyname,
                        {
                          color: '#919191',
                        },
                      ]}>
                      {String(this.props.baidang.DiaChi)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          } else {
            return (
              <ContentLoader
                speed={2}
                width={476}
                height={124}
                viewBox="0 0 476 124"
                backgroundColor="#ededed"
                foregroundColor="#bfbbbb">
                <Rect width="120" height="120" stroke="black" rx="10" ry="10" />
                <Rect x="130" y="17" rx="4" ry="4" width="210" height="15" />
                <Rect x="130" y="40" rx="3" ry="3" width="210" height="10" />
                <Rect x="130" y="60" rx="3" ry="3" width="100" height="10" />
                <Rect x="130" y="80" rx="3" ry="3" width="160" height="10" />
                <Rect x="130" y="100" rx="3" ry="3" width="160" height="10" />
              </ContentLoader>
            );
          }
        })()}
      </View>
      // <ImageBackground
      //   source={require('../assets/images/mau1.png')}
      //   c>
      //   {/* <LinearGradient
      //   colors={['#0537ad', '#386de8']}
      //   start={{x: 0, y: 1}}
      //   end={{x: 1, y: 0}}
      //   style={styles.item}> */}
      //   {/* <View style={styles.image_container}>
      //     <Image
      //       resizeMode="cover"
      //       source={{uri: this.props.card.linkimage}}
      //       style={styles.image}
      //     />
      //   </View> */}
      //   <View style={styles.header}>
      //     <Text
      //       numberOfLines={1}
      //       ellipsizeMode="tail"
      //       style={styles.companyname}>
      //       {this.props.baidang.Tieude.toUpperCase()}
      //     </Text>
      //     {/* <TouchableOpacity
      //       style={styles.button}
      //       onPress={() =>
      //         this.props.props.navigation.navigate('DetailCard', {
      //           card: this.props.card,
      //           page: this.props.page,
      //         })
      //       }>
      //       <AntDesign name="arrowright" color="white" size={15} />
      //     </TouchableOpacity> */}
      //   </View>
      //   {/* <View style={styles.body}>
      //     <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
      //       {this.props.card.yourname.toUpperCase()}
      //     </Text>
      //     <Text numberOfLines={1} ellipsizeMode="tail" style={styles.position}>
      //       {toUpper(this.props.card.position)}
      //     </Text>
      //   </View>
      //   <View style={styles.footer}>
      //     <View style={styles.information}>
      //       <Text numberOfLines={1} ellipsizeMode="tail" style={styles.email}>
      //         {this.props.card.email.toLowerCase()}
      //       </Text>
      //       <Text numberOfLines={1} ellipsizeMode="tail" style={styles.phone}>
      //         {changePhoneNumber(this.props.card.phone)}
      //       </Text>
      //       <Text numberOfLines={1} ellipsizeMode="tail" style={styles.address}>
      //         {this.props.card.address}
      //       </Text>
      //       <Text numberOfLines={1} ellipsizeMode="tail" style={styles.website}>
      //         {this.props.card.website}
      //       </Text>
      //     </View>
      //     <TouchableOpacity
      //       activeOpacity={0.6}
      //       style={styles.logo}
      //       onPress={() => {
      //         this.props.props.navigation.navigate('Share', {
      //           card: this.props.card,
      //         });
      //         // shareEmail(this.props.card,"th966391@gmail.com")
      //       }}>
      //       <Image
      //         resizeMode="cover"
      //         source={{uri: this.props.card.linkimage}}
      //         style={styles.image}
      //       />
      //     </TouchableOpacity>
      //   </View> */}
      // </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    height: 120,
  },
  companyname: {
    color: 'black',
    fontFamily: 'UTM-DuepuntozeroBold',
    fontSize: 14,
    flex: 13,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  body: {
    flex: 4,
  },
  name: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'iCielCadena',
  },
  position: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'UTM-DuepuntozeroBold',
  },
  footer: {
    flex: 10,
    flexDirection: 'row',
  },
  information: {
    flex: 9,
    flexDirection: 'column',
    paddingLeft: 19,
    paddingTop: 9,
  },
  email: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'UTM-DuepuntozeroBold',
  },
  phone: {
    marginTop: 5,
    color: 'white',
    fontSize: 15,
    fontFamily: 'UTM-DuepuntozeroBold',
  },
  address: {
    marginTop: 5,
    color: 'white',
    fontSize: 15,
    fontFamily: 'UTM-DuepuntozeroBold',
  },
  website: {
    marginTop: 5,
    color: 'white',
    fontSize: 15,
    fontFamily: 'UTM-DuepuntozeroBold',
  },
  logo: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 8,
    // borderRadius: 65,
    // left: -15,
    // top: -4,
  },
});

Item.propTypes = {
  props: PropTypes.object,
};

export default connect()(Item);
