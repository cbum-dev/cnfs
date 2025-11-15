import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores';

const schema = z.object({
  title: z.string().min(2),
  category: z.string().min(1),
  brand: z.string().optional(),
  size: z.string().optional(),
  condition: z.string().optional(),
  price: z.string().optional(),
  is_swap_only: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function UploadScreen() {
  const userId = useAuthStore((s) => s.session?.user.id);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const pickImage = async () => {
    if (photos.length >= 5) {
      Alert.alert('Limit reached', 'You can upload up to 5 photos per item.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!userId) {
      Alert.alert('Not logged in', 'You need to be logged in to upload items.');
      return;
    }

    try {
      setUploading(true);

      const uploadedUrls: string[] = [];
      for (const uri of photos) {
        const fileExt = uri.split('.').pop() ?? 'jpg';
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const response = await fetch(uri);
        const blob = await response.blob();

        const { data, error } = await supabase.storage.from('items').upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false,
        });

        if (error) throw error;

        const publicUrl = supabase.storage.from('items').getPublicUrl(data.path).data.publicUrl;
        uploadedUrls.push(publicUrl);
      }

      const priceNumber = values.price ? Number(values.price) : null;

      const { error } = await supabase.from('items').insert({
        user_id: userId,
        title: values.title,
        category: values.category,
        brand: values.brand ?? null,
        size: values.size ?? null,
        condition: values.condition ?? null,
        price: priceNumber,
        is_swap_only: values.is_swap_only ?? false,
        photos: uploadedUrls,
        status: 'active',
      });

      if (error) throw error;

      Alert.alert('Success', 'Your item has been uploaded!');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to upload item');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-2xl font-bold mb-4 text-gray-900">Upload Item</Text>

      <Pressable
        className="h-32 rounded-2xl border-2 border-dashed border-gray-400 bg-white items-center justify-center mb-4"
        onPress={pickImage}
      >
        <Text className="text-gray-600">Tap to add photos (max 5)</Text>
      </Pressable>

      <ScrollView horizontal className="mb-4" showsHorizontalScrollIndicator={false}>
        {photos.map((uri) => (
          <Image
            key={uri}
            source={{ uri }}
            className="w-24 h-24 rounded-xl mr-2"
            contentFit="cover"
          />
        ))}
      </ScrollView>

      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mb-3 rounded-xl bg-white px-4 py-3 text-base border border-gray-200"
            placeholder="Title"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mb-3 rounded-xl bg-white px-4 py-3 text-base border border-gray-200"
            placeholder="Category (e.g. Dress, Jacket)"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="brand"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mb-3 rounded-xl bg-white px-4 py-3 text-base border border-gray-200"
            placeholder="Brand (optional)"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="size"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mb-3 rounded-xl bg-white px-4 py-3 text-base border border-gray-200"
            placeholder="Size (e.g. S, M, L)"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="condition"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mb-3 rounded-xl bg-white px-4 py-3 text-base border border-gray-200"
            placeholder="Condition (e.g. Like new)"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="price"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mb-3 rounded-xl bg-white px-4 py-3 text-base border border-gray-200"
            placeholder="Price (leave empty if swap only)"
            keyboardType="numeric"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Pressable
        className="h-12 rounded-xl bg-black items-center justify-center mt-4 mb-10"
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting || uploading}
      >
        {isSubmitting || uploading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold">Publish</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
