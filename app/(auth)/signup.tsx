import { useState } from 'react';
import { View, TextInput, Pressable, ActivityIndicator, Text, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { supabase } from '@/lib/supabase';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  display_name: z.string().min(2),
});

type FormValues = z.infer<typeof schema>;

export default function SignupScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    const userId = data.user?.id;
    if (userId) {
      await supabase.from('users').insert({
        id: userId,
        email: values.email,
        display_name: values.display_name,
      });
    }

    router.replace('/(auth)/login');
  };

  return (
    <ScrollView className="flex-1 px-6 bg-gray-100" contentContainerStyle={{ paddingVertical: 40 }}>
      <Text className="text-3xl font-bold mb-8 text-gray-900">Create account</Text>

      <Controller
        control={control}
        name="display_name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mb-4 rounded-xl bg-white px-4 py-3 text-base border border-gray-200"
            placeholder="Name"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

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
            placeholder="Password (min 6 chars)"
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
          <Text className="text-white font-semibold">Sign up</Text>
        )}
      </Pressable>

      <View className="flex-row justify-center">
        <Text className="text-gray-600">Already have an account? </Text>
        <Link href="/(auth)/login" asChild>
          <Pressable>
            <Text className="text-black font-semibold">Log in</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}
