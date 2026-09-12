import React, { useState, useCallback, useMemo } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  TextInput 
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useMenuItems } from '../hooks/useMenuItems';
import { statusOf } from '../lib/stockRules';
import { MenuItem } from '../types/menuItem';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type FilterType = 'all' | 'in_stock' | 'stopped';

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { items, loading, error, reload } = useMenuItems();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  // Фильтрация и поиск по элементам
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Фильтр по названию 
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Фильтр по статусу
      const status = statusOf(item.stock);
      let matchesFilter = true;
      if (activeFilter === 'in_stock') {
        matchesFilter = status === 'in_stock' || status === 'low'; 
      } else if (activeFilter === 'stopped') {
        matchesFilter = status === 'stopped';
      }

      return matchesSearch && matchesFilter;
    });
  }, [items, searchQuery, activeFilter]);

  const renderStatusBadge = (stock: number) => {
    const status = statusOf(stock);
    if (status === 'stopped') {
      return <View style={[styles.badge, styles.badgeStopped]}><Text style={styles.badgeText}>Стоп</Text></View>;
    }
    if (status === 'low') {
      return <View style={[styles.badge, styles.badgeLow]}><Text style={styles.badgeText}>Мало ({stock})</Text></View>;
    }
    return <View style={[styles.badge, styles.badgeInStock]}><Text style={styles.badgeText}>{stock} шт.</Text></View>;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff4757" />
        <Text style={styles.loadingText}>Загружаем меню...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={reload}>
          <Text style={styles.retryButtonText}>Повторить попытку</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск по названию..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        
        <View style={styles.filterTabs}>
          <TouchableOpacity 
            style={[styles.tab, activeFilter === 'all' && styles.activeTab]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.tabText, activeFilter === 'all' && styles.activeTabText]}>Все</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tab, activeFilter === 'in_stock' && styles.activeTab]}
            onPress={() => setActiveFilter('in_stock')}
          >
            <Text style={[styles.tabText, activeFilter === 'in_stock' && styles.activeTabText]}>В продаже</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tab, activeFilter === 'stopped' && styles.activeTab]}
            onPress={() => setActiveFilter('stopped')}
          >
            <Text style={[styles.tabText, activeFilter === 'stopped' && styles.activeTabText]}>В стопе</Text>
          </TouchableOpacity>
        </View>

        {/* Счетчик по ТЗ */}
        <Text style={styles.counterText}>
          Показано: {filteredItems.length} из {items.length}
        </Text>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('EditStock', { item })}
          >
            <View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            {renderStatusBadge(item.stock)}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.centerEmpty}>
            <Text style={styles.emptyText}>Ничего не найдено</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  listContainer: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  centerEmpty: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#888', fontSize: 16 },
  loadingText: { color: '#aaa', marginTop: 10 },
  errorText: { color: '#ff4757', fontSize: 16, textAlign: 'center', marginBottom: 15 },
  retryButton: { backgroundColor: '#ff4757', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: '#fff', fontWeight: 'bold' },
  
  filterContainer: { padding: 16, paddingBottom: 8, backgroundColor: '#181818', borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  searchInput: {
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
  },
  filterTabs: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  tab: { 
    flex: 1, 
    paddingVertical: 8, 
    alignItems: 'center', 
    borderRadius: 6, 
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#333' 
  },
  activeTab: { backgroundColor: '#ff4757', borderColor: '#ff4757' },
  tabText: { color: '#aaa', fontSize: 13, fontWeight: '600' },
  activeTabText: { color: '#fff' },
  counterText: { color: '#666', fontSize: 12, textAlign: 'right' },

  card: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  itemTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  itemCategory: { color: '#888', fontSize: 13 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  badgeStopped: { backgroundColor: 'rgba(255, 71, 87, 0.2)' },
  badgeLow: { backgroundColor: 'rgba(255, 165, 2, 0.2)' },
  badgeInStock: { backgroundColor: 'rgba(46, 213, 115, 0.2)' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});