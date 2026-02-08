<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMutation, useQuery } from '../../composables/useConvex';
import { useNotification } from '../../composables/useNotification';
import { generateAIActionItems } from '../../composables/useAIActionItems';
import { api } from '../../../convex/_generated/api';

const props = defineProps<{
  sessionId: string;
  userId: string;
  actionItems: any[];
  cards: any[];
  groups: any[];
  isFacilitator: boolean;
}>();

const updateActionItem = useMutation(api.actionItems.updateActionItem);
const deleteActionItem = useMutation(api.actionItems.deleteActionItem);
const createActionItem = useMutation(api.actionItems.createActionItem);
const bulkCreateActionItems = useMutation(api.actionItems.bulkCreateActionItems);
const notification = useNotification();

const isGeneratingAI = ref(false);

const voteResults = useQuery(
  api.votes.getVoteResults,
  { sessionId: props.sessionId }
);

const showCreateForm = ref(false);
const showDeleteConfirm = ref(false);
const deleteItemId = ref('');
const newActionTitle = ref('');
const selectedSourceType = ref<'card' | 'group'>('card');
const selectedSourceId = ref('');

const topVotedItems = computed(() => {
  if (!voteResults.value) return [];

  return voteResults.value.slice(0, 10).map((item: any) => {
    let text = '';
    if (item.targetType === 'card') {
      const card = props.cards.find((c: any) => c._id === item.targetId);
      text = card?.text || 'Unknown card';
    } else {
      const group = props.groups.find((g: any) => g._id === item.targetId);
      text = group?.title || 'Unknown group';
    }

    return {
      ...item,
      displayText: text.length > 50 ? text.substring(0, 50) + '...' : text,
    };
  });
});

const votedItemsCount = computed(() => {
  return voteResults.value ? Math.min(voteResults.value.length, 10) : 0;
});

const handleCreateAction = async () => {
  if (!newActionTitle.value.trim() || !selectedSourceId.value) return;

  try {
    await createActionItem({
      sessionId: props.sessionId,
      userId: props.userId,
      sourceType: selectedSourceType.value,
      sourceId: selectedSourceId.value,
      title: newActionTitle.value.trim(),
    });

    newActionTitle.value = '';
    selectedSourceId.value = '';
    showCreateForm.value = false;
    notification.success('Action item created');
  } catch (error) {
    console.error('Failed to create action item:', error);
    notification.error('Failed to create action item');
  }
};

const handleUpdateStatus = async (actionItemId: string, newStatus: string) => {
  try {
    await updateActionItem({
      actionItemId,
      userId: props.userId,
      status: newStatus as any,
    });
    notification.success('Status updated');
  } catch (error) {
    console.error('Failed to update status:', error);
    notification.error('Failed to update status');
  }
};

const handleDelete = (actionItemId: string) => {
  deleteItemId.value = actionItemId;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  try {
    await deleteActionItem({
      actionItemId: deleteItemId.value,
      userId: props.userId,
    });
    showDeleteConfirm.value = false;
    notification.success('Action item deleted');
  } catch (error) {
    console.error('Failed to delete action item:', error);
    notification.error('Failed to delete action item');
  }
};

