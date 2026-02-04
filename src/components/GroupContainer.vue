<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMutation } from '../composables/useConvex';
import { useNotification } from '../composables/useNotification';
import { api } from '../../convex/_generated/api';
import RetroCard from './RetroCard.vue';

const props = defineProps<{
  group: any;
  cards: any[];
  sessionId: string;
  userId: string;
  currentPhase: string;
  isFacilitator: boolean;
}>();

const updateGroup = useMutation(api.groups.updateGroup);
const deleteGroup = useMutation(api.groups.deleteGroup);
const castVote = useMutation(api.votes.castVote);
const moveCardToGroup = useMutation(api.cards.moveCardToGroup);
const notification = useNotification();

const isEditingTitle = ref(false);
const editTitle = ref(props.group.title);
const showDeleteConfirm = ref(false);
const isDragOver = ref(false);

const canEdit = computed(() => props.currentPhase === 'grouping');
const canVote = computed(() => props.currentPhase === 'voting');

const handleSaveTitle = async () => {
  if (!editTitle.value.trim()) return;

  try {
    await updateGroup({
      groupId: props.group._id,
      title: editTitle.value.trim(),
    });
    isEditingTitle.value = false;
    notification.success('Group updated');
  } catch (error) {
    console.error('Failed to update group:', error);
    notification.error('Failed to update group');
  }
};

const handleDeleteGroup = async () => {
  showDeleteConfirm.value = false;

  try {
    await deleteGroup({ groupId: props.group._id });
    notification.success('Group deleted');
  } catch (error) {
    console.error('Failed to delete group:', error);
    notification.error('Failed to delete group');
  }
};

const handleVoteGroup = async () => {
  try {
    await castVote({
      sessionId: props.sessionId,
      userId: props.userId,
      targetType: 'group',
      targetId: props.group._id,
    });
  } catch (error: any) {
    notification.error(error.message || 'Failed to vote');
  }
};

// Drag and drop handlers
const handleDragOver = (event: DragEvent) => {
  if (props.currentPhase !== 'grouping') return;
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = async (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;

  if (props.currentPhase !== 'grouping') return;

  const cardId = event.dataTransfer!.getData('cardId');
  if (!cardId) return;

  try {
    await moveCardToGroup({
      cardId: cardId as any,
      groupId: props.group._id,
    });
    notification.success('Card moved to group');
  } catch (error) {
    console.error('Failed to move card:', error);
    notification.error('Failed to move card');
  }
};
</script>

<template>
  <div
    class="border-2 rounded-lg p-3 transition-all"
    :class="{
      'border-purple-300 bg-purple-50': !isDragOver,
      'border-purple-500 bg-purple-100 ring-2 ring-purple-400': isDragOver
    }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <!-- Group Header -->
    <div class="flex items-center justify-between mb-3">
      <div v-if="isEditingTitle" class="flex-1 flex gap-2">
        <input
          v-model="editTitle"
          class="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          @keydown.enter="handleSaveTitle"
          @keydown.esc="isEditingTitle = false; editTitle = group.title"
        />
        <button
          @click="handleSaveTitle"
          class="px-2 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
        >
          Save
        </button>
      </div>
      
      <div v-else class="flex-1 flex items-center gap-2">
        <div class="flex items-center gap-2 flex-1">
          <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
          <h3 class="font-semibold text-purple-900">{{ group.title }}</h3>
          <span class="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
            {{ cards.length }} cards
          </span>
        </div>

        <!-- Vote Count -->
        <div v-if="group.voteCount > 0" class="flex items-center gap-1 text-purple-600 bg-white px-2 py-1 rounded">
          <span class="text-sm">👍</span>
          <span class="text-sm font-semibold">{{ group.voteCount }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-1 ml-2">
        <button
          v-if="canVote"
          @click="handleVoteGroup"
          class="p-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          title="Vote for group"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        </button>

        <button
          v-if="canEdit"
          @click="isEditingTitle = true"
          class="p-1.5 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
          title="Edit group name"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        <button
          v-if="canEdit"
          @click="showDeleteConfirm = true"
          class="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          title="Delete group"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Cards in Group -->
    <div class="space-y-2">
      <RetroCard
        v-for="card in cards"
        :key="card._id"
        :card="card"
        :user-id="userId"
        :current-phase="currentPhase"
      />
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click.self="showDeleteConfirm = false"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Group?</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to delete this group? Cards will be ungrouped but not deleted.</p>
        <div class="flex gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="handleDeleteGroup"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>