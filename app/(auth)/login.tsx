import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '@/store/themeStore';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const { handleSignIn, redirectIfAuthenticated, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to home
    redirectIfAuthenticated();
  }, [redirectIfAuthenticated]);

  const onLogin = async () => {
    const success = await handleSignIn(email, password);
    if (success) {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, isDarkMode && styles.titleDark]}>Welcome Back</Text>
            <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>
              Sign in to continue to your collection
            </Text>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDarkMode && styles.labelDark]}>Email</Text>
              <View style={[styles.inputContainer, isDarkMode && styles.inputContainerDark]}>
                <Mail size={20} color={isDarkMode ? '#A0A0A5' : '#8E8E93'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark]}
                  placeholder="Enter your email"
                  placeholderTextColor={isDarkMode ? '#A0A0A5' : '#8E8E93'}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDarkMode && styles.labelDark]}>Password</Text>
              <View style={[styles.inputContainer, isDarkMode && styles.inputContainerDark]}>
                <Lock size={20} color={isDarkMode ? '#A0A0A5' : '#8E8E93'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, isDarkMode && styles.inputDark]}
                  placeholder="Enter your password"
                  placeholderTextColor={isDarkMode ? '#A0A0A5' : '#8E8E93'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  {showPassword ? (
                    <EyeOff size={20} color={isDarkMode ? '#A0A0A5' : '#8E8E93'} />
                  ) : (
                    <Eye size={20} color={isDarkMode ? '#A0A0A5' : '#8E8E93'} />
                  )}
                </Pressable>
              </View>
            </View>

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={onLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </Pressable>

            <View style={styles.footer}>
              <Text style={[styles.footerText, isDarkMode && styles.footerTextDark]}>
                Don't have an account?{' '}
              </Text>
              <Link href="/signup" asChild>
                <Pressable>
                  <Text style={styles.linkText}>Sign Up</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#1C1C1E',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000000',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  subtitleDark: {
    color: '#A0A0A5',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000000',
  },
  labelDark: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9F9F9',
  },
  inputContainerDark: {
    borderColor: '#3A3A3C',
    backgroundColor: '#2C2C2E',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#000000',
  },
  inputDark: {
    color: '#FFFFFF',
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A5',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  footerTextDark: {
    color: '#A0A0A5',
  },
  linkText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
});