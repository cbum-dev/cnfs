import { useState } from 'react';
import { View, TextInput, Pressable, ActivityIndicator, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function LoginScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setError(error.message);
      return;
    }
    setSession(data.session ?? null);
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 justify-center px-6 bg-gray-100">
      <Text className="text-3xl font-bold mb-8 text-gray-900">SwapStyle</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mb-4 rounded-xl bg-white px-4 py-3 text-base border border-gray-200"
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mb-4 rounded-xl bg-white px-4 py-3 text-base border border-gray-200"
            placeholder="Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {error && <Text className="text-red-500 mb-3">{error}</Text>}

      <Pressable
        className="h-12 rounded-xl bg-black items-center justify-center mb-4"
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold">Log in</Text>
        )}
      </Pressable>

      <View className="flex-row justify-center">
        <Text className="text-gray-600">New here? </Text>
        <Link href="/(auth)/signup" asChild>
          <Pressable>
            <Text className="text-black font-semibold">Sign up</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
