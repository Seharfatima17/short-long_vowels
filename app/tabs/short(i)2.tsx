import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert, UIManager } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Line } from 'react-native-svg';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Speech from 'expo-speech';

UIManager.setLayoutAnimationEnabledExperimental?.(true);

const originalPairs = [
  { word: 'lip', image: 'https://static.vecteezy.com/system/resources/thumbnails/038/123/385/small/pink-woman-lips-png.png' },
  { word: 'sip', image: 'https://static.vecteezy.com/system/resources/previews/008/022/442/non_2x/girl-drinking-from-a-can-free-vector.jpg' },
  { word: 'bin', image: 'https://i.pinimg.com/736x/ec/62/ac/ec62acb108d5d9fff7b4f1e93503f7f0.jpg' },
  { word: 'wig', image: 'https://png.pngtree.com/png-clipart/20221025/original/pngtree-wig-for-men-free-download-png-image_8718891.png' },
  { word: 'fig', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG61YkYr-g5_XErI8sio7pPOqKc4oFq8GwQA&s' },
  { word: 'pin', image: 'https://w7.pngwing.com/pngs/324/695/png-transparent-nail-drawing-pin-icon-cartoon-nail-cartoon-character-angle-heart.png' },
];

const { width, height } = Dimensions.get('window');

export default function ShortIActivity() {
  const router = useRouter();
  const containerRef = useRef(null);
  const dotRefs = useRef({});
  const [lines, setLines] = useState([]);
  const [activeDot, setActiveDot] = useState(null);
  const [score, setScore] = useState(0);

  const [data] = useState(() => {
    const shuffledImages = [...originalPairs]
      .sort(() => Math.random() - 0.5)
      .map(item => item.image);

    return originalPairs.map((item, index) => ({
      word: item.word,
      image: shuffledImages[index]
    }));
  });

  const handleDotPress = async (type, word) => {
    const dotRef = dotRefs.current[`${type}-${word}`];
    if (!dotRef || !containerRef.current) return;

    containerRef.current.measure((containerX, containerY, containerWidth, containerHeight, pageX, pageY) => {
      dotRef.measure((x, y, width, height, pageXDot, pageYDot) => {
        const position = {
          x: pageXDot - pageX + width / 2,
          y: pageYDot - pageY + height / 2
        };

        if (!activeDot) {
          setActiveDot({ type, word, position });
        } else {
          const selectedWord = type === 'word' ? word : activeDot.word;
          const selectedImage = type === 'image'
            ? data.find(item => item.word === word)?.image
            : data.find(item => item.word === activeDot.word)?.image;

          const originalPair = originalPairs.find(pair => pair.word === selectedWord);
          const isCorrectMatch = originalPair?.image === selectedImage;

          if (isCorrectMatch) {
            Speech.speak('Correct match!');
            Alert.alert('Correct!', `You matched ${selectedWord} correctly!`);
            setScore(prev => prev + 1);
            setLines(prev => [...prev, {
              x1: activeDot.position.x,
              y1: activeDot.position.y,
              x2: position.x,
              y2: position.y,
              color: 'green'
            }]);
          } else {
            Speech.speak('Wrong match');
            Alert.alert('Incorrect', 'Try again!');
            setLines(prev => [...prev, {
              x1: activeDot.position.x,
              y1: activeDot.position.y,
              x2: position.x,
              y2: position.y,
              color: 'red',
              temporary: true
            }]);
            setTimeout(() => {
              setLines(prev => prev.filter(line => !line.temporary));
            }, 1000);
          }

          setActiveDot(null);
        }
      });
    });
  };

  const resetLines = () => {
    setLines([]);
    setActiveDot(null);
    setScore(0);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.matchingArea} ref={containerRef}>
        <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
          {lines.map((line, index) => (
            <Line
              key={`line-${index}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.color}
              strokeWidth="3"
            />
          ))}
        </Svg>

        <View style={styles.matchContent}>
          {data.map((item) => (
            <View key={item.word} style={styles.row}>
              <Text style={styles.word}>{item.word}</Text>

              <TouchableOpacity
                ref={ref => dotRefs.current[`word-${item.word}`] = ref}
                onPress={() => handleDotPress('word', item.word)}
                style={styles.dotTouchable}
                activeOpacity={0.7}
              >
                <Text style={styles.dot}>●</Text>
              </TouchableOpacity>

              <View style={{ width: 50 }} />

              <TouchableOpacity
                ref={ref => dotRefs.current[`image-${item.word}`] = ref}
                onPress={() => handleDotPress('image', item.word)}
                style={styles.dotTouchable}
                activeOpacity={0.7}
              >
                <Text style={styles.dot}>●</Text>
              </TouchableOpacity>

              <Image source={{ uri: item.image }} style={styles.image} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.scoreBox}>
        <Text style={styles.scoreText}>
          ✅ Score: {score} out of {originalPairs.length}
        </Text>
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#ff6b6b' }]} onPress={resetLines}>
          <Text style={styles.buttonText}>🔁 Reset Lines</Text>
        </TouchableOpacity>

        <View style={styles.navRow}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/short(i)1')}>
            <Text style={styles.buttonText}>⬅ Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.push('/long(i)')}>
            <Text style={styles.buttonText}>Next ➡</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  matchingArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchContent: {
    zIndex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  word: {
    fontSize: 18,
    fontWeight: '500',
    width: 60,
    textAlign: 'right',
  },
  dotTouchable: {
    padding: 15,
    marginHorizontal: 5,
  },
  dot: {
    fontSize: 24,
    color: '#2a52be',
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  scoreBox: {
    paddingVertical: 10,
    backgroundColor: '#eaf4ff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a52be',
  },
  bottomButtons: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 20,
  },
  button: {
    backgroundColor: '#2a52be',
    padding: 15,
    borderRadius: 8,
    minWidth: 130,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});