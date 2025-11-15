import { supabase } from './supabase';
import type { Filters, Item, Match, Message, UserProfile } from '@/types';

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as UserProfile | null;
}

export async function fetchItems(filters: Filters): Promise<Item[]> {
  let query = supabase.from('items').select('*').eq('status', 'active');

  if (filters.category) query = query.eq('category', filters.category);
  if (filters.size) query = query.eq('size', filters.size);
  if (filters.maxPrice != null) query = query.lte('price', filters.maxPrice);

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Item[];
}

export async function fetchMatches(userId: string): Promise<Match[]> {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId})`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Match[];
}

export async function fetchMessages(matchId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as Message[];
}
