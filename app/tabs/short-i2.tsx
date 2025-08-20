import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert, UIManager } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Line } from 'react-native-svg';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Speech from 'expo-speech';
import { saveScore } from '../firebase/firebasehelper';

UIManager.setLayoutAnimationEnabledExperimental?.(true);

const originalPairs = [
  { word: 'lip', image: 'https://static.vecteezy.com/system/resources/thumbnails/038/123/385/small/pink-woman-lips-png.png' },
  { word: 'sip', image: 'https://static.vecteezy.com/system/resources/previews/008/022/442/non_2x/girl-drinking-from-a-can-free-vector.jpg' },
  { word: 'bin', image: 'https://static.vecteezy.com/system/resources/previews/005/551/043/non_2x/recycled-bin-cartoon-illustration-isolated-object-vector.jpg' },
  { word: 'wig', image: 'https://i.pinimg.com/474x/2c/f7/a8/2cf7a81ce16e8bf97ac86c60b021c1f6.jpg' },
  { word: 'fig', image: 'https://img.freepik.com/premium-vector/ripe-figs-white-background-cartoon-design_530689-1296.jpg' },
  { word: 'pin', image: 'https://static.vecteezy.com/system/resources/previews/008/957/234/non_2x/animated-red-push-pin-board-icon-clipart-vector.jpg' },
];

const { width, height } = Dimensions.get('window');

export default function ShortIActivity() {
  const router = useRouter();
  const containerRef = useRef(null);
  const dotRefs = useRef({});
  const [lines, setLines] = useState([]);
  const [activeDot, setActiveDot] = useState(null);
  const [score, setScore] = useState(0);
  const [selectedWords, setSelectedWords] = useState<Record<number, string>>({});
  const [hasAttemptedMatching, setHasAttemptedMatching] = useState(false);

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
          setHasAttemptedMatching(true);
          const selectedWord = type === 'word' ? word : activeDot.word;
          const selectedImage = type === 'image'
            ? data.find(item => item.word === word)?.image
            : data.find(item => item.word === activeDot.word)?.image;

          const originalPair = originalPairs.find(pair => pair.word === selectedWord);
          const isCorrectMatch = originalPair?.image === selectedImage;

          if (isCorrectMatch) {
            Speech.speak('Correct match!');
            setScore(prev => prev + 1);
            setSelectedWords(prev => ({
              ...prev,
              [score]: selectedWord
            }));
            setLines(prev => [...prev, {
              x1: activeDot.position.x,
              y1: activeDot.position.y,
              x2: position.x,
              y2: position.y,
              color: 'green'
            }]);
          } else {
            Speech.speak('Wrong match');
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
    setSelectedWords({});
    setHasAttemptedMatching(false);
  };

  const handleFinish = async () => {
    if (hasAttemptedMatching) {
      try {
        await saveScore('short', 'i', score, originalPairs.length, selectedWords);
        router.push('/tabs/long-i');
      } catch (error) {
        Alert.alert('Error', 'Failed to save score. Please try again.');
        return; // Don't navigate if there's an error saving
      }
    } else {
      // No matches attempted, just navigate
      router.push('/tabs/long-i');
    }
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
          <TouchableOpacity style={styles.button} onPress={() => router.push('/tabs/short-i1')}>
            <Text style={styles.buttonText}>⬅ Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleFinish}>
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
     paddingBottom: 1,
  },
  
  matchContent: {
    zIndex: 1,
    justifyContent: 'center',
     paddingBottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
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
    marginLeft: 6,
  },
  scoreBox: {
  paddingVertical: 8,
  backgroundColor: '#eaf4ff',
  alignItems: 'center',
  borderTopWidth: 1,
  borderColor: '#ccc',
  marginTop: -45,
},
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a52be',
  },
  bottomButtons: {
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: -15,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -45,
    gap: 25,
  },
  button: {
    backgroundColor: '#2a52be',
    padding: 15,
    borderRadius: 8,
    minWidth: 130,
    alignItems: 'center',
    marginTop: 1,
    marginBottom:59,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});