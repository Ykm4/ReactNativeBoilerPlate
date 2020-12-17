import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { PAGE_NAMES_HOME } from '../../../const';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../../declarations';
import { AppDispatch, RootState, useSelector } from '../../../redux/store';
import { useDispatch } from 'react-redux';
import {
  fetchGourmet,
  getQueryByRandom,
  randomList,
} from '../../../redux/modules/Gourmet/thunk';
import { ShopCard, ShopCardType } from '../../organisms/ShopCard';
import { useRefresh } from './hooks/useRefresh';
import { gourmetSelector } from '../../../redux/selectors/gourmet';

type Props = {
  navigation: StackNavigationProp<
    HomeStackParamList,
    typeof PAGE_NAMES_HOME.NEWS
  >;
};

export const RandomShop = ({ navigation }: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const { refreshing, onRefresh } = useRefresh();
  useEffect(() => {
    const randomQuery = getQueryByRandom(randomList);
    const promise = dispatch(fetchGourmet(randomQuery));
    return () => {
      promise.abort();
    };
  }, []);

  const shops = useSelector(gourmetSelector);
  // TODO: useSelector vs reselectのパフォーマンスの挙動などをみてみたい
  // const shops: ShopCardType[] = useSelector((state) =>
  //   state.gourmet.shop.map(({ name, address, charter, photo }) => {
  //     const { l } = photo.mobile;
  //     return { name, address, charter, l };
  //   }),
  // );

  const keyExtractor = useCallback((item, index) => `${index}`, []);
  const renderItem = useCallback(({ item }: { item: ShopCardType }) => {
    return <ShopCard cardInfo={item} handlePress={handlePress} />;
  }, []);
  const handlePress = () => {
    console.log('pressed button');
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={shops}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={renderItem}
        onEndReached={(info) => {}}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    fontSize: 20,
  },
});