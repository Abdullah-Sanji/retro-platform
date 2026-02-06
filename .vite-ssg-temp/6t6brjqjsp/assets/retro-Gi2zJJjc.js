import { defineComponent, ref, computed, mergeProps, useSSRContext, unref, onMounted, onUnmounted, watch } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { u as useMutation, a as api, b as useNotification, c as useQuery, _ as _export_sfc } from "./marketing-sqXyumEb.js";
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "RetroCard",
  __ssrInlineRender: true,
  props: {
    card: {},
    userId: {},
    currentPhase: {}
  },
  setup(__props) {
    const props = __props;
    useMutation(api.cards.updateCard);
    useMutation(api.cards.deleteCard);
    useMutation(api.votes.castVote);
    useMutation(api.votes.removeVote);
    useNotification();
    const userVotes = useQuery(
      api.votes.getRemainingVotes,
      () => ({ sessionId: props.card.sessionId, userId: props.userId })
    );
    const isEditing = ref(false);
    const editText = ref(props.card.text);
    const showDeleteConfirm = ref(false);
    const isOwnCard = computed(() => props.card.authorId === props.userId);
    const canEdit = computed(() => {
      return isOwnCard.value && (props.currentPhase === "collecting" || props.currentPhase === "grouping");
    });
    const canVote = computed(() => props.currentPhase === "voting" && !props.card.groupId);
    const canDrag = computed(() => props.currentPhase === "grouping");
    const existingVote = computed(() => {
      var _a, _b;
      return (_b = (_a = userVotes.value) == null ? void 0 : _a.votes) == null ? void 0 : _b.find(
        (vote) => vote.targetId === props.card._id
      );
    });
    const authorDisplay = computed(() => {
      var _a, _b;
      if ((_a = props.card.author) == null ? void 0 : _a.isAnonymous) {
        return "🎭 Anonymous";
      }
      return ((_b = props.card.author) == null ? void 0 : _b.name) || "Unknown";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["group relative glass rounded-xl p-4 hover:shadow-xl transition-all duration-300 border-2", {
          "border-sky-400 ring-2 ring-sky-200": isOwnCard.value,
          "border-white/50": !isOwnCard.value,
          "cursor-move hover:scale-105": canDrag.value
        }],
        draggable: canDrag.value
      }, _attrs))}>`);
      if (isEditing.value) {
        _push(`<div class="space-y-2"><textarea class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" rows="3">${ssrInterpolate(editText.value)}</textarea><div class="flex gap-2"><button class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"> Save </button><button class="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"> Cancel </button></div></div>`);
      } else {
        _push(`<div><p class="text-gray-900 whitespace-pre-wrap leading-relaxed">${ssrInterpolate(__props.card.text)}</p><div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/60"><span class="text-xs text-gray-600 font-medium">${ssrInterpolate(authorDisplay.value)}</span>`);
        if (__props.card.voteCount > 0) {
          _push(`<div class="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full"><svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"></path></svg><span class="text-sm font-bold text-emerald-700">${ssrInterpolate(__props.card.voteCount)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1.5">`);
        if (canVote.value) {
          _push(`<button class="${ssrRenderClass([existingVote.value ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white ring-2 ring-emerald-300" : "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600", "p-2 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-110"])}"${ssrRenderAttr("title", existingVote.value ? "Remove vote" : "Vote")}><svg class="w-4 h-4"${ssrRenderAttr("fill", existingVote.value ? "currentColor" : "none")} stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg></button>`);
        } else {
          _push(`<!---->`);
        }
        if (canEdit.value) {
          _push(`<button class="p-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-110" title="Edit"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>`);
        } else {
          _push(`<!---->`);
        }
        if (canEdit.value) {
          _push(`<button class="p-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-110" title="Delete"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      }
      if (showDeleteConfirm.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"><div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full"><h3 class="text-lg font-bold text-gray-900 mb-2">Delete Card?</h3><p class="text-gray-600 mb-6">Are you sure you want to delete this card? This action cannot be undone.</p><div class="flex gap-3"><button class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"> Cancel </button><button class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"> Delete </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/retro/RetroCard.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "GroupContainer",
  __ssrInlineRender: true,
  props: {
    group: {},
    cards: {},
    sessionId: {},
    userId: {},
    currentPhase: {},
    isFacilitator: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    useMutation(api.groups.updateGroup);
    useMutation(api.groups.deleteGroup);
    useMutation(api.votes.castVote);
    useMutation(api.votes.removeVote);
    useMutation(api.cards.moveCardToGroup);
    useNotification();
    const userVotes = useQuery(
      api.votes.getRemainingVotes,
      () => ({ sessionId: props.sessionId, userId: props.userId })
    );
    const isEditingTitle = ref(false);
    const editTitle = ref(props.group.title);
    const showDeleteConfirm = ref(false);
    const isDragOver = ref(false);
    const canEdit = computed(() => props.currentPhase === "grouping");
    const canVote = computed(() => props.currentPhase === "voting");
    const existingVote = computed(() => {
      var _a, _b;
      return (_b = (_a = userVotes.value) == null ? void 0 : _a.votes) == null ? void 0 : _b.find(
        (vote) => vote.targetId === props.group._id
      );
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["border-2 rounded-lg p-3 transition-all", {
          "border-purple-300 bg-purple-50": !isDragOver.value,
          "border-purple-500 bg-purple-100 ring-2 ring-purple-400": isDragOver.value
        }]
      }, _attrs))}><div class="flex items-center justify-between mb-3">`);
      if (isEditingTitle.value) {
        _push(`<div class="flex-1 flex gap-2"><input${ssrRenderAttr("value", editTitle.value)} class="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"><button class="px-2 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"> Save </button></div>`);
      } else {
        _push(`<div class="flex-1 flex items-center gap-2"><div class="flex items-center gap-2 flex-1"><svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg><h3 class="font-semibold text-purple-900">${ssrInterpolate(__props.group.title)}</h3><span class="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">${ssrInterpolate(__props.cards.length)} cards </span></div>`);
        if (__props.group.voteCount > 0) {
          _push(`<div class="flex items-center gap-1 text-purple-600 bg-white px-2 py-1 rounded"><span class="text-sm">👍</span><span class="text-sm font-semibold">${ssrInterpolate(__props.group.voteCount)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`<div class="flex gap-1 ml-2">`);
      if (canVote.value) {
        _push(`<button class="${ssrRenderClass([existingVote.value ? "bg-purple-700 text-white ring-2 ring-purple-300 hover:bg-purple-800" : "bg-purple-600 text-white hover:bg-purple-700", "p-1.5 rounded transition-colors"])}"${ssrRenderAttr("title", existingVote.value ? "Remove vote from group" : "Vote for group")}><svg class="w-4 h-4"${ssrRenderAttr("fill", existingVote.value ? "currentColor" : "none")} stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      if (canEdit.value) {
        _push(`<button class="p-1.5 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors" title="Edit group name"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      if (canEdit.value) {
        _push(`<button class="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors" title="Delete group"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="space-y-2"><!--[-->`);
      ssrRenderList(__props.cards, (card) => {
        _push(ssrRenderComponent(_sfc_main$7, {
          key: card._id,
          card,
          "user-id": __props.userId,
          "current-phase": __props.currentPhase
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      if (showDeleteConfirm.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"><div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full"><h3 class="text-lg font-bold text-gray-900 mb-2">Delete Group?</h3><p class="text-gray-600 mb-6">Are you sure you want to delete this group? Cards will be ungrouped but not deleted.</p><div class="flex gap-3"><button class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"> Cancel </button><button class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"> Delete </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/retro/GroupContainer.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "RetroColumn",
  __ssrInlineRender: true,
  props: {
    column: {},
    sessionId: {},
    userId: {},
    cards: {},
    groups: {},
    currentPhase: {},
    isFacilitator: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    useMutation(api.cards.createCard);
    useNotification();
    useMutation(api.groups.createGroup);
    const newCardText = ref("");
    const isAddingCard = ref(false);
    const isCreatingGroup = ref(false);
    const newGroupTitle = ref("");
    const ungroupedCards = computed(() => {
      return props.cards.filter((card) => !card.groupId);
    });
    const canAddCards = computed(() => {
      return props.currentPhase === "collecting" || props.currentPhase === "grouping";
    });
    const canGroup = computed(() => {
      return props.currentPhase === "grouping";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "glass rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/60" }, _attrs))} data-v-1deabdbe><div class="${ssrRenderClass([__props.column.color, "px-5 py-4 border-b border-white/40 bg-gradient-to-br from-white/90 to-white/70"])}" data-v-1deabdbe><h2 class="text-xl font-bold text-gray-900" data-v-1deabdbe>${ssrInterpolate(__props.column.title)}</h2><p class="text-sm text-gray-600 mt-1.5 font-medium" data-v-1deabdbe><span class="inline-flex items-center px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold" data-v-1deabdbe>${ssrInterpolate(__props.cards.length)} ${ssrInterpolate(__props.cards.length === 1 ? "card" : "cards")}</span></p></div><div class="p-5 space-y-4 max-h-[600px] overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white/50" data-v-1deabdbe><!--[-->`);
      ssrRenderList(__props.groups, (group) => {
        _push(ssrRenderComponent(_sfc_main$6, {
          key: group._id,
          group,
          cards: __props.cards.filter((c) => c.groupId === group._id),
          "session-id": __props.sessionId,
          "user-id": __props.userId,
          "current-phase": __props.currentPhase,
          "is-facilitator": __props.isFacilitator
        }, null, _parent));
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(ungroupedCards.value, (card) => {
        _push(ssrRenderComponent(_sfc_main$7, {
          key: card._id,
          card,
          "user-id": __props.userId,
          "current-phase": __props.currentPhase
        }, null, _parent));
      });
      _push(`<!--]-->`);
      if (canAddCards.value) {
        _push(`<div data-v-1deabdbe>`);
        if (!isAddingCard.value) {
          _push(`<button class="w-full px-5 py-4 border-2 border-dashed border-sky-300 rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-all duration-300 text-sky-600 hover:text-sky-700 font-semibold group" data-v-1deabdbe><span class="inline-flex items-center gap-2" data-v-1deabdbe><svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-1deabdbe><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" data-v-1deabdbe></path></svg> Add Card </span></button>`);
        } else {
          _push(`<div class="space-y-3 bg-sky-50/50 rounded-xl p-4 border border-sky-100" data-v-1deabdbe><textarea placeholder="What&#39;s on your mind?" class="w-full px-4 py-3 border-2 border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 resize-none transition-all bg-white outline-none" rows="3" data-v-1deabdbe>${ssrInterpolate(newCardText.value)}</textarea><div class="flex gap-2" data-v-1deabdbe><button class="flex-1 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105" data-v-1deabdbe> Add </button><button class="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-medium" data-v-1deabdbe> Cancel </button></div><p class="text-xs text-gray-600 flex items-center gap-1" data-v-1deabdbe><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-1deabdbe><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-1deabdbe></path></svg> Tip: Press Cmd/Ctrl + Enter to add quickly </p></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (canGroup.value) {
        _push(`<div data-v-1deabdbe>`);
        if (!isCreatingGroup.value) {
          _push(`<button class="w-full px-4 py-3 border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 text-purple-700 font-semibold text-sm shadow-md hover:shadow-lg" data-v-1deabdbe> + Create Group </button>`);
        } else {
          _push(`<div class="space-y-2 glass-dark rounded-xl p-3" data-v-1deabdbe><input${ssrRenderAttr("value", newGroupTitle.value)} placeholder="Group name..." class="w-full px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white/80 outline-none" data-v-1deabdbe><div class="flex gap-2" data-v-1deabdbe><button class="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-semibold shadow-md" data-v-1deabdbe> Create </button><button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all text-sm font-medium" data-v-1deabdbe> Cancel </button></div></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/retro/RetroColumn.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const RetroColumn = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-1deabdbe"]]);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "FacilitatorToolbar",
  __ssrInlineRender: true,
  props: {
    sessionId: {},
    userId: {},
    currentPhase: {},
    sessionData: {}
  },
  emits: ["sessionEnded"],
  setup(__props, { emit: __emit }) {
    useMutation(api.sessions.updatePhase);
    useMutation(api.sessions.endSession);
    useNotification();
    const showPhaseConfirm = ref(false);
    const showEndConfirm = ref(false);
    const pendingPhase = ref("");
    const phases = [
      { value: "collecting", label: "Collecting", color: "from-blue-500 to-cyan-500" },
      { value: "grouping", label: "Grouping", color: "from-purple-500 to-pink-500" },
      { value: "voting", label: "Voting", color: "from-emerald-500 to-green-500" },
      { value: "discussion", label: "Discussion", color: "from-orange-500 to-amber-500" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-3" }, _attrs))}><div class="flex gap-2"><!--[-->`);
      ssrRenderList(phases, (phase) => {
        _push(`<button class="${ssrRenderClass([
          "px-4 py-2 rounded-xl text-sm font-semibold transition-all transform hover:scale-105 shadow-md",
          __props.currentPhase === phase.value ? `bg-gradient-to-r ${phase.color} text-white shadow-lg` : "glass text-gray-700 hover:shadow-lg"
        ])}">${ssrInterpolate(phase.label)}</button>`);
      });
      _push(`<!--]--></div><div class="h-10 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div><button class="px-5 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl text-sm font-semibold hover:from-red-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"> End Session </button><div class="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg> Facilitator </div>`);
      if (showPhaseConfirm.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm h-screen"><div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-100"><div class="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg></div><h3 class="text-2xl font-bold text-gray-800 mb-3 text-center">Change Phase?</h3><p class="text-gray-600 mb-8 text-center text-lg"> Move to <strong class="text-gray-800">${ssrInterpolate((_a = phases.find((p) => p.value === pendingPhase.value)) == null ? void 0 : _a.label)}</strong> phase? </p><div class="flex gap-3"><button class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"> Cancel </button><button class="flex-1 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all shadow-xl"> Confirm </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showEndConfirm.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm h-screen"><div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-100"><div class="w-16 h-16 bg-gradient-to-br from-red-400 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div><h3 class="text-2xl font-bold text-gray-800 mb-3 text-center">End Session?</h3><p class="text-gray-600 mb-8 text-center leading-relaxed"> Are you sure you want to end this retrospective? This will mark the session as completed and you&#39;ll be able to download the action items report. </p><div class="flex gap-3"><button class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"> Cancel </button><button class="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-rose-600 transition-all shadow-xl"> End Session </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/retro/FacilitatorToolbar.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "VotingPanel",
  __ssrInlineRender: true,
  props: {
    sessionId: {},
    userId: {}
  },
  setup(__props) {
    const props = __props;
    const remainingVotes = useQuery(
      api.votes.getRemainingVotes,
      { sessionId: props.sessionId, userId: props.userId }
    );
    const voteResults = useQuery(
      api.votes.getVoteResults,
      { sessionId: props.sessionId }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200" }, _attrs))}><div class="flex items-center justify-between"><div><h3 class="text-lg font-semibold text-gray-900">Voting Phase</h3><p class="text-sm text-gray-600 mt-1"> Click the thumbs up icon on cards or groups to cast your votes </p></div>`);
      if (unref(remainingVotes)) {
        _push(`<div class="text-center"><div class="text-4xl font-bold text-purple-600">${ssrInterpolate(unref(remainingVotes).remaining)}</div><div class="text-sm text-gray-600"> votes remaining </div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(remainingVotes)) {
        _push(`<div class="mt-4"><div class="flex gap-1"><!--[-->`);
        ssrRenderList(unref(remainingVotes).total, (i) => {
          _push(`<div class="${ssrRenderClass([i <= unref(remainingVotes).used ? "bg-purple-600" : "bg-gray-300", "flex-1 h-2 rounded-full"])}"></div>`);
        });
        _push(`<!--]--></div><p class="text-xs text-gray-500 mt-2">${ssrInterpolate(unref(remainingVotes).used)} of ${ssrInterpolate(unref(remainingVotes).total)} votes used </p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(voteResults) && unref(voteResults).length > 0) {
        _push(`<div class="mt-4 pt-4 border-t border-purple-200"><h4 class="text-sm font-semibold text-gray-700 mb-2">Top Voted Items</h4><div class="flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(unref(voteResults).slice(0, 5), (item) => {
          _push(`<div class="px-3 py-1 bg-white rounded-full border border-purple-300 text-sm"><span class="text-purple-600 font-semibold">${ssrInterpolate(item.voteCount)}</span><span class="text-gray-600 ml-1">votes</span></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/retro/VotingPanel.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ActionItemsList",
  __ssrInlineRender: true,
  props: {
    sessionId: {},
    userId: {},
    actionItems: {},
    cards: {},
    groups: {},
    isFacilitator: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    useMutation(api.actionItems.updateActionItem);
    useMutation(api.actionItems.deleteActionItem);
    useMutation(api.actionItems.createActionItem);
    useNotification();
    const voteResults = useQuery(
      api.votes.getVoteResults,
      { sessionId: props.sessionId }
    );
    const showCreateForm = ref(false);
    const showDeleteConfirm = ref(false);
    ref("");
    const newActionTitle = ref("");
    ref("card");
    const selectedSourceId = ref("");
    const topVotedItems = computed(() => {
      if (!voteResults.value) return [];
      return voteResults.value.slice(0, 10).map((item) => {
        let text = "";
        if (item.targetType === "card") {
          const card = props.cards.find((c) => c._id === item.targetId);
          text = (card == null ? void 0 : card.text) || "Unknown card";
        } else {
          const group = props.groups.find((g) => g._id === item.targetId);
          text = (group == null ? void 0 : group.title) || "Unknown group";
        }
        return {
          ...item,
          displayText: text.length > 50 ? text.substring(0, 50) + "..." : text
        };
      });
    });
    const statusColors = {
      open: "bg-blue-100 text-blue-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      done: "bg-green-100 text-green-800"
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-lg shadow-sm border border-gray-200 p-6" }, _attrs))}><div class="flex items-center justify-between mb-4"><h2 class="text-xl font-bold text-gray-900">Action Items</h2>`);
      if (__props.isFacilitator && !showCreateForm.value) {
        _push(`<button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"> + Add Action Item </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (showCreateForm.value && __props.isFacilitator) {
        _push(`<div class="mb-6 p-4 bg-green-50 rounded-lg border border-green-200"><h3 class="font-semibold text-gray-900 mb-3">Create Action Item</h3><div class="space-y-3"><div><label class="block text-sm font-medium text-gray-700 mb-1">Title</label><input${ssrRenderAttr("value", newActionTitle.value)} placeholder="What needs to be done?" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Source</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"><option value=""${ssrIncludeBooleanAttr(Array.isArray(selectedSourceId.value) ? ssrLooseContain(selectedSourceId.value, "") : ssrLooseEqual(selectedSourceId.value, "")) ? " selected" : ""}>Select from top voted items...</option><optgroup label="Top Voted"><!--[-->`);
        ssrRenderList(topVotedItems.value, (item) => {
          _push(`<option${ssrRenderAttr("value", item.targetId)}${ssrIncludeBooleanAttr(Array.isArray(selectedSourceId.value) ? ssrLooseContain(selectedSourceId.value, item.targetId) : ssrLooseEqual(selectedSourceId.value, item.targetId)) ? " selected" : ""}>${ssrInterpolate(item.targetType === "card" ? "📄" : "📁")} ${ssrInterpolate(item.displayText)} (${ssrInterpolate(item.voteCount)} votes) </option>`);
        });
        _push(`<!--]--></optgroup></select></div><div class="flex gap-2"><button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"> Create </button><button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"> Cancel </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.actionItems.length === 0) {
        _push(`<div class="text-center py-8 text-gray-500"><svg class="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg><p>No action items yet</p><p class="text-sm mt-1">Create action items from top voted cards or groups</p></div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(__props.actionItems, (item) => {
          _push(`<div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"><select${ssrRenderAttr("value", item.status)} class="${ssrRenderClass([
            "px-3 py-1.5 rounded-lg font-medium text-sm border-0 cursor-pointer",
            statusColors[item.status]
          ])}"><option value="open">Open</option><option value="in_progress">In Progress</option><option value="done">Done</option></select><div class="flex-1"><p class="font-medium text-gray-900">${ssrInterpolate(item.title)}</p><p class="text-sm text-gray-500 mt-1"> Created ${ssrInterpolate(new Date(item.createdAt).toLocaleDateString())}</p></div>`);
          if (__props.isFacilitator) {
            _push(`<div class="flex gap-2"><button class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      }
      if (showDeleteConfirm.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"><div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full"><h3 class="text-lg font-bold text-gray-900 mb-2">Delete Action Item?</h3><p class="text-gray-600 mb-6">Are you sure you want to delete this action item? This action cannot be undone.</p><div class="flex gap-3"><button class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"> Cancel </button><button class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"> Delete </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/retro/ActionItemsList.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PhaseTimer",
  __ssrInlineRender: true,
  props: {
    endsAt: {}
  },
  emits: ["timeUp"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const now = ref(Date.now());
    const intervalId = ref(null);
    const timeRemaining = computed(() => {
      if (!props.endsAt) return null;
      const remaining = Math.max(0, props.endsAt - now.value);
      return remaining;
    });
    const minutes = computed(() => {
      if (timeRemaining.value === null) return 0;
      return Math.floor(timeRemaining.value / 1e3 / 60);
    });
    const seconds = computed(() => {
      if (timeRemaining.value === null) return 0;
      return Math.floor(timeRemaining.value / 1e3 % 60);
    });
    const formattedTime = computed(() => {
      return `${minutes.value.toString().padStart(2, "0")}:${seconds.value.toString().padStart(2, "0")}`;
    });
    const percentage = computed(() => {
      if (!props.endsAt) return 100;
      const total = props.endsAt - (props.endsAt - (timeRemaining.value || 0));
      return Math.max(0, Math.min(100, (timeRemaining.value || 0) / total * 100));
    });
    const colorClass = computed(() => {
      if (minutes.value > 5) return "text-green-600";
      if (minutes.value > 2) return "text-yellow-600";
      return "text-red-600";
    });
    const ringColor = computed(() => {
      if (minutes.value > 5) return "stroke-green-500";
      if (minutes.value > 2) return "stroke-yellow-500";
      return "stroke-red-500";
    });
    onMounted(() => {
      intervalId.value = window.setInterval(() => {
        now.value = Date.now();
      }, 1e3);
    });
    onUnmounted(() => {
      if (intervalId.value !== null) {
        clearInterval(intervalId.value);
      }
    });
    watch(timeRemaining, (remaining) => {
      if (remaining !== null && remaining === 0) {
        emit("timeUp");
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.endsAt && timeRemaining.value !== null) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-3 bg-white rounded-lg shadow-md px-4 py-2" }, _attrs))}><div class="relative w-12 h-12"><svg class="w-full h-full transform -rotate-90"><circle cx="24" cy="24" r="20" stroke-width="4" fill="none" class="stroke-gray-200"></circle><circle cx="24" cy="24" r="20" stroke-width="4" fill="none" class="${ssrRenderClass([ringColor.value, "transition-all duration-1000 ease-linear"])}"${ssrRenderAttr("stroke-dasharray", `${2 * Math.PI * 20}`)}${ssrRenderAttr("stroke-dashoffset", `${2 * Math.PI * 20 * (1 - percentage.value / 100)}`)}></circle></svg><div class="${ssrRenderClass([colorClass.value, "absolute inset-0 flex items-center justify-center text-xs font-bold"])}"> ⏱️ </div></div><div><div class="${ssrRenderClass([colorClass.value, "text-2xl font-bold font-mono"])}">${ssrInterpolate(formattedTime.value)}</div><div class="text-xs text-gray-500">Time Remaining</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/retro/PhaseTimer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "RetroBoard",
  __ssrInlineRender: true,
  props: {
    sessionId: {},
    userId: {}
  },
  setup(__props) {
    const notification = useNotification();
    const props = __props;
    const sessionData = useQuery(
      api.sessions.getSessionDetails,
      { sessionId: props.sessionId }
    );
    const isFacilitator = computed(() => {
      var _a, _b;
      return ((_b = (_a = sessionData.value) == null ? void 0 : _a.session) == null ? void 0 : _b.facilitatorId) === props.userId;
    });
    const currentPhase = computed(() => {
      var _a, _b;
      return ((_b = (_a = sessionData.value) == null ? void 0 : _a.session) == null ? void 0 : _b.phase) || "collecting";
    });
    const phaseLabel = computed(() => {
      const labels = {
        collecting: "Adding Cards",
        grouping: "Grouping Ideas",
        voting: "Voting",
        discussion: "Discussion",
        completed: "Completed"
      };
      return labels[currentPhase.value] || "Unknown";
    });
    const showVotingPanel = computed(() => {
      return currentPhase.value === "voting";
    });
    const showActionItems = computed(() => {
      return currentPhase.value === "discussion" || currentPhase.value === "completed";
    });
    const showTimer = computed(() => {
      var _a, _b;
      return currentPhase.value === "collecting" && ((_b = (_a = sessionData.value) == null ? void 0 : _a.session) == null ? void 0 : _b.timerEndsAt);
    });
    const handleTimeUp = () => {
      notification.warning("Time is up for the collecting phase!", 1e4);
    };
    const handleSessionEnded = async () => {
      var _a, _b;
      try {
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import("docx");
        const { saveAs } = await import("file-saver");
        const session = (_a = sessionData.value) == null ? void 0 : _a.session;
        const actionItems = ((_b = sessionData.value) == null ? void 0 : _b.actionItems) || [];
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                text: "Retrospective Summary",
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 }
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Session: ", bold: true }),
                  new TextRun((session == null ? void 0 : session.title) || "Untitled")
                ],
                spacing: { after: 200 }
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Team: ", bold: true }),
                  new TextRun((session == null ? void 0 : session.teamName) || "Unknown")
                ],
                spacing: { after: 200 }
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Date: ", bold: true }),
                  new TextRun(new Date((session == null ? void 0 : session.createdAt) || Date.now()).toLocaleDateString())
                ],
                spacing: { after: 400 }
              }),
              new Paragraph({
                text: "Action Items",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 300 }
              }),
              ...actionItems.flatMap((item, index) => [
                new Paragraph({
                  children: [
                    new TextRun({ text: `${index + 1}. `, bold: true }),
                    new TextRun({ text: item.title })
                  ],
                  spacing: { after: 100 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: "   Status: ", bold: true }),
                    new TextRun(item.status)
                  ],
                  spacing: { after: 100 }
                }),
                ...item.ownerId ? [new Paragraph({
                  children: [
                    new TextRun({ text: "   Owner: ", bold: true }),
                    new TextRun("Assigned")
                  ],
                  spacing: { after: 200 }
                })] : []
              ]),
              ...actionItems.length === 0 ? [
                new Paragraph({
                  text: "No action items created.",
                  italics: true
                })
              ] : []
            ]
          }]
        });
        const blob = await Packer.toBlob(doc);
        const fileName = `${(session == null ? void 0 : session.title) || "Retrospective"}_ActionItems_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.docx`;
        saveAs(blob, fileName);
        notification.success("Action items report downloaded!");
      } catch (error) {
        console.error("Failed to generate report:", error);
        notification.error("Failed to generate report");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30" }, _attrs))} data-v-9844a659><header class="glass backdrop-blur-xl border-b border-white/50 sticky top-0 z-10 shadow-lg" data-v-9844a659><div class="max-w-7xl mx-auto px-6 py-5" data-v-9844a659><div class="flex items-center justify-between" data-v-9844a659><div class="flex-1" data-v-9844a659><div class="flex items-center gap-3 mb-2" data-v-9844a659><div class="w-2 h-2 rounded-full bg-green-500 animate-pulse" data-v-9844a659></div><span class="text-xs font-semibold text-purple-600 uppercase tracking-wider" data-v-9844a659>Live Session</span></div><h1 class="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent" data-v-9844a659>${ssrInterpolate((_b = (_a = unref(sessionData)) == null ? void 0 : _a.session) == null ? void 0 : _b.title)}</h1><p class="text-sm text-gray-600 mt-2 font-medium" data-v-9844a659>${ssrInterpolate((_d = (_c = unref(sessionData)) == null ? void 0 : _c.session) == null ? void 0 : _d.teamName)} <span class="mx-2 text-gray-400" data-v-9844a659>•</span><span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700" data-v-9844a659>${ssrInterpolate(phaseLabel.value)}</span></p></div>`);
      if (showTimer.value) {
        _push(`<div class="mx-6" data-v-9844a659>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          "ends-at": (_f = (_e = unref(sessionData)) == null ? void 0 : _e.session) == null ? void 0 : _f.timerEndsAt,
          onTimeUp: handleTimeUp
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (isFacilitator.value) {
        _push(`<div class="flex items-center gap-3" data-v-9844a659>`);
        _push(ssrRenderComponent(_sfc_main$4, {
          "session-id": __props.sessionId,
          "user-id": __props.userId,
          "current-phase": currentPhase.value,
          "session-data": unref(sessionData),
          onSessionEnded: handleSessionEnded
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></header>`);
      if (!unref(sessionData)) {
        _push(`<div class="flex flex-col items-center justify-center h-96" data-v-9844a659><div class="relative" data-v-9844a659><div class="animate-spin rounded-full h-16 w-16 border-4 border-sky-200" data-v-9844a659></div><div class="animate-spin rounded-full h-16 w-16 border-t-4 border-sky-500 absolute inset-0" data-v-9844a659></div></div><p class="mt-6 text-gray-600 font-medium" data-v-9844a659>Loading session...</p></div>`);
      } else {
        _push(`<div class="max-w-7xl mx-auto px-6 py-8" data-v-9844a659>`);
        if (showVotingPanel.value) {
          _push(ssrRenderComponent(_sfc_main$3, {
            "session-id": __props.sessionId,
            "user-id": __props.userId,
            class: "mb-6"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="${ssrRenderClass([{
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-3": unref(sessionData).columns.length === 3,
          "grid-cols-1 md:grid-cols-2": unref(sessionData).columns.length === 2,
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-4": unref(sessionData).columns.length === 4
        }, "grid gap-6 mb-6"])}" data-v-9844a659><!--[-->`);
        ssrRenderList(unref(sessionData).columns, (column) => {
          _push(ssrRenderComponent(RetroColumn, {
            key: column._id,
            column,
            "session-id": __props.sessionId,
            "user-id": __props.userId,
            cards: unref(sessionData).cards.filter((c) => c.columnId === column._id),
            groups: unref(sessionData).groups.filter((g) => g.columnId === column._id),
            "current-phase": currentPhase.value,
            "is-facilitator": isFacilitator.value
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
        if (showActionItems.value) {
          _push(ssrRenderComponent(_sfc_main$2, {
            "session-id": __props.sessionId,
            "user-id": __props.userId,
            "action-items": unref(sessionData).actionItems,
            cards: unref(sessionData).cards,
            groups: unref(sessionData).groups,
            "is-facilitator": isFacilitator.value
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/retro/RetroBoard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RetroBoard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9844a659"]]);
export {
  RetroBoard as R
};
