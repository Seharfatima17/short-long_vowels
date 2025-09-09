import { StyleSheet, TouchableOpacity, View, Text, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define your navigation types
type RootStackParamList = {
  'short(a)': undefined;
  'short-e': undefined;
  'short-i': undefined;
  'short-o': undefined;
  'short-u': undefined;
  // Add other screens as needed
};

type VowelSoundsNavigationProp = StackNavigationProp<RootStackParamList>;

export default function VowelSoundsHome() {
  const navigation = useNavigation<VowelSoundsNavigationProp>();
  const vowels = ['A', 'E', 'I', 'O', 'U'];

  const navigateToVowel = (vowel: string) => {
    switch(vowel) {
      case 'A':
        navigation.navigate('short(a)');
        break;
      case 'E':
        navigation.navigate('short-e');
        break;
      case 'I':
        navigation.navigate('short-i');
        break;
      case 'O':
        navigation.navigate('short-o');
        break;
      case 'U':
        navigation.navigate('short-u');
        break;
      default:
        navigation.navigate('short(a)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Capture the Correct</Text>
        <Text style={styles.title}>Sound Of Vowels</Text>
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
            <Text style={styles.buttonText}>Vowel {vowel}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
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