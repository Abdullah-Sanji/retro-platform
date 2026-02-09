import { ref, watch, onUnmounted, computed, inject, provide, defineComponent, mergeProps, useSSRContext, resolveComponent, withCtx, unref, createVNode, toDisplayString, openBlock, createBlock, createTextVNode } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderStyle, ssrRenderComponent, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { useRouter } from "vue-router";
import { useUser, SignUpButton } from "@clerk/vue";
import { anyApi, componentsGeneric } from "convex/server";
import { useHead, useSeoMeta } from "@unhead/vue";
const ConvexClientKey = Symbol("ConvexClient");
function useConvexClient() {
  const client = inject(ConvexClientKey);
  if (!client) {
    throw new Error("Convex client not provided. Make sure to provide the ConvexClient in your app setup.");
  }
  return client;
}
function useQuery(query, argsSource) {
  const client = useConvexClient();
  const data = ref(void 0);
  const isLoading = ref(true);
  const error = ref(null);
  let unsubscribe = null;
  const subscribe = (queryArgs) => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    if (queryArgs === "skip") {
      isLoading.value = false;
      data.value = null;
      return;
    }
    try {
      isLoading.value = true;
      unsubscribe = client.onUpdate(query, queryArgs || {}, (newValue) => {
        data.value = newValue;
        isLoading.value = false;
        error.value = null;
      });
    } catch (e) {
      error.value = e;
      isLoading.value = false;
      console.error("Query subscription error:", e);
    }
  };
  watch(
    () => {
      return typeof argsSource === "function" ? argsSource() : (argsSource == null ? void 0 : argsSource.value) !== void 0 ? argsSource.value : argsSource;
    },
    (newArgs) => {
      subscribe(newArgs);
    },
    { immediate: true }
  );
  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
  return computed(() => data.value);
}
function useMutation(mutation) {
  const client = useConvexClient();
  return async (...args) => {
    try {
      return await client.mutation(mutation, args[0] || {});
    } catch (e) {
      console.error("Mutation error:", e);
      throw e;
    }
  };
}
function useAction(action) {
  const client = useConvexClient();
  return async (...args) => {
    try {
      return await client.action(action, args[0] || {});
    } catch (e) {
      console.error("Action error:", e);
      throw e;
    }
  };
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const NotificationKey = Symbol("notification");
function provideNotification(api2) {
  provide(NotificationKey, api2);
}
function useNotification() {
  const notification = inject(NotificationKey);
  if (!notification) {
    return {
      success: (msg) => console.log("[SUCCESS]", msg),
      error: (msg) => console.error("[ERROR]", msg),
      warning: (msg) => console.warn("[WARNING]", msg),
      info: (msg) => console.info("[INFO]", msg)
    };
  }
  return notification;
}
function useFullPermission() {
  const isFullPermissionMode = true;
  return {
    isFullPermissionMode
  };
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "JoinModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    sessionTitle: {},
    isLoading: { type: Boolean }
  },
  emits: ["join", "close"],
  setup(__props, { emit: __emit }) {
    const userName = ref("");
    const isAnonymous = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm h-screen" }, _attrs))} data-v-476657b6><div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full p-10 transform transition-all border border-gray-100" data-v-476657b6><div class="text-center mb-8" data-v-476657b6><div class="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl animate-float" data-v-476657b6><svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-476657b6><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" data-v-476657b6></path></svg></div><h2 class="text-4xl font-extrabold text-gray-800 mb-3" data-v-476657b6>Join Retrospective</h2>`);
        if (__props.isLoading) {
          _push(`<div class="flex items-center justify-center gap-2 text-gray-600" data-v-476657b6><div class="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent" data-v-476657b6></div><span class="font-medium" data-v-476657b6>Loading session...</span></div>`);
        } else if (__props.sessionTitle) {
          _push(`<p class="text-xl text-gray-600 font-medium" data-v-476657b6>${ssrInterpolate(__props.sessionTitle)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><form class="space-y-6" data-v-476657b6><div class="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-100" data-v-476657b6><label class="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2" data-v-476657b6><svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-476657b6><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-v-476657b6></path></svg> Your Name </label><input${ssrRenderAttr("value", userName.value)} type="text" placeholder="Enter your name (optional)" class="w-full px-5 py-4 border-2 border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all bg-white outline-none text-gray-900 font-medium" autofocus data-v-476657b6><p class="text-xs text-gray-600 mt-3 flex items-center gap-1" data-v-476657b6><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-476657b6><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-476657b6></path></svg> Leave blank to join anonymously </p></div><div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 flex items-start gap-3 border border-emerald-100" data-v-476657b6><input${ssrIncludeBooleanAttr(Array.isArray(isAnonymous.value) ? ssrLooseContain(isAnonymous.value, null) : isAnonymous.value) ? " checked" : ""} type="checkbox" id="anonymous-checkbox" class="w-5 h-5 mt-0.5 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500 bg-white" data-v-476657b6><label for="anonymous-checkbox" class="text-sm text-gray-700 font-medium leading-relaxed" data-v-476657b6> Join as anonymous (your name won&#39;t be shown on cards) </label></div><div class="flex gap-4 pt-2" data-v-476657b6><button type="button"${ssrIncludeBooleanAttr(__props.isLoading) ? " disabled" : ""} class="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed" data-v-476657b6> Cancel </button><button type="submit"${ssrIncludeBooleanAttr(__props.isLoading) ? " disabled" : ""} class="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl" data-v-476657b6>`);
        if (__props.isLoading) {
          _push(`<span class="flex items-center justify-center gap-2" data-v-476657b6><div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" data-v-476657b6></div> Joining... </span>`);
        } else {
          _push(`<span data-v-476657b6>Join Session</span>`);
        }
        _push(`</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/shared/JoinModal.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const JoinModal = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-476657b6"]]);
const api = anyApi;
componentsGeneric();
function useSeo(options) {
  const siteUrl = "https://yourapp.com";
  const siteName = "Retrospective Platform";
  const fullTitle = computed(() => `${options.title} | ${siteName}`);
  const ogImageUrl = computed(
    () => {
      var _a;
      return ((_a = options.ogImage) == null ? void 0 : _a.startsWith("http")) ? options.ogImage : `${siteUrl}${options.ogImage || "/og-default.svg"}`;
    }
  );
  useHead({
    title: fullTitle.value,
    meta: [
      { name: "description", content: options.description },
      { name: "keywords", content: options.keywords || "" }
    ]
  });
  useSeoMeta({
    title: fullTitle.value,
    description: options.description,
    ogTitle: fullTitle.value,
    ogDescription: options.description,
    ogImage: ogImageUrl.value,
    ogType: "website",
    ogSiteName: siteName,
    twitterCard: "summary_large_image",
    twitterTitle: fullTitle.value,
    twitterDescription: options.description,
    twitterImage: ogImageUrl.value
  });
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "HomePage",
  __ssrInlineRender: true,
  setup(__props) {
    useSeo({
      title: "AI-Powered Retrospective Platform - Turn Feedback into Action",
      description: "The only retrospective platform with AI-powered action items. Automatically generate actionable insights from team feedback, export to Word, and drive real change.",
      keywords: "AI retrospective, AI action items, retro platform, agile, scrum, team collaboration, sprint retrospective, AI-powered"
    });
    const router = useRouter();
    const notification = useNotification();
    const { isSignedIn } = useUser();
    const { isFullPermissionMode } = useFullPermission();
    const joinLink = ref("");
    const showJoinModal = ref(false);
    const pendingSessionLink = ref("");
    const isJoining = ref(false);
    const createUser = useMutation(api.users.createUser);
    const sessionQuery = useQuery(
      api.sessions.getSessionByLink,
      () => pendingSessionLink.value ? { shareLink: pendingSessionLink.value } : "skip"
    );
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
        localStorage.setItem(`userId_${session._id}`, userResult.userId);
        localStorage.setItem(`lastSession`, pendingSessionLink.value);
        router.push({
          name: "board",
          params: { sessionId: session._id }
        });
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
      pendingSessionLink.value = "";
      joinLink.value = "";
    };
    const getStartedUrl = computed(() => {
      {
        return "/app/create";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-f3ce2554><div class="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center p-6 relative overflow-hidden" data-v-f3ce2554><div class="absolute inset-0 overflow-hidden pointer-events-none" data-v-f3ce2554><div class="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" data-v-f3ce2554></div><div class="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style="${ssrRenderStyle({ "animation-delay": "2s" })}" data-v-f3ce2554></div><div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float" style="${ssrRenderStyle({ "animation-delay": "4s" })}" data-v-f3ce2554></div></div><div class="text-center max-w-6xl relative z-10 animate-fade-in" data-v-f3ce2554><div class="mb-16" data-v-f3ce2554><div class="inline-block mb-6" data-v-f3ce2554><span class="px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-full text-sm font-bold shadow-lg animate-pulse" data-v-f3ce2554> ⚡ AI-POWERED RETROSPECTIVES </span></div><h1 class="text-7xl md:text-8xl font-extrabold text-gray-800 mb-6 leading-tight tracking-tight" data-v-f3ce2554> Turn Feedback into <span class="block bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent leading-[120px]" data-v-f3ce2554> Actionable Insights </span></h1><p class="text-2xl md:text-3xl text-gray-600 mb-6 max-w-3xl mx-auto font-light leading-relaxed" data-v-f3ce2554> The first retrospective platform with <span class="font-semibold text-teal-600" data-v-f3ce2554>AI-generated action items</span></p><p class="text-lg text-gray-500 mb-10 max-w-2xl mx-auto" data-v-f3ce2554> Let AI analyze your team&#39;s feedback and automatically create prioritized action items. Export everything to Word with one click. </p><div class="flex flex-wrap justify-center gap-3 mb-10" data-v-f3ce2554><div class="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-teal-200 shadow-sm" data-v-f3ce2554><svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f3ce2554><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" data-v-f3ce2554></path></svg><span class="text-sm font-semibold text-gray-700" data-v-f3ce2554>AI Action Items</span></div><div class="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-cyan-200 shadow-sm" data-v-f3ce2554><svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f3ce2554><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-v-f3ce2554></path></svg><span class="text-sm font-semibold text-gray-700" data-v-f3ce2554>Word Export</span></div><div class="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-teal-200 shadow-sm" data-v-f3ce2554><svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f3ce2554><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" data-v-f3ce2554></path></svg><span class="text-sm font-semibold text-gray-700" data-v-f3ce2554>Real-time Sync</span></div><div class="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-cyan-200 shadow-sm" data-v-f3ce2554><svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f3ce2554><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" data-v-f3ce2554></path></svg><span class="text-sm font-semibold text-gray-700" data-v-f3ce2554>Anonymous Feedback</span></div></div><div class="flex flex-col sm:flex-row gap-4 justify-center items-center" data-v-f3ce2554>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: getStartedUrl.value,
        class: "group px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-lg font-bold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-f3ce2554${_scopeId}>${ssrInterpolate(unref(isSignedIn) || unref(isFullPermissionMode) ? "Create Session" : "Get Started")}</span><svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f3ce2554${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" data-v-f3ce2554${_scopeId}></path></svg>`);
          } else {
            return [
              createVNode("span", null, toDisplayString(unref(isSignedIn) || unref(isFullPermissionMode) ? "Create Session" : "Get Started"), 1),
              (openBlock(), createBlock("svg", {
                class: "w-5 h-5 group-hover:translate-x-1 transition-transform",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M13 7l5 5m0 0l-5 5m5-5H6"
                })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        to: "/features",
        class: "px-8 py-4 bg-white/80 backdrop-blur-md text-gray-700 text-lg font-semibold rounded-xl hover:bg-white transition-all border-2 border-gray-200 hover:border-teal-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` See How It Works `);
          } else {
            return [
              createTextVNode(" See How It Works ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16 animate-slide-up" data-v-f3ce2554><div class="group relative" data-v-f3ce2554><div class="absolute inset-0 bg-gradient-to-r from-teal-300 to-cyan-300 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" data-v-f3ce2554></div><div class="relative flex flex-col justify-between h-full bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-teal-100" data-v-f3ce2554><div data-v-f3ce2554><div class="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg" data-v-f3ce2554><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f3ce2554><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" data-v-f3ce2554></path></svg></div><h2 class="text-2xl font-bold text-gray-800 mb-3" data-v-f3ce2554>Create Session</h2><p class="text-gray-600 mb-6 leading-relaxed" data-v-f3ce2554>Start a new AI-powered retrospective and invite your team to collaborate in real-time</p></div>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: getStartedUrl.value,
        class: "block w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(isSignedIn) || unref(isFullPermissionMode) ? "Create New Retro" : "Get Started")}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(isSignedIn) || unref(isFullPermissionMode) ? "Create New Retro" : "Get Started"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="group relative" data-v-f3ce2554><div class="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" data-v-f3ce2554></div><div class="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-cyan-100" data-v-f3ce2554><div class="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg" data-v-f3ce2554><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f3ce2554><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" data-v-f3ce2554></path></svg></div><h2 class="text-2xl font-bold text-gray-800 mb-3" data-v-f3ce2554>Join Session</h2><p class="text-gray-600 mb-6 leading-relaxed" data-v-f3ce2554>Enter the session link to participate and contribute your insights</p><input${ssrRenderAttr("value", joinLink.value)} type="text" placeholder="retro-abc123" class="w-full px-5 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all outline-none bg-white" data-v-f3ce2554><button class="w-full px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl" data-v-f3ce2554> Join Retro </button></div></div></div><div class="mb-20" data-v-f3ce2554><div class="text-center mb-12" data-v-f3ce2554><h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4" data-v-f3ce2554> Powered by <span class="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent" data-v-f3ce2554>Artificial Intelligence</span></h2><p class="text-xl text-gray-600 max-w-2xl mx-auto" data-v-f3ce2554> Let AI do the heavy lifting. Focus on what matters - improving your team. </p></div><div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto" data-v-f3ce2554><div class="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 border-2 border-teal-200 hover:border-teal-400 transition-all hover:shadow-2xl group" data-v-f3ce2554><div class="flex items-start gap-4 mb-6" data-v-f3ce2554><div class="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg" data-v-f3ce2554><svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f3ce2554><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" data-v-f3ce2554></path></svg></div><div data-v-f3ce2554><h3 class="text-2xl font-bold text-gray-800 mb-2" data-v-f3ce2554>AI-Generated Action Items</h3><p class="text-gray-600 leading-relaxed" data-v-f3ce2554> Our AI analyzes your team&#39;s top-voted feedback and automatically generates <span class="font-semibold text-teal-700" data-v-f3ce2554>prioritized, actionable recommendations</span>. No more manual brainstorming - get smart insights in seconds. </p></div></div><div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-teal-200" data-v-f3ce2554><div class="flex items-start gap-3 mb-3" data-v-f3ce2554><div class="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" data-v-f3ce2554><svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" data-v-f3ce2554><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" data-v-f3ce2554></path></svg></div><div class="flex-1" data-v-f3ce2554><p class="text-sm font-semibold text-gray-800" data-v-f3ce2554>Implement 15-minute timeboxed standups</p><p class="text-xs text-gray-600 mt-1" data-v-f3ce2554>High Priority • Process Improvement</p></div></div><div class="flex items-start gap-3 mb-3" data-v-f3ce2554><div class="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" data-v-f3ce2554><svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" data-v-f3ce2554><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" data-v-f3ce2554></path></svg></div><div class="flex-1" data-v-f3ce2554><p class="text-sm font-semibold text-gray-800" data-v-f3ce2554>Create automated deployment pipeline</p><p class="text-xs text-gray-600 mt-1" data-v-f3ce2554>High Priority • Tooling</p></div></div><div class="flex items-start gap-3" data-v-f3ce2554><div class="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" data-v-f3ce2554><svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" data-v-f3ce2554><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" data-v-f3ce2554></path></svg></div><div class="flex-1" data-v-f3ce2554><p class="text-sm font-semibold text-gray-800" data-v-f3ce2554>Schedule weekly team sync meetings</p><p class="text-xs text-gray-600 mt-1" data-v-f3ce2554>Medium Priority • Communication</p></div></div></div></div><div class="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 border-2 border-cyan-200 hover:border-cyan-400 transition-all hover:shadow-2xl group" data-v-f3ce2554><div class="flex items-start gap-4 mb-6" data-v-f3ce2554><div class="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg" data-v-f3ce2554><svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f3ce2554><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-v-f3ce2554></path></svg></div><div data-v-f3ce2554><h3 class="text-2xl font-bold text-gray-800 mb-2" data-v-f3ce2554>Professional Word Export</h3><p class="text-gray-600 leading-relaxed" data-v-f3ce2554> Export your entire retrospective - including all feedback, votes, and AI-generated action items - to a <span class="font-semibold text-cyan-700" data-v-f3ce2554>beautifully formatted Word document</span>. Perfect for sharing with stakeholders or archiving. </p></div></div><div class="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-cyan-200" data-v-f3ce2554><div class="flex items-center justify-between mb-4" data-v-f3ce2554><div class="flex items-center gap-2" data-v-f3ce2554><div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center" data-v-f3ce2554><svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" data-v-f3ce2554><path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" data-v-f3ce2554></path></svg></div><div data-v-f3ce2554><p class="text-sm font-bold text-gray-800" data-v-f3ce2554>Sprint_23_Retro.docx</p><p class="text-xs text-gray-500" data-v-f3ce2554>Generated just now</p></div></div><div class="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full" data-v-f3ce2554> Ready </div></div><div class="space-y-2 text-xs text-gray-600" data-v-f3ce2554><div class="flex items-center gap-2" data-v-f3ce2554><svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" data-v-f3ce2554><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-f3ce2554></path></svg><span data-v-f3ce2554>All feedback cards included</span></div><div class="flex items-center gap-2" data-v-f3ce2554><svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" data-v-f3ce2554><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-f3ce2554></path></svg><span data-v-f3ce2554>Voting results &amp; rankings</span></div><div class="flex items-center gap-2" data-v-f3ce2554><svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" data-v-f3ce2554><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-f3ce2554></path></svg><span data-v-f3ce2554>AI action items with priorities</span></div><div class="flex items-center gap-2" data-v-f3ce2554><svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" data-v-f3ce2554><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-f3ce2554></path></svg><span data-v-f3ce2554>Professional formatting</span></div></div><button class="mt-4 w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2" data-v-f3ce2554><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f3ce2554><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-v-f3ce2554></path></svg><span data-v-f3ce2554>Download Report</span></button></div></div></div></div><div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto" data-v-f3ce2554><div class="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 group shadow-md border border-gray-100" data-v-f3ce2554><div class="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg" data-v-f3ce2554><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f3ce2554><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" data-v-f3ce2554></path></svg></div><h3 class="font-bold text-gray-800 mb-2" data-v-f3ce2554>Real-time Sync</h3><p class="text-sm text-gray-600" data-v-f3ce2554>Instant updates for all participants</p></div><div class="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 group shadow-md border border-gray-100" data-v-f3ce2554><div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg" data-v-f3ce2554><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f3ce2554><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-v-f3ce2554></path></svg></div><h3 class="font-bold text-gray-800 mb-2" data-v-f3ce2554>Anonymous Mode</h3><p class="text-sm text-gray-600" data-v-f3ce2554>Safe space for honest feedback</p></div><div class="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 group shadow-md border border-gray-100" data-v-f3ce2554><div class="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg" data-v-f3ce2554><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f3ce2554><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-v-f3ce2554></path></svg></div><h3 class="font-bold text-gray-800 mb-2" data-v-f3ce2554>Smart Voting</h3><p class="text-sm text-gray-600" data-v-f3ce2554>Prioritize what matters most</p></div><div class="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 group shadow-md border border-gray-100" data-v-f3ce2554><div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg" data-v-f3ce2554><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f3ce2554><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" data-v-f3ce2554></path></svg></div><h3 class="font-bold text-gray-800 mb-2" data-v-f3ce2554>Action Items</h3><p class="text-sm text-gray-600" data-v-f3ce2554>Convert ideas to outcomes</p></div></div></div></div>`);
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/marketing/HomePage.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const HomePage = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-f3ce2554"]]);
const HomePage$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: HomePage
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FeaturesPage",
  __ssrInlineRender: true,
  setup(__props) {
    useSeo({
      title: "Features - Powerful Retrospective Tools",
      description: "Real-time collaboration, anonymous feedback, smart voting, and action tracking. Everything you need for effective team retrospectives.",
      keywords: "retrospective features, retro tools, agile features, team collaboration tools"
    });
    const features = [
      {
        icon: "⚡",
        title: "Real-time Sync",
        description: "Every change appears instantly for all participants. No refresh needed, no delays. True real-time collaboration powered by Convex.",
        gradient: "from-amber-400 to-orange-400"
      },
      {
        icon: "🎭",
        title: "Anonymous Mode",
        description: "Create psychological safety with optional anonymous feedback. Team members can share honest insights without fear.",
        gradient: "from-rose-400 to-pink-400"
      },
      {
        icon: "✅",
        title: "Smart Voting",
        description: "Prioritize discussions with built-in voting. Quickly identify what matters most to your team.",
        gradient: "from-emerald-400 to-green-400"
      },
      {
        icon: "📋",
        title: "Action Items",
        description: "Convert insights into action. Track commitments and ensure follow-through from retrospective to retrospective.",
        gradient: "from-sky-400 to-blue-400"
      },
      {
        icon: "🎨",
        title: "Custom Templates",
        description: "Choose from Start-Stop-Continue, Mad-Sad-Glad, or create your own columns. Adapt to your team's needs.",
        gradient: "from-purple-400 to-indigo-400"
      },
      {
        icon: "📤",
        title: "Export Functionality",
        description: "Export retrospective results as Word documents. Share insights and action items with stakeholders.",
        gradient: "from-teal-400 to-cyan-400"
      }
    ];
    const comparisons = [
      { feature: "Real-time Collaboration", us: true, miro: true, mural: true },
      { feature: "Anonymous Feedback", us: true, miro: false, mural: false },
      { feature: "Setup Time", us: "< 30 seconds", miro: "5+ minutes", mural: "5+ minutes" },
      { feature: "Built for Retros", us: true, miro: false, mural: false },
      { feature: "Price (Team of 10)", us: "Free", miro: "$96/mo", mural: "$119/mo" },
      { feature: "No Learning Curve", us: true, miro: false, mural: false }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50" }, _attrs))}><div class="max-w-7xl mx-auto px-6 py-20"><div class="text-center mb-20"><h1 class="text-6xl font-bold mb-6"><span class="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent"> Powerful Features </span></h1><p class="text-2xl text-gray-600 max-w-3xl mx-auto"> Everything you need for effective retrospectives, nothing you don&#39;t </p></div><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"><!--[-->`);
      ssrRenderList(features, (feature) => {
        _push(`<div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"><div class="${ssrRenderClass(`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-lg`)}">${ssrInterpolate(feature.icon)}</div><h3 class="text-2xl font-bold text-gray-800 mb-4">${ssrInterpolate(feature.title)}</h3><p class="text-gray-600 leading-relaxed">${ssrInterpolate(feature.description)}</p></div>`);
      });
      _push(`<!--]--></div><div class="bg-white rounded-3xl p-10 shadow-xl border border-gray-100"><h2 class="text-4xl font-bold text-center mb-4"><span class="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent"> Why RetroPlatform? </span></h2><p class="text-xl text-gray-600 text-center mb-12"> Built specifically for retrospectives, not adapted from general-purpose tools </p><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b-2 border-gray-200"><th class="text-left py-4 px-6 text-gray-700 font-semibold">Feature</th><th class="text-center py-4 px-6 text-sky-600 font-bold">RetroPlatform</th><th class="text-center py-4 px-6 text-gray-500 font-semibold">Miro</th><th class="text-center py-4 px-6 text-gray-500 font-semibold">Mural</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(comparisons, (row, index) => {
        _push(`<tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors"><td class="py-4 px-6 font-medium text-gray-700">${ssrInterpolate(row.feature)}</td><td class="py-4 px-6 text-center">`);
        if (typeof row.us === "boolean") {
          _push(`<span>`);
          if (row.us) {
            _push(`<span class="text-2xl text-emerald-500">✓</span>`);
          } else {
            _push(`<span class="text-2xl text-gray-300">×</span>`);
          }
          _push(`</span>`);
        } else {
          _push(`<span class="font-semibold text-sky-600">${ssrInterpolate(row.us)}</span>`);
        }
        _push(`</td><td class="py-4 px-6 text-center text-gray-500">`);
        if (typeof row.miro === "boolean") {
          _push(`<span>`);
          if (row.miro) {
            _push(`<span class="text-2xl">✓</span>`);
          } else {
            _push(`<span class="text-2xl text-gray-300">×</span>`);
          }
          _push(`</span>`);
        } else {
          _push(`<span>${ssrInterpolate(row.miro)}</span>`);
        }
        _push(`</td><td class="py-4 px-6 text-center text-gray-500">`);
        if (typeof row.mural === "boolean") {
          _push(`<span>`);
          if (row.mural) {
            _push(`<span class="text-2xl">✓</span>`);
          } else {
            _push(`<span class="text-2xl text-gray-300">×</span>`);
          }
          _push(`</span>`);
        } else {
          _push(`<span>${ssrInterpolate(row.mural)}</span>`);
        }
        _push(`</td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div><div class="text-center mt-20"><h2 class="text-4xl font-bold text-gray-800 mb-6">Ready to get started?</h2><p class="text-xl text-gray-600 mb-8">Create your first retrospective in under 30 seconds</p>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/app/create",
        class: "inline-block px-10 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white text-lg font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Get Started Free `);
          } else {
            return [
              createTextVNode(" Get Started Free ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/marketing/FeaturesPage.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const FeaturesPage = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1
}, Symbol.toStringTag, { value: "Module" }));
function useStripe() {
  const createCheckoutSession = useAction(api.stripe.createCheckoutSession);
  const createPortalSession = useAction(api.stripe.createPortalSession);
  const checkout = async (userId, tier, billingCycle = "yearly") => {
    try {
      const priceIds = {
        monthly: "price_pro_monthly",
        yearly: "price_pro_yearly"
      };
      const priceId = priceIds[billingCycle];
      const result = await createCheckoutSession({
        userId,
        priceId,
        tier
      });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      throw error;
    }
  };
  const manageBilling = async (customerId) => {
    try {
      const result = await createPortalSession({ customerId });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Portal error:", error);
      throw error;
    }
  };
  return {
    checkout,
    manageBilling
  };
}
const proMonthlyPrice = 15;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PricingPage",
  __ssrInlineRender: true,
  setup(__props) {
    useSeo({
      title: "Pricing - Simple, Transparent Plans",
      description: "Simple, transparent pricing for teams of all sizes. Start free, upgrade as you grow.",
      keywords: "retrospective pricing, retro tool cost, agile tool pricing"
    });
    const router = useRouter();
    const { user, isSignedIn } = useUser();
    useStripe();
    useNotification();
    const syncClerkUser = useMutation(api.users.syncClerkUser);
    {
      router.replace("/app/create");
    }
    const isYearly = ref(true);
    const proYearlyPrice = computed(() => {
      const yearlyTotal = proMonthlyPrice * 12;
      const discountedTotal = yearlyTotal * 0.8;
      return Math.round(discountedTotal);
    });
    const proMonthlyEquivalent = computed(() => {
      return Math.round(proYearlyPrice.value / 12);
    });
    const userData = useQuery(
      api.users.getCurrentUser,
      computed(() => {
        var _a;
        return ((_a = user.value) == null ? void 0 : _a.id) ? { clerkId: user.value.id } : "skip";
      })
    );
    watch(
      () => [isSignedIn.value, user.value, userData.value],
      async ([signedIn, currentUser, currentUserData]) => {
        var _a;
        if (signedIn && currentUser && !currentUserData) {
          try {
            await syncClerkUser({
              clerkId: currentUser.id,
              name: currentUser.fullName || currentUser.firstName || "User",
              email: ((_a = currentUser.primaryEmailAddress) == null ? void 0 : _a.emailAddress) || ""
            });
          } catch (error) {
            console.error("Failed to sync user:", error);
          }
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 py-20" }, _attrs))}><div class="max-w-7xl mx-auto px-6"><h1 class="text-6xl font-bold text-center mb-4"><span class="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent"> Simple Pricing </span></h1><p class="text-xl text-gray-600 text-center mb-8"> Start free, upgrade as you grow </p><div class="flex items-center justify-center gap-4 mb-16"><span class="${ssrRenderClass(["text-lg font-semibold transition-colors", !isYearly.value ? "text-gray-900" : "text-gray-500"])}"> Monthly </span><button class="${ssrRenderClass([
        "relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2",
        isYearly.value ? "bg-sky-600" : "bg-gray-300"
      ])}"><span class="${ssrRenderClass([
        "inline-block h-6 w-6 transform rounded-full bg-white transition-transform",
        isYearly.value ? "translate-x-9" : "translate-x-1"
      ])}"></span></button><span class="${ssrRenderClass(["text-lg font-semibold transition-colors", isYearly.value ? "text-gray-900" : "text-gray-500"])}"> Yearly </span>`);
      if (isYearly.value) {
        _push(`<span class="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full"> Save 20% </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="max-w-6xl mx-auto"><div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"><div class="text-center p-8 bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all"><h4 class="text-2xl font-bold text-gray-800 mb-2">Free</h4><p class="text-5xl font-bold text-sky-600 mb-2">$0</p><p class="text-sm text-gray-500 mb-6">Perfect for trying out</p><ul class="text-left text-sm text-gray-600 space-y-3 mb-8"><li class="flex items-center"><span class="text-green-500 mr-2">✓</span> 1 session per month</li><li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Mad, Sad &amp; Glad template</li><li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Up to 5 participants</li><li class="flex items-center"><span class="text-green-500 mr-2">✓</span> 3 votes per user</li><li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Export to Word</li><li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Real-time collaboration</li><li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Anonymous mode</li><li class="flex items-center"><span class="text-gray-400 mr-2">✗</span> <span class="text-gray-400">AI action items</span></li></ul>`);
      if (!unref(isSignedIn)) {
        _push(ssrRenderComponent(unref(SignUpButton), {
          mode: "modal",
          afterSignUpUrl: "/pricing",
          afterSignInUrl: "/pricing"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button class="block w-full px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-all"${_scopeId}> Choose Free Plan </button>`);
            } else {
              return [
                createVNode("button", { class: "block w-full px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-all" }, " Choose Free Plan ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<button class="block w-full px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-all"> Choose Free Plan </button>`);
      }
      _push(`</div><div class="text-center p-8 bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border-2 border-sky-400 shadow-xl hover:shadow-2xl transition-all relative transform scale-105"><div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-sky-600 text-white px-4 py-1 rounded-full text-xs font-bold"> POPULAR </div><h4 class="text-2xl font-bold text-gray-800 mb-2">Pro</h4>`);
      if (isYearly.value) {
        _push(`<div><div class="flex items-center justify-center gap-3 mb-1"><p class="text-3xl font-bold text-gray-400 line-through">$${ssrInterpolate(proMonthlyPrice)}</p><p class="text-5xl font-bold text-sky-600">$${ssrInterpolate(proMonthlyEquivalent.value)}</p></div><p class="text-sm text-gray-500 mb-1">per month</p><p class="text-xs text-gray-400 mb-6">Billed $${ssrInterpolate(proYearlyPrice.value)} yearly</p></div>`);
      } else {
        _push(`<div><p class="text-5xl font-bold text-sky-600 mb-2">$${ssrInterpolate(proMonthlyPrice)}</p><p class="text-sm text-gray-500 mb-6">per month</p></div>`);
      }
      _push(`<ul class="text-left text-sm text-gray-600 space-y-3 mb-8"><li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Unlimited sessions</li><li class="flex items-center"><span class="text-green-500 mr-2">✓</span> All templates + custom</li><li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Unlimited participants</li><li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Unlimited votes</li><li class="flex items-center"><span class="text-green-500 mr-2">✓</span> AI-generated action items</li><li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Everything in Free</li><li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Priority support</li></ul>`);
      if (!unref(isSignedIn)) {
        _push(ssrRenderComponent(unref(SignUpButton), {
          mode: "modal",
          afterSignUpUrl: "/pricing",
          afterSignInUrl: "/pricing"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button class="block w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all"${_scopeId}> Choose Pro Plan </button>`);
            } else {
              return [
                createVNode("button", { class: "block w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all" }, " Choose Pro Plan ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<button class="block w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all"> Choose Pro Plan </button>`);
      }
      _push(`</div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/marketing/PricingPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PricingPage = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main
}, Symbol.toStringTag, { value: "Module" }));
export {
  ConvexClientKey as C,
  FeaturesPage as F,
  HomePage$1 as H,
  JoinModal as J,
  PricingPage as P,
  _export_sfc as _,
  api as a,
  useNotification as b,
  useQuery as c,
  useFullPermission as d,
  useStripe as e,
  provideNotification as p,
  useMutation as u
};
