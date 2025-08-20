import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Speech from 'expo-speech';

const longEWords = [
  {
    keyword: 'feet',
    image: 'https://static.vecteezy.com/system/resources/previews/017/225/832/non_2x/bare-feet-isolated-illustration-cartoon-graphic-vector.jpg',
    options: ['fit', 'feet'],
    correct: 'feet',
  },
  {
    keyword: 'sheep',
    image: 'https://t3.ftcdn.net/jpg/06/10/74/20/360_F_610742016_urXga9BqAKYuWjWin4Q3jEVN3iZu8zl5.jpg',
    options: ['ship', 'sheep'],
    correct: 'sheep',
  },
  {
    keyword: 'leaf',
    image: 'https://img.freepik.com/free-vector/exotic-leaf-plant-jungle-isolated-icon_18591-83631.jpg?semt=ais_hybrid&w=740&q=80',
    options: ['leaf', 'left'],
    correct: 'leaf',
  },
  {
    keyword: 'seat',
    image: 'https://i.pinimg.com/736x/60/9c/89/609c895bbcac0896fd123f44c18b0efa.jpg',
    options: ['sit', 'seat'],
    correct: 'seat',
  },
  {
    keyword: 'peach',
    image: 'https://media.istockphoto.com/id/630020582/vector/isolated-peach-illustration.jpg?s=612x612&w=0&k=20&c=TZ8lp1dNVQ1j_smzs9jRB52iVN-wpRqFlQ13_b37JE0=',
    options: ['pitch', 'peach'],
    correct: 'peach',
  },
  {
    keyword: 'beet',
    image: 'https://t3.ftcdn.net/jpg/03/03/87/88/360_F_303878889_vWoUhtxUk9KKsM9siayP1vMb8LYvKEN6.jpg',
    options: ['bit', 'beet'],
    correct: 'beet',
  },
];

const LongEActivity = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState({});
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleSelect = (index, word) => {
    const correct = longEWords[index].correct;
    const isCorrect = word === correct;

    // Speak feedback
    Speech.stop();
    Speech.speak(isCorrect ? 'Right' : 'Wrong');

    // Update selected
    setSelected(prev => ({ ...prev, [index]: word }));

    // Update score based on selection change
    setScore(prev => {
      const prevWord = selected[index];
      if (!prevWord) return isCorrect ? prev + 1 : prev;

      const wasCorrect = prevWord === correct;
      if (wasCorrect && !isCorrect) return prev - 1;
      if (!wasCorrect && isCorrect) return prev + 1;
      return prev;
    });

    setTimeout(() => {
      Alert.alert(
        isCorrect ? '✅ Correct!' : '❌ Try again',
        `"${word}" ${isCorrect ? 'has' : 'does not have'} the long "e" sound.`
      );
    }, 300);
  };

  const handleShowScore = () => {
    if (Object.keys(selected).length === 0) {
      Speech.speak("You did not select any word.");
    }
    setShowScore(true);
  };

  const handleTryAgain = () => {
    setSelected({});
    setScore(0);
    setShowScore(false);
  };

  const handleNext = () => {
    navigation.navigate('short(i)');
  };

  const isCorrect = (index, word) => word === longEWords[index].correct;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => navigation.navigate('long(e)1')}>
        <Icon name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.heading}>Select the Long "e" Word</Text>

      <ScrollView>
        {longEWords.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.optionsRow}>
              {item.options.map((word, i) => {
                const isSelected = selected[index] === word;
                const isAnswerCorrect = isCorrect(index, word);
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.wordButton,
                      isSelected && {
                        backgroundColor: isAnswerCorrect ? '#b3f7c4' : '#f7b3b3',
                      },
                    ]}
                    onPress={() => handleSelect(index, word)}
                  >
                    <Text style={styles.wordText}>{word}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {showScore && (
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>✅ Correct: {score} / {longEWords.length}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.tryButton} onPress={handleTryAgain}>
                <Text style={styles.tryText}>🔁 Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.goNextButton} onPress={handleNext}>
                <Text style={styles.goNextText}>⏭️ Next Vowel i</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!showScore && (
          <TouchableOpacity style={styles.nextButton} onPress={handleShowScore}>
            <Text style={styles.nextButtonText}>Show Score</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40, backgroundColor: '#fff' },
  heading: { fontSize: 25, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#0073e6' },
  card: { marginBottom: 20, alignItems: 'center' },
  optionsRow: { flexDirection: 'row', gap: 10 },
  wordButton: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  wordText: { fontSize: 18 },
  backArrow: { position: 'absolute', top: 12, left: 16, zIndex: 10 },
  image: {
    width: 180,
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#ccc',
  },
  nextButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    width: '70%',
    alignSelf: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  scoreBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  tryButton: {
    backgroundColor: '#f39c12',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  tryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  goNextButton: {
    backgroundColor: '#0073e6',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  goNextText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LongEActivity;
