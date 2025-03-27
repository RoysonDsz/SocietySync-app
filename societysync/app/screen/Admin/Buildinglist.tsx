import React from 'react';
import { View } from 'react-native';

const BuildingList = () => {

  return (
    <View className="flex-1 p-4">
      {/* <Text className="text-xl font-bold mb-4">Building List</Text>
      {buildings.map((building, index) => (
        <View key={index} className="bg-white p-4 mb-4 rounded shadow">
          <Text className="text-lg font-semibold">{building.name}</Text>
          <Text>Block: {building.block}</Text>
          <Text>Flats: {building.flats}</Text>
          <TouchableOpacity className="bg-red-500 py-2 px-4 rounded mt-2">
            <Text className="text-white">Delete</Text>
          </TouchableOpacity>
        </View>
      ))} */}
    </View>
  );
}

export default BuildingList;
