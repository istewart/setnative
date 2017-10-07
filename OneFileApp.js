import React from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
// import { Constants } from 'expo';

const CARDS_SHOWN = 12;

// shuffle the array in a random order
// note that this is not actually random or particularly close
// checkout out _.shuffle for a better approach
const shuffle = (arr) => arr.sort(() => {return 0.5 - Math.random()});

// generate a set deck
const generateDeck = () => {
    const colors = ['red', 'green', 'purple'];
    const numbers = ['1', '2', '3'];
    const shapes = ['oval', 'squiggle', 'diamond'];
    const fill = ['empty', 'striped', 'full'];

    var results = [];
    colors.forEach((color) => {
        numbers.forEach((num) => {
            shapes.forEach((shape) => {
                fill.forEach((fill) => {
                    results.push({
                        id: `${color}${num}${shape}${fill}`,
                        color: color,
                        shape: shape,
                        num: num,
                        fill: fill,
                    });
                });
            });
        });
    });

    shuffle(results);
    return results;
};

// figure out which cards to show
const getVisibleCards = (deck) => deck.slice(0, CARDS_SHOWN);

// wrapper for expo
export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Board />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'green',
    padding: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

export const makeShape = (color, shape, fill) => {
  var styles = {width: 60, height: 20};

  // style fill
  if (fill === 'full') {
      styles['backgroundColor'] = color;
  } else if (fill === 'striped') {
      styles['borderWidth'] = 5;
      styles['borderColor'] = color;
  } else {
      styles['borderWidth'] = 1;
      styles['borderColor'] = color;
  }

  // style shape
  if (shape == 'oval') {
      styles.borderRadius = 15;
  } else if (shape == 'squiggle') {
      styles.width = 30;
      styles.height = 15;
      styles.borderRadius = 40;
      styles.transform = [
          {
            scaleX: 2,
          }, {
            rotate: '30deg',
          },
      ];
  } else {
      styles.width = 20;
      styles.height = 20;
      styles.transform = [
          {
            scaleX: 2,
          }, {
            rotate: '45deg',
          },
      ];
  }

  return (
      <View style={styles}/>
  );
};

// component for displaying a set card
export class Card extends React.Component {
  render() {
      var results = [];
      for (var i = 0; i < this.props.num; i++) {
          results.push(makeShape(this.props.color, this.props.shape, this.props.fill));
      }

      var dynamicStyles = {};
      if (this.props.selected) {
          dynamicStyles.borderColor = 'pink';
          dynamicStyles.borderWidth = 5;
      }

    return (
      <TouchableHighlight onPress={() => this.props.addSelected({
          id: this.props.id,
          color: this.props.color,
          fill: this.props.fill,
          shape: this.props.shape,
          num: this.props.num,
      })}>
          <View style={[stylesCard.container, dynamicStyles]}>
            {results}
          </View>
      </TouchableHighlight>
    );
  }
}

const stylesCard = StyleSheet.create({
  container: {
    width: 80,
    height: 120,
    backgroundColor: 'white',
    marginVertical: 10,
    padding: 10,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
  },
});

// calculate if three cards are a match
// cards match if for each category, they all share the same value
// or they all have different values
const isMatch = (a, b, c) => {
    const fields = ['color', 'shape', 'num', 'fill'];
    return fields.every((field) => {
       if (!((a[field] === b[field] && b[field] == c[field])
       || (a[field] !== b[field] && a[field] !== c[field] && b[field] !== c[field]))) {
           return false;
       }

       return true;
    });
}

// class representing the state of the set board
export class Board extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          selected: [],
          cards: generateDeck(),
      };
  }

  // mark the given card as selected
  // if there are already two cards selected, check if the three cards form a match
  addSelected(card) {
      if (this.state.selected.length == 2) {
          if (isMatch(...this.state.selected, card)) {
              this.setState({
                  selected: [],
                  cards: this.state.cards.filter((currCard) => !this.state.selected.concat(card).filter((x) => x.id === currCard.id).length),
              });
              return;
          } else {
              this.setState({
                  selected: [],
              });
              return;
          }
      }

      this.setState({
         selected: this.state.selected.concat(card),
      });
  }

  render() {
    return (
      <View style={stylesBoard.container}>
        {getVisibleCards(this.state.cards).map((card) => (
            <Card
                id={card.id}
                color={card.color}
                num={card.num}
                shape={card.shape}
                fill={card.fill}
                selected={this.state.selected.filter((x) => (x.id === card.id)).length}
                addSelected={this.addSelected.bind(this)}
            />
        ))}
      </View>
    );
  }
}

const stylesBoard = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'yellow',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    alignItems: 'center',
    height: '100%',
  },
});


