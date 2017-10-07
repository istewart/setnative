import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Card extends React.Component {
  render() {
    return (
      <View style={styles.container}></View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    border: 'black',
  },
});
