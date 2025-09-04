import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../styles/colors';
import {typography} from '../styles/typography';

const ProgressIndicator = ({
  currentStep,
  totalSteps,
  stepTitles = [],
  style
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.stepText}>
          चरण {currentStep} / {totalSteps} | Step {currentStep} of {totalSteps}
        </Text>
        <Text style={styles.percentageText}>
          {Math.round(progressPercentage)}%
        </Text>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            {width: `${progressPercentage}%`}
          ]} 
        />
      </View>
      
      {stepTitles[currentStep - 1] && (
        <Text style={styles.currentStepTitle}>
          {stepTitles[currentStep - 1]}
        </Text>
      )}
      
      <View style={styles.stepsContainer}>
        {Array.from({length: totalSteps}, (_, index) => (
          <View
            key={index}
            style={[
              styles.stepDot,
              index < currentStep ? styles.completedStep : styles.pendingStep,
              index === currentStep - 1 && styles.currentStep,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  stepText: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
    color: colors.text,
  },
  
  percentageText: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
  },
  
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  
  currentStepTitle: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  
  completedStep: {
    backgroundColor: colors.primary,
  },
  
  currentStep: {
    backgroundColor: colors.secondary,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  
  pendingStep: {
    backgroundColor: colors.border,
  },
});

export default ProgressIndicator;
