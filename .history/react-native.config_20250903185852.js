module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: {
          sourceDir: '../node_modules/react-native-vector-icons/RNVectorIcons',
          pbxprojPath: 'ios/KYCApp.xcodeproj/project.pbxproj',
        },
      },
    },
  },
  assets: ['./src/assets/fonts/', './src/assets/images/'],
};
