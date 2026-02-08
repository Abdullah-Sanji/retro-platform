<script setup lang="ts">
import { useQuery } from '../../composables/useConvex';
import { api } from '../../../convex/_generated/api';

const props = defineProps<{
  sessionId: string;
  userId: string;
}>();

const remainingVotes = useQuery(
  api.votes.getRemainingVotes,
  { sessionId: props.sessionId, userId: props.userId }
);

const voteResults = useQuery(
  api.votes.getVoteResults,
  { sessionId: props.sessionId }
);
</script>

<template>
  <div class="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6 border border-teal-200">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Voting Phase</h3>
        <p class="text-sm text-gray-600 mt-1">
          Click the thumbs up icon on cards or groups to cast your votes
        </p>
      </div>
      
      <div v-if="remainingVotes" class="text-center">
        <div class="text-4xl font-bold text-teal-600">
          {{ remainingVotes.remaining }}
        </div>
        <div class="text-sm text-gray-600">
          votes remaining
        </div>
      </div>
    </div>

    <!-- Vote Progress -->
    <div v-if="remainingVotes" class="mt-4">
      <div class="flex gap-1">
        <div
          v-for="i in remainingVotes.total"
          :key="i"
          class="flex-1 h-2 rounded-full"
          :class="i <= remainingVotes.used ? 'bg-teal-600' : 'bg-gray-300'"
        ></div>
      </div>
      <p class="text-xs text-gray-500 mt-2">
        {{ remainingVotes.used }} of {{ remainingVotes.total }} votes used
      </p>
    </div>

    <!-- Top Voted Items Preview -->
    <div v-if="voteResults && voteResults.length > 0" class="mt-4 pt-4 border-t border-teal-200">
      <h4 class="text-sm font-semibold text-gray-700 mb-2">Top Voted Items</h4>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="item in voteResults.slice(0, 5)"
          :key="item.targetId"
          class="px-3 py-1 bg-white rounded-full border border-teal-300 text-sm"
        >
          <span class="text-teal-600 font-semibold">{{ item.voteCount }}</span>
          <span class="text-gray-600 ml-1">votes</span>
        </div>
      </div>
    </div>
  </div>
</template>