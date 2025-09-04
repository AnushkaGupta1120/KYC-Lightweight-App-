import {StyleSheet, Dimensions} from 'react-native';
import {colors} from './colors';
import {typography} from './typography';

const {width, height} = Dimensions.get('window');

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgrou
