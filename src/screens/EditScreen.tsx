import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/types';
import { StopReason } from '../types/menuItem';
import { parseStock, statusOf } from '../lib/stockRules';
import { updateMenuItem } from '../api/menuApi';

type EditScreenRouteProp = RouteProp<RootStackParamList, 'EditStock'>;
type EditScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditStock'>;

const REASONS: { key: StopReason; label: string }[] = [
  { key: 'sold_out', label: 'Все продано' },
  { key: 'no_supply', label: 'Нет поставки' },
  { key: 'quality', label: 'Проблемы с качеством' },
  { key: 'other', label: 'Другая причина' },
];

export const EditScreen = () => {
  const route = useRoute<EditScreenRouteProp>();
  const navigation = useNavigation<EditScreenNavigationProp>();
  const { item } = route.params;

  
  const [stockInput, setStockInput] = useState<string>(String(item.stock));
  const [selectedReason, setSelectedReason] = useState<StopReason>(item.reason || 'sold_out');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  
  const parsed = parseStock(stockInput);
  const previewStock = parsed.isValid ? parsed.value : item.stock;
  const currentStatus = statusOf(previewStock);

  const handleSave = async () => {
    // Валидируем инпут перед отправкой
    const validation = parseStock(stockInput);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Некорректное значение');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    //отправка на мок
    const result = await updateMenuItem({
      id: item.id,
      stock: validation.value,
      reason: selectedReason,
      stockStatus: currentStatus,
    });

    setLoading(false);

    if (result.ok) {
      navigation.goBack();
    } else {
      Alert.alert('Ошибка', result.error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
       
        <View style={styles.headerCard}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.category}>{item.category}</Text>
          <View style={styles.statusRow}>
            <Text style={styles.label}>Текущий статус:</Text>
            <Text style={[
              styles.statusText, 
              currentStatus === 'stopped' && styles.textStopped,
              currentStatus === 'low' && styles.textLow,
              currentStatus === 'in_stock' && styles.textInStock,
            ]}>
              {currentStatus === 'stopped' ? '🔴 Стоп' : currentStatus === 'low' ? '🟡 Мало' : '🟢 В наличии'}
            </Text>
          </View>
        </View>

        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Новый остаток (шт.)</Text>
          <TextInput
            style={[styles.input, errorMessage ? styles.inputError : null]}
            value={stockInput}
            onChangeText={(text) => {
              setStockInput(text);
              setErrorMessage(null);
            }}
            keyboardType="number-pad"
            placeholder="Введите остаток"
            placeholderTextColor="#666"
          />
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        </View>

       
        {previewStock <= 3 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Причина стопа / ограничения</Text>
            <View style={styles.reasonsContainer}>
              {REASONS.map((r) => (
                <TouchableOpacity
                  key={r.key}
                  style={[
                    styles.reasonChip,
                    selectedReason === r.key && styles.reasonChipActive,
                  ]}
                  onPress={() => setSelectedReason(r.key)}
                >
                  <Text style={[
                    styles.reasonText,
                    selectedReason === r.key && styles.reasonTextActive,
                  ]}>
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Сохранение...' : 'Сохранить изменения'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContainer: { padding: 16 },
  headerCard: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  category: { color: '#888', fontSize: 14, marginBottom: 16 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#2a2a2a', paddingTop: 12 },
  label: { color: '#aaa', fontSize: 14 },
  statusText: { fontSize: 14, fontWeight: 'bold' },
  textStopped: { color: '#ff4757' },
  textLow: { color: '#ffa502' },
  textInStock: { color: '#2ed573' },
  section: { marginBottom: 24 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 10 },
  input: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
  },
  inputError: { borderColor: '#ff4757' },
  errorText: { color: '#ff4757', fontSize: 12, marginTop: 6 },
  reasonsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  reasonChip: {
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 8,
  },
  reasonChipActive: {
    backgroundColor: 'rgba(255, 71, 87, 0.2)',
    borderColor: '#ff4757',
  },
  reasonText: { color: '#aaa', fontSize: 14 },
  reasonTextActive: { color: '#fff', fontWeight: 'bold' },
  saveButton: {
    backgroundColor: '#ff4757',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});