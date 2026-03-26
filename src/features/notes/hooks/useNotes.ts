import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesService, Note } from '../services/notesService';
import { useAuth } from '../../../context/AuthContext';

export const useNotes = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const notesQuery = useQuery({
    queryKey: ['notes'],
    queryFn: notesService.getNotes,
    enabled: !!user,
  });

  const createNoteMutation = useMutation({
    mutationFn: () => notesService.createNote(user!.id),
    onSuccess: (newNote) => {
      queryClient.setQueryData(['notes'], (old: Note[] | undefined) => [newNote, ...(old || [])]);
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Pick<Note, 'title' | 'content'>> }) =>
      notesService.updateNote(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['notes'] });
      const previousNotes = queryClient.getQueryData(['notes']);

      queryClient.setQueryData(['notes'], (old: Note[] | undefined) =>
        old?.map((note) => (note.id === id ? { ...note, ...updates } : note))
      );

      return { previousNotes };
    },
    onError: (_err, _newNote, context) => {
      queryClient.setQueryData(['notes'], context?.previousNotes);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => notesService.deleteNote(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notes'] });
      const previousNotes = queryClient.getQueryData(['notes']);

      queryClient.setQueryData(['notes'], (old: Note[] | undefined) =>
        old?.filter((note) => note.id !== id)
      );

      return { previousNotes };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(['notes'], context?.previousNotes);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return {
    notes: notesQuery.data || [],
    isLoading: notesQuery.isLoading,
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
  };
};
