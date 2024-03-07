import React from 'react';
import { Text, View, SafeAreaView, Image } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import NavOptions from '../components/NavOptions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useDispatch } from 'react-redux';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { setOrigin, setDestination } from '../slices/navSlice';
import NavFavorites from '../components/NavFavorites';

const HomeScreen = () => {
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View style={tw`p-5`}>
        <Image
          style={{
            width: 100,
            height: 100,
            resizeMode: 'contain',
          }}
          source={{
            uri: 'https://links.papareact.com/gzs',
          }}
        />

        <GooglePlacesAutocomplete
          placeholder='Where From?'
          styles={{
            container: {
              flex: 0,
            },
            textInput: {
              fontSize: 18,
            }
          }}
          onPress={(data, details = null) =>{
            dispatch(setOrigin({
              location: details.geometry.location,
              description: data.description,
            }));
            dispatch(setDestination(null));
          }}
          onFail={(error) => console.error(error)}
          fetchDetails={true}
          textInputProps={{
            returnKeyType: 'search',
          }}
          enablePoweredByContainer={false}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: 'en'
          }}
          requestUrl={{
            url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
          }}
          nearbyPlacesAPI='GooglePlacesSearch'
          debounce={0}
        />

        <NavOptions />
        <NavFavorites />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;