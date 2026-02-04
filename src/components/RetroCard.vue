<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMutation, useQuery } from '../composables/useConvex';
import { useNotification } from '../composables/useNotification';
import { api } from '../../convex/_generated/api';

const props = defineProps<{
  card: any;
  userId: string;
  currentPhase: string;
}>();

const updateCard = useMutation(api.cards.updateCard);
const deleteCard = useMutation(api.cards.deleteCard);
const castVote = useMutation(api.votes.castVote);
const removeVote = useMutation(api.votes.removeVote);
const notification = useNotification();

// Get user's votes to check if they've already voted on this card
const userVotes = useQuery(
  api.votes.getRemainingVotes,
  () => ({ sessionId: props.card.sessionId, userId: props.userId })
);

const isEditing = ref(false);
const editText = ref(props.card.text);
const showDeleteConfirm = ref(false);

const isOwnCard = computed(() => props.card.authorId === props.userId);
const canEdit = computed(() => {
  return isOwnCard.value &&
    (props.currentPhase === 'collecting' || props.currentPhase === 'grouping');
});
// Cards in groups cannot be voted on directly - only the group can be voted on
const canVote = computed(() => props.currentPhase === 'voting' && !props.card.groupId);
const canDrag = computed(() => props.currentPhase === 'grouping');

const handleSaveEdit = async () => {
  if (!editText.value.trim()) return;

  try {
    await updateCard({
      cardId: props.card._id,
      userId: props.userId,
      text: editText.value.trim(),
    });
    isEditing.value = false;
    notification.success('Card updated');
  } catch (error) {
    console.error('Failed to update card:', error);
    notification.error('Failed to update card');
  }
};

const handleDelete = async () => {
  showDeleteConfirm.value = false;

  try {
    await deleteCard({
      cardId: props.card._id,
      userId: props.userId,
    });
    notification.success('Card deleted');
  } catch (error) {
    console.error('Failed to delete card:', error);
    notification.error('Failed to delete card');
  }
};

// Check if user has already voted on this card
const existingVote = computed(() => {
  return userVotes.value?.votes?.find(
    (vote: any) => vote.targetId === props.card._id
  );
});

const handleVote = async () => {
  try {
    if (existingVote.value) {
      // Remove the vote if already voted
      await removeVote({
        voteId: existingVote.value._id,
        userId: props.userId,
      });
      notification.success('Vote removed');
    } else {
      // Add a new vote
      await castVote({
        sessionId: props.card.sessionId,
        userId: props.userId,
        targetType: 'card',
        targetId: props.card._id,
      });
      notification.success('Vote added');
    }
  } catch (error: any) {
    notification.error(error.message || 'Failed to vote');
  }
};

// Drag and drop handlers
const handleDragStart = (event: DragEvent) => {
  if (!canDrag.value) return;
  event.dataTransfer!.effectAllowed = 'move';
  event.dataTransfer!.setData('cardId', props.card._id);
  (event.target as HTMLElement).classList.add('opacity-50');
};

const handleDragEnd = (event: DragEvent) => {
  (event.target as HTMLElement).classList.remove('opacity-50');
};

const authorDisplay = computed(() => {
  if (props.card.author?.isAnonymous) {
    return '🎭 Anonymous';
  }
  return props.card.author?.name || 'Unknown';
});
</script>

<template>
  <div
    class="group relative glass rounded-xl p-4 hover:shadow-xl transition-all duration-300 border-2"
    :class="{
      'border-sky-400 ring-2 ring-sky-200': isOwnCard,
      'border-white/50': !isOwnCard,
      'cursor-move hover:scale-105': canDrag
    }"
    :draggable="canDrag"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <!-- Edit Mode -->
    <div v-if="isEditing" class="space-y-2">
      <textarea
        v-model="editText"
        class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows="3"
        @keydown.enter.meta="handleSaveEdit"
        @keydown.enter.ctrl="handleSaveEdit"
        @keydown.esc="isEditing = false; editText = card.text"
      ></textarea>
      <div class="flex gap-2">
        <button
          @click="handleSaveEdit"
          class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Save
        </button>
        <button
          @click="isEditing = false; editText = card.text"
          class="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- View Mode -->
    <div v-else>
      <p class="text-gray-900 whitespace-pre-wrap leading-relaxed">{{ card.text }}</p>

      <!-- Card Footer -->
      <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/60">
        <span class="text-xs text-gray-600 font-medium">
          {{ authorDisplay }}
        </span>

        <!-- Vote Count -->
        <div v-if="card.voteCount > 0" class="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full">
          <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"></path>
          </svg>
          <span class="text-sm font-bold text-emerald-700">{{ card.voteCount }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1.5">
        <!-- Vote Button -->
        <button
          v-if="canVote"
          @click="handleVote"
          class="p-2 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
          :class="existingVote
            ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white ring-2 ring-emerald-300'
            : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600'"
          :title="existingVote ? 'Remove vote' : 'Vote'"
        >
          <svg class="w-4 h-4" :fill="existingVote ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        </button>

        <!-- Edit Button -->
        <button
          v-if="canEdit"
          @click="isEditing = true"
          class="p-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
          title="Edit"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        <!-- Delete Button -->
        <button
          v-if="canEdit"
          @click="showDeleteConfirm = true"
          class="p-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
          title="Delete"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click.self="showDeleteConfirm = false"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Card?</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to delete this card? This action cannot be undone.</p>
        <div class="flex gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>