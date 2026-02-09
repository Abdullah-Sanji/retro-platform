import { defineComponent, computed, onMounted, ref, resolveComponent, mergeProps, withCtx, createTextVNode, useSSRContext, watch, unref } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseEqual, ssrInterpolate, ssrRenderComponent, ssrLooseContain } from "vue/server-renderer";
import { useRouter, useRoute } from "vue-router";
import { useUser } from "@clerk/vue";
import { u as useMutation, a as api, b as useNotification, c as useQuery, d as useFullPermission, J as JoinModal } from "./marketing-DKkPQd66.js";
import { R as RetroBoard } from "./retro-DsDD_Z-a.js";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SessionSetup",
  __ssrInlineRender: true,
  emits: ["sessionCreated"],
  setup(__props, { emit: __emit }) {
    const { user } = useUser();
    useMutation(api.sessions.createSession);
    useMutation(api.users.syncClerkUser);
    useNotification();
    const { isFullPermissionMode } = useFullPermission();
    useQuery(
      api.users.getCurrentUser,
      computed(() => {
        var _a;
        return ((_a = user.value) == null ? void 0 : _a.id) ? { clerkId: user.value.id } : "skip";
      })
    );
    computed(() => {
      return "pro";
    });
    const isFreeTier = computed(() => !isFullPermissionMode);
    const isProTier = computed(() => isFullPermissionMode);
    onMounted(() => {
      if (user.value) {
        facilitatorName.value = user.value.fullName || user.value.firstName || "";
      }
    });
    const title = ref("");
    const teamName = ref("");
    const facilitatorName = ref("");
    const templateType = ref("mad_sad_glad");
    const customColumns = ref(["", "", ""]);
    const votesPerUser = ref(3);
    const timerEnabled = ref(false);
    const timerDuration = ref(10);
    const isCreating = ref(false);
    const templates = [
      { value: "start_stop_continue", label: "Start / Stop / Continue", description: "Identify actions to start, stop, and continue", requiresPro: true },
      { value: "mad_sad_glad", label: "Mad / Sad / Glad", description: "Express emotions about the sprint", requiresPro: false },
      { value: "went_well_to_improve_actions", label: "Went Well / To Improve / Actions", description: "Classic retrospective format", requiresPro: true },
      { value: "custom", label: "Custom", description: "Create your own columns", requiresPro: true }
    ];
    const isTemplateAvailable = (template) => {
      if (!template.requiresPro) return true;
      return isProTier.value;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50 flex items-center justify-center p-6 relative overflow-hidden" }, _attrs))}><div class="absolute inset-0 overflow-hidden pointer-events-none"><div class="absolute top-20 left-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div><div class="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style="${ssrRenderStyle({ "animation-delay": "2s" })}"></div></div><div class="relative z-10 w-full max-w-3xl"><div class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-gray-100"><div class="text-center mb-10"><div class="inline-block mb-4"><span class="px-4 py-2 bg-sky-100 rounded-full text-sky-700 text-sm font-semibold border border-sky-200"> Step 1 of 1 </span></div><h1 class="text-5xl font-extrabold text-gray-800 mb-3">Create Retrospective</h1><p class="text-xl text-gray-600">Set up your team&#39;s retrospective session</p></div><form class="space-y-6"><div class="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-100"><label class="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg> Session Title * </label><input${ssrRenderAttr("value", title.value)} type="text" placeholder="e.g., Sprint 42 Retrospective" required class="w-full px-5 py-4 border-2 border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all bg-white outline-none text-gray-900 font-medium"></div><div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100"><label class="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> Team Name * </label><input${ssrRenderAttr("value", teamName.value)} type="text" placeholder="e.g., Platform Team" required class="w-full px-5 py-4 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all bg-white outline-none text-gray-900 font-medium"></div><div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100"><label class="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> Your Name (Facilitator) * </label><input${ssrRenderAttr("value", facilitatorName.value)} type="text" placeholder="e.g., Jane Smith" required class="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-white outline-none text-gray-900 font-medium"></div><div><label class="block text-sm font-semibold text-gray-700 mb-2"> Template * </label><div class="space-y-2"><!--[-->`);
      ssrRenderList(templates, (template) => {
        _push(`<label class="${ssrRenderClass([[
          templateType.value === template.value ? "border-blue-500 bg-blue-50" : "border-gray-200",
          isTemplateAvailable(template) ? "cursor-pointer hover:border-blue-400" : "cursor-not-allowed opacity-60"
        ], "flex items-start p-4 border-2 rounded-lg transition-all relative"])}"><input${ssrIncludeBooleanAttr(ssrLooseEqual(templateType.value, template.value)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", template.value)}${ssrIncludeBooleanAttr(!isTemplateAvailable(template)) ? " disabled" : ""} class="mt-1 mr-3"><div class="flex-1"><div class="flex items-center gap-2"><span class="font-semibold text-gray-900">${ssrInterpolate(template.label)}</span>`);
        if (template.requiresPro && isFreeTier.value) {
          _push(`<span class="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full"> PRO </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="text-sm text-gray-600">${ssrInterpolate(template.description)}</div></div></label>`);
      });
      _push(`<!--]--></div>`);
      if (isFreeTier.value) {
        _push(`<div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"><p class="text-sm text-yellow-800"><strong>Free Plan:</strong> Only &quot;Mad / Sad / Glad&quot; template is available. `);
        _push(ssrRenderComponent(_component_router_link, {
          to: "/pricing",
          class: "text-yellow-900 underline font-semibold"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Upgrade to Pro`);
            } else {
              return [
                createTextVNode("Upgrade to Pro")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(` for all templates including custom columns. </p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (templateType.value === "custom") {
        _push(`<div class="space-y-3"><label class="block text-sm font-semibold text-gray-700"> Custom Columns </label><!--[-->`);
        ssrRenderList(customColumns.value, (column, index) => {
          _push(`<div class="flex gap-2"><input${ssrRenderAttr("value", customColumns.value[index])} type="text"${ssrRenderAttr("placeholder", `Column ${index + 1} name`)} class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">`);
          if (customColumns.value.length > 2) {
            _push(`<button type="button" class="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"> Remove </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]-->`);
        if (customColumns.value.length < 6) {
          _push(`<button type="button" class="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600"> + Add Column </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div><label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"> Votes Per User `);
      if (isFreeTier.value) {
        _push(`<span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full"> Max 3 on Free </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><input${ssrRenderAttr("value", votesPerUser.value)} type="number" min="1"${ssrRenderAttr("max", isFreeTier.value ? 3 : 10)}${ssrIncludeBooleanAttr(isFreeTier.value) ? " disabled" : ""} class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"><p class="text-sm text-gray-500 mt-1">`);
      if (isFreeTier.value) {
        _push(`<span>Free plan is limited to 3 votes per user. </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(` Each participant will have ${ssrInterpolate(votesPerUser.value)} vote${ssrInterpolate(votesPerUser.value !== 1 ? "s" : "")} `);
      if (isFreeTier.value) {
        _push(ssrRenderComponent(_component_router_link, {
          to: "/pricing",
          class: "text-blue-600 underline font-semibold"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Upgrade to Pro`);
            } else {
              return [
                createTextVNode("Upgrade to Pro")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (isFreeTier.value) {
        _push(`<span> for unlimited votes.</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p></div><div class="border-2 border-gray-200 rounded-lg p-4"><div class="flex items-center mb-3"><input${ssrIncludeBooleanAttr(Array.isArray(timerEnabled.value) ? ssrLooseContain(timerEnabled.value, null) : timerEnabled.value) ? " checked" : ""} type="checkbox" id="timer-checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"><label for="timer-checkbox" class="ml-2 text-sm font-semibold text-gray-700"> ⏱️ Enable Timer for Collecting Phase </label></div>`);
      if (timerEnabled.value) {
        _push(`<div class="space-y-2"><label class="block text-sm text-gray-700"> Duration (minutes) </label><input${ssrRenderAttr("value", timerDuration.value)} type="number" min="1" max="60" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"><p class="text-xs text-gray-500"> Timer will countdown during the collecting phase </p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button type="submit"${ssrIncludeBooleanAttr(isCreating.value) ? " disabled" : ""} class="relative w-full px-8 py-5 bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 text-white font-bold rounded-2xl hover:from-sky-600 hover:via-blue-600 hover:to-emerald-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl text-lg group overflow-hidden"><span class="relative z-10 flex items-center justify-center gap-3">`);
      if (!isCreating.value) {
        _push(`<svg class="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      if (!isCreating.value) {
        _push(`<span>Create Retrospective</span>`);
      } else {
        _push(`<span class="flex items-center gap-2"><div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> Creating... </span>`);
      }
      _push(`</span><div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div></button></form></div></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/retro/SessionSetup.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SessionSetupPage",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const handleSessionCreated = (data) => {
      localStorage.setItem(`lastSession`, data.shareLink);
      router.push({
        name: "board",
        params: { sessionId: data.sessionId }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$2, mergeProps({ onSessionCreated: handleSessionCreated }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/app/SessionSetupPage.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const SessionSetupPage = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "RetroBoardPage",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const notification = useNotification();
    const userId = ref("");
    const showJoinModal = ref(false);
    const isJoining = ref(false);
    const createUser = useMutation(api.users.createUser);
    const shareLink = computed(() => {
      const query = route.query.session;
      return query || "";
    });
    const sessionQuery = useQuery(
      api.sessions.getSessionByLink,
      () => shareLink.value ? { shareLink: shareLink.value } : "skip"
    );
    const sessionId = computed(() => {
      var _a;
      if (route.params.sessionId) {
        return route.params.sessionId;
      }
      return ((_a = sessionQuery.value) == null ? void 0 : _a._id) || "";
    });
    onMounted(() => {
      checkUserAndShowModal();
    });
    watch(sessionQuery, () => {
      if (sessionQuery.value && !userId.value) {
        checkUserAndShowModal();
      }
    });
    const checkUserAndShowModal = () => {
      if (!sessionId.value) return;
      const storedUserId = localStorage.getItem(`userId_${sessionId.value}`);
      if (storedUserId) {
        userId.value = storedUserId;
      } else if (shareLink.value || sessionQuery.value) {
        showJoinModal.value = true;
      } else {
        notification.error("Session not found. Please check the link.");
        router.push("/");
      }
    };
    const handleJoinFromModal = async (userData) => {
      isJoining.value = true;
      try {
        const session = sessionQuery.value;
        if (!session) {
          notification.error("Session not found. Please check the link.");
          isJoining.value = false;
          return;
        }
        const userResult = await createUser({
          name: userData.name,
          isAnonymous: userData.isAnonymous
        });
        userId.value = userResult.userId;
        localStorage.setItem(`userId_${session._id}`, userResult.userId);
        if (shareLink.value) {
          localStorage.setItem(`lastSession`, shareLink.value);
        }
        showJoinModal.value = false;
      } catch (error) {
        console.error("Failed to join session:", error);
        notification.error("Failed to join session. Please try again.");
      } finally {
        isJoining.value = false;
      }
    };
    const handleCloseModal = () => {
      showJoinModal.value = false;
      router.push("/");
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (sessionId.value && userId.value) {
        _push(ssrRenderComponent(RetroBoard, {
          "session-id": sessionId.value,
          "user-id": userId.value
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(JoinModal, {
        show: showJoinModal.value,
        "session-title": (_a = unref(sessionQuery)) == null ? void 0 : _a.title,
        "is-loading": false,
        onJoin: handleJoinFromModal,
        onClose: handleCloseModal
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/app/RetroBoardPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RetroBoardPage = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main
}, Symbol.toStringTag, { value: "Module" }));
export {
  RetroBoardPage as R,
  SessionSetupPage as S
};
