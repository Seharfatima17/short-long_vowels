import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

export default function VowelSoundsHome() {
  const vowels = ['A', 'E', 'I', 'O', 'U'];

  const navigateToVowel = (vowel: string) => {
    switch(vowel) {
      case 'A':
        router.push('/tabs/short(a)');
        break;
      case 'E':
        router.push('/tabs/short-e');
        break;
      case 'I':
        router.push('/tabs/short-i');
        break;
      case 'O':
        router.push('/tabs/short-o');
        break;
      case 'U':
        router.push('/tabs/short-u');
        break;
      default:
        router.push('/tabs/short(a)');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.title}>Capture the Correct</ThemedText>
        <ThemedText style={styles.title}>Sound Of Vowels</ThemedText>
      </View>
      
      <View style={styles.buttonContainer}>
        {vowels.map((vowel) => (
          <TouchableOpacity
            key={vowel}
            style={[
              styles.vowelButton,
              { backgroundColor: getVowelColor(vowel) }
            ]}
            onPress={() => navigateToVowel(vowel)}
          >
            <ThemedText style={styles.buttonText}>Vowel {vowel}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </ThemedView>
  );
}

// Helper function for different colors per vowel
const getVowelColor = (vowel: string) => {
  switch(vowel) {
    case 'A': return '#e36666ff'; // Vibrant red
    case 'E': return '#2bb1d2ff'; // Fresh teal
    case 'I': return '#d4a22fff'; // Sunny yellow
    case 'O': return '#11b68aff'; // Emerald green
    case 'U': return '#9576f2ff'; // Soft purple
    default: return '#2a52be';  // Default blue
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d616fff',
    paddingHorizontal: 28,
  },
  headerContainer: {
    marginTop: 89,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    color: '#f1f3f6ff',
    lineHeight: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 40,
  },
  vowelButton: {
    paddingVertical: 22,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});