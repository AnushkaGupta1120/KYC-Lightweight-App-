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
    backgroundColor: colors.background,
    padding: 20,
  },
  
  title: {
    fontSize: typography.fontSize.title,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: typography.lineHeight.title,
  },
  
  subtitle: {
    fontSize: typography.fontSize.large,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: typography.lineHeight.large,
  },
  
  description: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: typography.lineHeight.medium,
  },
  
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Screen dimensions
  screenWidth: width,
  screenHeight: height,
});
