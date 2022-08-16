import { StyleSheet, View } from 'react-native';
import CamaraScreen from './CamaraScreen';

export default function App() {
  return (
    <View style={styles.container}>
      
      <CamaraScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
