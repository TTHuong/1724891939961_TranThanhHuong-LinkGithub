import {Dimensions, Linking, Alert, Platform} from 'react-native';
import Mailer from 'react-native-mail';
import Axios from 'axios';

export const {width, height} = Dimensions.get('window');
export const standarWidth = 360;
export const standardHeight = 592;
export const Region = {
  latitude: 10.980656132656149,
  longitude: 106.67444836927338,
  latitudeDelta: 0.0059,
  longitudeDelta: 0.0059 * (width / height),
};
export const Validation = {
  email: true,
  phone: true,
  position: true,
  website: true,
  yourname: true,
  address: true,
  companyname: true,
  linkimage: true,
};
export function getDate() {
  var date = new Date().getDate(); //Current Date
  var month = new Date().getMonth() + 1; //Current Month
  var year = new Date().getFullYear(); //Current Year
  var hours = new Date().getHours(); //Current Hours
  var min = new Date().getMinutes(); //Current Minutes
  var sec = new Date().getSeconds(); //Current Seconds
  var key =
    date + '-' + month + '-' + year + '-' + hours + ':' + min + ':' + sec;
  return key;
}
export function ucWords(str) {
  return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
    return $1.toUpperCase();
  });
}
export function toUpper(str) {
  var position = str;
  position = position.charAt(0).toUpperCase() + position.slice(1).toLowerCase();
  return position;
}
export function formatMoney(str) {
  var dem = 0;
  var string = '';
  for (var i = 0; i < str.length; i++) {
    if (dem == 3) {
      dem = 0;
      string += '.';
    } else {
      string += str[str.length - i - 1];
      dem++;
    }
  }
  // string=string.substring(0,string.length-1);
  string = string.split('').reverse().join('');
  return string;
}
export function changePhoneNumber(str) {
  var array = str.replace(/ +/g, '');
  array = array.split('');
  var text = '';
  for (var i = 0; i < array.length; i++) {
    if (i == 4) {
      text += ' ';
    } else if (i == 7) {
      text += ' ';
    }
    text += array[i];
  }
  return text;
}
export async function openLink(url) {
  url = url.toLowerCase();
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert(
      'Thông báo !',
      'Liên kế không thể mở được, bạn có thể thử lại sau !',
      [
        {
          text: 'Ok',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  }
}
export function sendEmail(text) {
  text = text.toLowerCase();
  Linking.openURL(`mailto:${text}`);
}
export function shareEmail(card, to_email) {
  Axios({
    method: 'POST',
    url: 'http://127.0.0.1:8000/api/sendEmail/',
    data: {
      to_email: to_email,
      companyname: card.companyname,
      linkimage: card.linkimage,
      email: card.email,
      phone: card.phone,
      position: card.position,
      website: card.website,
      yourname: card.yourname,
      address: card.address,
    },
    headers: {
      'content-type': 'application/json',
    },
  })
    .then((res) => {
      Alert.alert(
        'Thông báo chia sẻ',
        'Chia sẽ name card qua gmail thành công',
        [
          {
            text: 'Ok',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    })
    .catch(function (error) {
      Alert.alert(
        'Thông báo chia sẻ',
        'Chia sẽ name card qua gmail không thành công',
        [
          {
            text: 'Ok',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    });
}
export function call(text) {
  Linking.openURL(`tel:${text}`);
}
export function isValidationEmail(text) {
  let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (reg.test(text) === false) {
    return false;
  } else {
    return true;
  }
}
export function isValidationPhone(text) {
  const reg = /^\d{10}$/;
  if (reg.test(text) === false) {
    return false;
  } else {
    return true;
  }
}

export function notification(text) {
  Alert.alert(
    'Thông báo',
    text,
    [
      {
        text: 'Ok',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ],
    {cancelable: false},
  );
}
