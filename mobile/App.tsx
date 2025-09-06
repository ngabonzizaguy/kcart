import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const colors = {
  primary: '#efa7a7',
  secondary: '#ffd972',
  bg: '#eef1f5',
  text: '#1c1c1e',
  muted: '#6b7280',
};

export default function App() {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.container}>
        <View style={s.header}>
          <Text style={s.title}>kcart</Text>
          <Text style={s.subtitle}>iOS-inspired UI (skeleton)</Text>
        </View>

        <View style={s.card}>
          <Text style={s.headline}>Discover</Text>
          <Text style={s.muted}>Food and groceries from top vendors</Text>
          <TouchableOpacity style={s.button}><Text style={s.buttonText}>Open Web Preview</Text></TouchableOpacity>
        </View>

        <View style={s.row}>
          <View style={s.pill}><Text style={s.pillText}>All</Text></View>
          <View style={s.pill}><Text style={s.pillText}>Food</Text></View>
          <View style={s.pill}><Text style={s.pillText}>Grocery</Text></View>
        </View>

        <View style={s.card}><Text style={s.headline}>Wallet</Text><Text style={s.title}>$124.50</Text></View>
        <View style={s.card}><Text style={s.headline}>Profile</Text><Text style={s.muted}>Test User • test@example.com</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 16, gap: 12 },
  header: { paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  subtitle: { color: colors.muted },
  headline: { fontSize: 17, fontWeight: '600', color: colors.text, marginBottom: 4 },
  muted: { color: colors.muted },
  card: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderColor: 'rgba(255,255,255,0.35)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  row: { flexDirection: 'row', gap: 8 },
  pill: { backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  pillText: { color: colors.text, fontSize: 13 },
  button: { marginTop: 12, backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 16, alignItems: 'center' },
  buttonText: { color: '#1c1c1e', fontWeight: '600' },
});
