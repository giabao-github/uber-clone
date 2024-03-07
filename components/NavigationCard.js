import { Text, View, SafeAreaView, StyleSheet, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from '@env';
import styles from '../styles/MapScreenStyle';
import { setDestination } from '../slices/navSlice';
import { ScrollView } from 'react-native-gesture-handler';
import NavFavorites from './NavFavorites';


const NavigationCard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const currentHour = new Date().getHours();
  let greeting;

  if (currentHour < 3 || currentHour > 22) {
    greeting = 'Good Night!';
  }
  else if (currentHour < 12) {
    greeting = 'Good Morning!';
  } else if (currentHour < 18) {
    greeting = 'Good Afternoon!';
  } else {
    greeting = 'Good Evening!';
  }

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <Text style={tw`text-center py-5 text-xl`}>{greeting}</Text>
      <View style={tw`border-t border-gray-200 flex-shrink`}>
        <View>
          <GooglePlacesAutocomplete
            placeholder='Where To?'
            styles={styles}
            fetchDetails={true}
            textInputProps={{
              returnKeyType: 'search',
            }}
            onPress={(data, details = null) => {
              dispatch(
                setDestination({
                  location: details.geometry.location,
                  description: data.description,
                })
              );
              navigation.navigate('RideOptionsCard');
            }}
            enablePoweredByContainer={false}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: 'en',
            }}
            nearbyPlacesAPI='GooglePlacesSearch'
            debounce={0}
          />
        </View>
        <NavFavorites />
      </View>
      
      <View style={tw`flex-row bg-white justify-evenly py-2 mt-auto border-t border-gray-100`}>
        <TouchableOpacity
          onPress={() => navigation.navigate('RideOptionsCard')}
          style={tw`flex flex-row justify-between bg-black w-24 px-4 py-3 rounded-full`}
        >
          <Icon name='car' color='white' size={16} />
          <Text style={tw`text-white text-center`}>Rides</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex flex-row justify-between w-24 px-4 py-3 rounded-full`}>
          <Ionicon name='fast-food-outline' color='black' size={16} />
          <Text style={tw`text-center`}>Eats</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default NavigationCard;