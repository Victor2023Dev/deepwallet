import React, {FunctionComponent, useEffect} from 'react';
import {Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useStyle} from './src/styles';
import {ContentHeightAwareScrollView} from './src/components/scroll-view';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {defaultSpringConfig} from './src/styles/spring';
import LottieView from 'lottie-react-native';
import {FormattedMessage} from 'react-intl';

export const UpdateProgress: FunctionComponent<{
  progress: number;
}> = ({progress}) => {
  const safeAreaInsets = useSafeAreaInsets();
  const style = useStyle();

  return (
    <View style={style.flatten(['absolute-fill', 'background-color-black'])}>
      <View
        style={{
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
          paddingLeft: 28,
          paddingRight: 28,
          flex: 1,
        }}>
        <ContentHeightAwareScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 10,
            }}
          />
          {/* TODO: Add lottie image? */}
          <LottieView
            source={require('./src/public/assets/lottie/codepush/loader.json')}
            loop={true}
            autoPlay={true}
            style={{
              width: 216,
              height: 216,
            }}
          />
          <View
            style={{
              flex: 4,
            }}
          />
          <Text style={style.flatten(['h4', 'color-text-high', 'text-center'])}>
            <FormattedMessage id="update-progress.title" />
          </Text>
          <View
            style={{
              flex: 2,
            }}
          />
          <Text
            style={style.flatten([
              'subtitle4',
              'color-gray-200',
              'text-center',
            ])}>
            <FormattedMessage id="update-progress.paragraph" />
          </Text>
          <View
            style={{
              flex: 3,
            }}
          />
          <Text
            style={style.flatten([
              'subtitle3',
              'color-text-low',
              'text-center',
            ])}>
            <FormattedMessage id="update-progress.loading" />
          </Text>
          <View
            style={{
              flex: 1,
            }}
          />
          <View style={style.flatten(['width-full'])}>
            <SimpleProgressBar progress={Math.min(progress, 1)} />
          </View>
          <View
            style={{
              flex: 1,
            }}
          />
          <Text
            style={style.flatten(['body2', 'color-text-low', 'text-center'])}>
            {`(${Math.floor(progress * 100)}% / 100%)`}
          </Text>
          <View
            style={{
              flex: 10,
            }}
          />
        </ContentHeightAwareScrollView>
      </View>
    </View>
  );
};
const SimpleProgressBar: FunctionComponent<{
  progress: number;
}> = ({progress}) => {
  const style = useStyle();

  const animProgress = useSharedValue(progress);

  useEffect(() => {
    animProgress.value = withSpring(progress, defaultSpringConfig);
  }, [animProgress, progress]);

  const barColor = style.get('color-shentu-400').color;
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: 8,
      borderRadius: 9999,
      backgroundColor: barColor,
      width: `${animProgress.value * 100}%`,
    };
  });

  return (
    <View
      style={{
        height: 8,
        borderRadius: 9999,
        backgroundColor: style.get('color-gray-500').color,
      }}>
      <Reanimated.View style={animatedStyle} />
    </View>
  );
};
