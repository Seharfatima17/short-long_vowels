import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert, UIManager } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Line } from 'react-native-svg';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Speech from 'expo-speech';

UIManager.setLayoutAnimationEnabledExperimental?.(true);

const originalPairs = [
  { word: 'bike', image: 'https://static.vecteezy.com/system/resources/previews/001/520/316/non_2x/blue-motor-bike-or-racing-bike-isolated-on-white-background-free-vector.jpg' },
  { word: 'kite', image: 'https://www.shutterstock.com/image-vector/kite-toy-fly-good-quality-600nw-2337737009.jpg' },
  { word: 'slide', image: 'https://www.shutterstock.com/image-vector/childrens-slide-light-blue-vector-600nw-283940648.jpg' },
  { word: 'time', image: 'https://media.istockphoto.com/id/1213927716/vector/alarm-clock-icon-wake-up-time-vector-design-on-white-background.jpg?s=612x612&w=0&k=20&c=fzxWZ3yPtBFVvkNkrYPKk7aEjw45JQwPZ-llZyi91go=' },
  { word: 'pipe', image: 'https://www.shutterstock.com/image-vector/angle-pipe-icon-cartoon-vector-600nw-1896297952.jpg' },
  { word: 'hide', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSygtEnYmdvcdOgw_-ojAB_zyV9Rfbi6lHwnA&s' },
];

const { width, height } = Dimensions.get('window');

export default function LongIActivity() {
  const router = useRouter();
  const dotRefs = useRef({});

  const [lines, setLines] = useState([]);
  const [activeDot, setActiveDot] = useState(null);

  const [data] = useState(() => {
    const shuffledImages = [...originalPairs]
      .sort(() => Math.random() - 0.5);

    return originalPairs.map((item, index) => ({
      word: item.word,
      image: shuffledImages[index].image,
      imageOriginalWord: shuffledImages[index].word, // store original word of image
    }));
  });

  const handleDotPress = async (type, word) => {
    const dotRef = dotRefs.current[`${type}-${word}`];
    if (!dotRef) return;

    await new Promise(resolve =>
      dotRef.measureInWindow((x, y, w, h) => {
        const pos = { x: x + w / 2, y: y + h / 2 };

        if (!activeDot) {
          setActiveDot({ type, word, position: pos });
        } else {
          const first = activeDot;
          const second = { type, word, position: pos };

          let wordSide = first.type === 'word' ? first.word : second.word;
          let imageSideWord = first.type === 'image' ? first.word : second.word;

          // Check if word matches image's original word
          const matchedPair = data.find(d => d.word === imageSideWord);
          const isCorrect = matchedPair?.imageOriginalWord === wordSide;

          Speech.speak(isCorrect ? 'Correct match!' : 'Wrong match');
          Alert.alert(isCorrect ? '✅ Correct!' : '❌ Incorrect', isCorrect
            ? `You matched ${wordSide}!`
            : 'Try again.');

          setLines(prev => [
            ...prev,
            {
              x1: first.position.x,
              y1: first.position.y,
              x2: second.position.x,
              y2: second.position.y,
              color: isCorrect ? 'green' : 'red',
              temporary: !isCorrect,
            }
          ]);

          if (!isCorrect) {
            setTimeout(() => setLines(prev => prev.filter(l => !l.temporary)), 1000);
          }

          setActiveDot(null);
        }

        resolve(true);
      })
    );
  };

  const resetLines = () => {
    setLines([]);
    setActiveDot(null);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.matchingArea}>
        <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
          {lines.map((l, i) => (
            <Line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth="3" />
          ))}
        </Svg>

        <View style={styles.matchContent}>
          {data.map(item => (
            <View key={item.word} style={styles.row}>
              <Text style={styles.word}>{item.word}</Text>

              <TouchableOpacity
                ref={ref => dotRefs.current[`word-${item.word}`] = ref}
                onPress={() => handleDotPress('word', item.word)}
                style={styles.dotTouchable}
              >
                <Text style={styles.dot}>●</Text>
              </TouchableOpacity>

              <View style={{ width: 50 }} />

              <TouchableOpacity
                ref={ref => dotRefs.current[`image-${item.word}`] = ref}
                onPress={() => handleDotPress('image', item.word)}
                style={styles.dotTouchable}
              >
                <Text style={styles.dot}>●</Text>
              </TouchableOpacity>

              <Image source={{ uri: item.image }} style={styles.image} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#ff6b6b' }]} onPress={resetLines}>
          <Text style={styles.buttonText}>🔁 Reset Lines</Text>
        </TouchableOpacity>

        <View style={styles.navRow}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/long(i)1')}>
            <Text style={styles.buttonText}>⬅ Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/short(o)')}>
            <Text style={styles.buttonText}>Finish</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  matchingArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  matchContent: { zIndex: 1, justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 15, paddingHorizontal: 20 },
  word: { fontSize: 18, fontWeight: '500', width: 60, textAlign: 'right' },
  dotTouchable: { padding: 15, marginHorizontal: 5 },
  dot: { fontSize: 24, color: '#2a52be' },
  image: { width: 60, height: 60, resizeMode: 'contain', marginLeft: 10 },
  bottomButtons: { paddingVertical: 20, alignItems: 'center' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 20 },
  button: { backgroundColor: '#2a52be', padding: 15, borderRadius: 8, minWidth: 130, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