const handleGenerateAI = async () => {
  if (isGeneratingAI.value) return;

  try {
    isGeneratingAI.value = true;

    // Get top voted items (cards and groups)
    if (!voteResults.value || voteResults.value.length === 0) {
      notification.warning('No voted items found. Please complete voting phase first.');
      return;
    }

    // Take top 10 most voted items
    const topItems = voteResults.value.slice(0, 10);

    // Extract titles/text from top voted items
    const itemTitles: string[] = [];

    for (const item of topItems) {
      if (item.targetType === 'card') {
        const card = props.cards.find((c: any) => c._id === item.targetId);
        if (card && card.text && card.text.trim()) {
          itemTitles.push(card.text);
        }
      } else if (item.targetType === 'group') {
        const group = props.groups.find((g: any) => g._id === item.targetId);
        if (group && group.title && group.title.trim()) {
          itemTitles.push(group.title);
        }
      }
    }

    if (itemTitles.length === 0) {
      notification.warning('No valid items found to generate action items from');
      return;
    }

    notification.info(`Generating AI action items from top ${itemTitles.length} voted items...`);

    // Call AI API
    const recommendations = await generateAIActionItems(itemTitles);

    if (recommendations.length === 0) {
      notification.warning('No action items were generated');
      return;
    }

    // Bulk create action items in Convex
    const result = await bulkCreateActionItems({
      sessionId: props.sessionId,
      userId: props.userId,
      items: recommendations.map(rec => ({
        title: rec.title,
        description: rec.description,
        priority: rec.priority,
        category: rec.category,
      })),
    });

    notification.success(`Successfully created ${result.count} AI-generated action items! 🎉`);
  } catch (error) {
    console.error('Failed to generate AI action items:', error);
    notification.error('Failed to generate AI action items. Please try again.');
  } finally {
    isGeneratingAI.value = false;
  }
};

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  done: 'bg-green-100 text-green-800',
};

const statusLabels = {
  open: 'Open',
  in_progress: 'In Progress',
  done: 'Done',
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">Action Items</h2>

      <div v-if="isFacilitator && !showCreateForm" class="flex gap-2">
        <!-- AI Generate Button -->
        <button
          @click="handleGenerateAI"
          :disabled="isGeneratingAI || !voteResults || voteResults.length === 0"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
            isGeneratingAI || !voteResults || voteResults.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-md hover:shadow-lg'
          ]"
          title="Generate action items using AI based on top voted cards/groups"
        >
          <svg v-if="!isGeneratingAI" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span v-if="isGeneratingAI">Generating...</span>
          <span v-else-if="votedItemsCount > 0">AI Generate ({{ votedItemsCount }} items)</span>
          <span v-else>AI Generate</span>
        </button>

        <!-- Manual Add Button -->
        <button
          @click="showCreateForm = true"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          + Add Action Item
        </button>
      </div>
    </div>

    <!-- Create Form -->
    <div v-if="showCreateForm && isFacilitator" class="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
      <h3 class="font-semibold text-gray-900 mb-3">Create Action Item</h3>
      
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            v-model="newActionTitle"
            placeholder="What needs to be done?"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <select
            v-model="selectedSourceId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select from top voted items...</option>
            <optgroup label="Top Voted">
              <option
                v-for="item in topVotedItems"
                :key="item.targetId"
                :value="item.targetId"
              >
                {{ item.targetType === 'card' ? '📄' : '📁' }} {{ item.displayText }} ({{ item.voteCount }} votes)
              </option>
            </optgroup>
          </select>
        </div>

        <div class="flex gap-2">
          <button
            @click="handleCreateAction"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Create
          </button>
          <button
            @click="showCreateForm = false"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Action Items List -->
    <div v-if="actionItems.length === 0" class="text-center py-8 text-gray-500">
      <svg class="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p>No action items yet</p>
      <p class="text-sm mt-1">Create action items from top voted cards or groups</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="item in actionItems"
        :key="item._id"
        class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
      >
        <!-- Status Dropdown -->
        <select
          :value="item.status"
          @change="handleUpdateStatus(item._id, ($event.target as HTMLSelectElement).value)"
          :class="[
            'px-3 py-1.5 rounded-lg font-medium text-sm border-0 cursor-pointer',
            statusColors[item.status as keyof typeof statusColors]
          ]"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <!-- Title -->
        <div class="flex-1">
          <p class="font-medium text-gray-900">{{ item.title }}</p>
          <p class="text-sm text-gray-500 mt-1">
            Created {{ new Date(item.createdAt).toLocaleDateString() }}
          </p>
        </div>

        <!-- Actions -->
        <div v-if="isFacilitator" class="flex gap-2">
          <button
            @click="handleDelete(item._id)"
            class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click.self="showDeleteConfirm = false"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Action Item?</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to delete this action item? This action cannot be undone.</p>
        <div class="flex gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>