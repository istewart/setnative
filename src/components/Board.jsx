import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Card from './Card';

export default class Board extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {this.props.cards.map((card) => <Card ..card/>)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
