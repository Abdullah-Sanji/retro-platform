<script setup lang="ts">
import { ref, computed} from 'vue';
import { useNotification } from '../../composables/useNotification';
import { useMutation } from '../../composables/useConvex';
import { api } from '../../../convex/_generated/api';
import RetroCard from './RetroCard.vue';
import GroupContainer from './GroupContainer.vue';

const props = defineProps<{
  column: any;
  sessionId: string;
  userId: string;
  cards: any[];
  groups: any[];
  currentPhase: string;
  isFacilitator: boolean;
}>();

const createCard = useMutation(api.cards.createCard);
const notification = useNotification();
const createGroup = useMutation(api.groups.createGroup);

const newCardText = ref('');
const isAddingCard = ref(false);
const isCreatingGroup = ref(false);
const newGroupTitle = ref('');

const ungroupedCards = computed(() => {
  return props.cards.filter(card => !card.groupId);
});

const canAddCards = computed(() => {
  return props.currentPhase === 'collecting' || props.currentPhase === 'grouping';
});

const canGroup = computed(() => {
  return props.currentPhase === 'grouping';
});

const handleAddCard = async () => {
  if (!newCardText.value.trim()) return;
  
  try {
    await createCard({
      sessionId: props.sessionId,
      columnId: props.column._id,
      authorId: props.userId,
      text: newCardText.value.trim(),
    });
    newCardText.value = '';
    isAddingCard.value = false;
  } catch (error) {
    console.error('Failed to create card:', error);
    notification.error('Failed to create card. Please try again.');
  }
};

const handleCreateGroup = async () => {
  if (!newGroupTitle.value.trim()) return;
  
  try {
    await createGroup({
      sessionId: props.sessionId,
      columnId: props.column._id,
      userId: props.userId,
      title: newGroupTitle.value.trim(),
    });
    newGroupTitle.value = '';
    isCreatingGroup.value = false;
  } catch (error) {
    console.error('Failed to create group:', error);
    notification.error('Failed to create group. Please try again.');
  }
};
</script>

<template>
  <div class="glass rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/60">
    <!-- Column Header -->
    <div :class="[column.color, 'px-5 py-4 border-b border-white/40 bg-gradient-to-br from-white/90 to-white/70']">
      <h2 class="text-xl font-bold text-gray-900">
        {{ column.title }}
      </h2>
      <p class="text-sm text-gray-600 mt-1.5 font-medium">
        <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
          {{ cards.length }} {{ cards.length === 1 ? 'card' : 'cards' }}
        </span>
      </p>
    </div>

    <!-- Column Content -->
    <div class="p-5 space-y-4 max-h-[600px] overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white/50">
      <!-- Groups -->
      <GroupContainer
        v-for="group in groups"
        :key="group._id"
        :group="group"
        :cards="cards.filter(c => c.groupId === group._id)"
        :session-id="sessionId"
        :user-id="userId"
        :current-phase="currentPhase"
        :is-facilitator="isFacilitator"
      />

      <!-- Ungrouped Cards -->
      <RetroCard
        v-for="card in ungroupedCards"
        :key="card._id"
        :card="card"
        :user-id="userId"
        :current-phase="currentPhase"
      />

      <!-- Add Card Button/Form -->
      <div v-if="canAddCards">
        <button
          v-if="!isAddingCard"
          @click="isAddingCard = true"
          class="w-full px-5 py-4 border-2 border-dashed border-sky-300 rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-all duration-300 text-sky-600 hover:text-sky-700 font-semibold group"
        >
          <span class="inline-flex items-center gap-2">
            <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add Card
          </span>
        </button>

        <div v-else class="space-y-3 bg-sky-50/50 rounded-xl p-4 border border-sky-100">
          <textarea
            v-model="newCardText"
            placeholder="What's on your mind?"
            class="w-full px-4 py-3 border-2 border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 resize-none transition-all bg-white outline-none"
            rows="3"
            @keydown.enter.meta="handleAddCard"
            @keydown.enter.ctrl="handleAddCard"
          ></textarea>
          <div class="flex gap-2">
            <button
              @click="handleAddCard"
              class="flex-1 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Add
            </button>
            <button
              @click="isAddingCard = false; newCardText = ''"
              class="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-medium"
            >
              Cancel
            </button>
          </div>
          <p class="text-xs text-gray-600 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Tip: Press Cmd/Ctrl + Enter to add quickly
          </p>
        </div>
      </div>

      <!-- Create Group Button (Grouping Phase Only) -->
      <div v-if="canGroup">
        <button
          v-if="!isCreatingGroup"
          @click="isCreatingGroup = true"
          class="w-full px-4 py-3 border-2 border-teal-300 bg-gradient-to-r from-teal-50 to-pink-50 rounded-xl hover:from-teal-100 hover:to-pink-100 transition-all duration-300 text-teal-700 font-semibold text-sm shadow-md hover:shadow-lg"
        >
          + Create Group
        </button>

        <div v-else class="space-y-2 glass-dark rounded-xl p-3">
          <input
            v-model="newGroupTitle"
            placeholder="Group name..."
            class="w-full px-4 py-2.5 border-2 border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white/80 outline-none"
            @keydown.enter="handleCreateGroup"
          />
          <div class="flex gap-2">
            <button
              @click="handleCreateGroup"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-pink-600 text-white rounded-xl hover:from-teal-700 hover:to-pink-700 transition-all text-sm font-semibold shadow-md"
            >
              Create
            </button>
            <button
              @click="isCreatingGroup = false; newGroupTitle = ''"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>