import { supabase } from '../../../lib/supabaseClient';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const notesService = {
  async getNotes() {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data as Note[];
  },

  async getNoteById(id: string) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Note;
  },

  async createNote(userId: string) {
    const { data, error } = await supabase
      .from('notes')
      .insert([{ user_id: userId, title: 'Untitled', content: '' }])
      .select()
      .single();

    if (error) throw error;
    return data as Note;
  },

  async updateNote(id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) {
    const { data, error } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Note;
  },

  async deleteNote(id: string) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
