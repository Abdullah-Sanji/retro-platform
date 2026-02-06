<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '../../composables/useConvex';
import { useNotification } from '../../composables/useNotification';
import { api } from '../../../convex/_generated/api';
import RetroColumn from './RetroColumn.vue';
import FacilitatorToolbar from './FacilitatorToolbar.vue';
import VotingPanel from './VotingPanel.vue';
import ActionItemsList from './ActionItemsList.vue';
import PhaseTimer from './PhaseTimer.vue';
import TimerControls from './TimerControls.vue';

const notification = useNotification();

const props = defineProps<{
  sessionId: string;
  userId: string;
}>();

// Reactive query - auto-updates when data changes
const sessionData = useQuery(
  api.sessions.getSessionDetails,
  { sessionId: props.sessionId }
);

const isFacilitator = computed(() => {
  return sessionData.value?.session?.facilitatorId === props.userId;
});

const currentPhase = computed(() => {
  return sessionData.value?.session?.phase || 'collecting';
});

const phaseLabel = computed(() => {
  const labels: Record<string, string> = {
    collecting: 'Adding Cards',
    grouping: 'Grouping Ideas',
    voting: 'Voting',
    discussion: 'Discussion',
    completed: 'Completed'
  };
  return labels[currentPhase.value] || 'Unknown';
});

const showVotingPanel = computed(() => {
  return currentPhase.value === 'voting';
});

const showActionItems = computed(() => {
  return currentPhase.value === 'discussion' || currentPhase.value === 'completed';
});

const showTimer = computed(() => {
  return currentPhase.value === 'collecting' && sessionData.value?.session?.timerDuration;
});

const handleTimeUp = () => {
  notification.warning('Time is up for the collecting phase!', 10000);
};

const copyShareLink = () => {
  const shareLink = sessionData.value?.session?.shareLink;
  if (shareLink) {
    const fullLink = `${window.location.origin}?session=${shareLink}`;
    navigator.clipboard.writeText(fullLink);
    notification.success('Share link copied to clipboard!');
  } else {
    notification.error('Unable to get share link');
  }
};

const handleSessionEnded = async () => {
  // Generate and download .docx report
  try {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');
    const { saveAs } = await import('file-saver');

    const session = sessionData.value?.session;
    const actionItems = sessionData.value?.actionItems || [];

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: 'Retrospective Summary',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Session: ', bold: true }),
              new TextRun(session?.title || 'Untitled'),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Team: ', bold: true }),
              new TextRun(session?.teamName || 'Unknown'),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Date: ', bold: true }),
              new TextRun(new Date(session?.createdAt || Date.now()).toLocaleDateString()),
            ],
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: 'Action Items',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 300 },
          }),
          ...actionItems.flatMap((item: any, index: number) => [
            new Paragraph({
              children: [
                new TextRun({ text: `${index + 1}. `, bold: true }),
                new TextRun({ text: item.title }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: '   Status: ', bold: true }),
                new TextRun(item.status),
              ],
              spacing: { after: 100 },
            }),
            ...(item.ownerId ? [new Paragraph({
              children: [
                new TextRun({ text: '   Owner: ', bold: true }),
                new TextRun('Assigned'),
              ],
              spacing: { after: 200 },
            })] : []),
          ]),
          ...(actionItems.length === 0 ? [
            new Paragraph({
              text: 'No action items created.',
              italics: true,
            }),
          ] : []),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${session?.title || 'Retrospective'}_ActionItems_${new Date().toISOString().split('T')[0]}.docx`;
    saveAs(blob, fileName);

    notification.success('Action items report downloaded!');
  } catch (error) {
    console.error('Failed to generate report:', error);
    notification.error('Failed to generate report');
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30">
    <!-- Header -->
    <header class="glass backdrop-blur-xl border-b border-white/50 sticky top-0 z-10 shadow-lg">
      <div class="max-w-7xl mx-auto px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span class="text-xs font-semibold text-purple-600 uppercase tracking-wider">Live Session</span>
            </div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              {{ sessionData?.session?.title }}
            </h1>
            <p class="text-sm text-gray-600 mt-2 font-medium">
              {{ sessionData?.session?.teamName }}
              <span class="mx-2 text-gray-400">•</span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700">
                {{ phaseLabel }}
              </span>
            </p>
          </div>

          <!-- Share Link Button -->
          <button
            @click="copyShareLink"
            class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg"
            title="Copy share link"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
            </svg>
            <span class="hidden sm:inline">Share</span>
          </button>

          <!-- Timer Display and Controls -->
          <div v-if="sessionData?.session?.timerDuration" class="flex items-center gap-3 mx-6">
            <!-- Timer Display (show when timer is configured) -->
            <PhaseTimer
              v-if="showTimer"
              :ends-at="sessionData?.session?.timerEndsAt"
              :duration="sessionData?.session?.timerDuration"
              @time-up="handleTimeUp"
            />

            <!-- Timer Controls (facilitator only) -->
            <TimerControls
              v-if="isFacilitator"
              :session-id="sessionId"
              :user-id="userId"
              :timer-duration="sessionData?.session?.timerDuration"
              :timer-ends-at="sessionData?.session?.timerEndsAt"
            />
          </div>

          <div v-if="isFacilitator" class="flex items-center gap-3">
            <FacilitatorToolbar
              :session-id="sessionId"
              :user-id="userId"
              :current-phase="currentPhase"
              :session-data="sessionData"
              @session-ended="handleSessionEnded"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="!sessionData" class="flex flex-col items-center justify-center h-96">
      <div class="relative">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-sky-200"></div>
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-sky-500 absolute inset-0"></div>
      </div>
      <p class="mt-6 text-gray-600 font-medium">Loading session...</p>
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-7xl mx-auto px-6 py-8">
      <!-- Voting Panel -->
      <VotingPanel
        v-if="showVotingPanel"
        :session-id="sessionId"
        :user-id="userId"
        class="mb-6"
      />

      <!-- Columns Grid -->
      <div class="grid gap-6 mb-6" :class="{
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': sessionData.columns.length === 3,
        'grid-cols-1 md:grid-cols-2': sessionData.columns.length === 2,
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-4': sessionData.columns.length === 4,
      }">
        <RetroColumn
          v-for="column in sessionData.columns"
          :key="column._id"
          :column="column"
          :session-id="sessionId"
          :user-id="userId"
          :cards="sessionData.cards.filter(c => c.columnId === column._id)"
          :groups="sessionData.groups.filter(g => g.columnId === column._id)"
          :current-phase="currentPhase"
          :is-facilitator="isFacilitator"
        />
      </div>

      <!-- Action Items -->
      <ActionItemsList
        v-if="showActionItems"
        :session-id="sessionId"
        :user-id="userId"
        :action-items="sessionData.actionItems"
        :cards="sessionData.cards"
        :groups="sessionData.groups"
        :is-facilitator="isFacilitator"
      />
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions for phase changes */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>