import { ref, watch, onUnmounted, computed, inject, provide, defineComponent, mergeProps, useSSRContext, unref, resolveComponent, withCtx, createTextVNode } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderStyle, ssrRenderComponent, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { useRouter } from "vue-router";
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
      title: "Retrospective Platform - Real-time Team Collaboration",
      description: "Empower your team with engaging, structured retrospectives that drive real change. Real-time collaboration, anonymous feedback, and smart voting.",
      keywords: "retrospective, retro platform, agile, scrum, team collaboration, sprint retrospective"
    });
    const router = useRouter();
    const notification = useNotification();
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
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50 flex items-center justify-center p-6 relative overflow-hidden"><div class="absolute inset-0 overflow-hidden pointer-events-none"><div class="absolute top-20 left-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div><div class="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style="${ssrRenderStyle({ "animation-delay": "2s" })}"></div><div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float" style="${ssrRenderStyle({ "animation-delay": "4s" })}"></div></div><div class="text-center max-w-5xl relative z-10 animate-fade-in"><div class="mb-12"><div class="inline-block mb-6"><span class="px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-sky-700 text-sm font-semibold border border-sky-200 shadow-sm"> 🚀 Real-time Collaboration Platform </span></div><h1 class="text-7xl font-extrabold text-gray-800 mb-6 leading-tight tracking-tight"> Retrospectives <span class="block bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent"> Reimagined </span></h1><p class="text-2xl text-gray-600 mb-8 max-w-2xl mx-auto font-light"> Empower your team with engaging, structured retrospectives that drive real change </p></div><div class="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16 animate-slide-up"><div class="group relative"><div class="absolute inset-0 bg-gradient-to-r from-sky-300 to-blue-300 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div><div class="relative flex flex-col justify-between h-full bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-sky-100"><div><div class="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg"><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></div><h2 class="text-2xl font-bold text-gray-800 mb-3">Create Session</h2><p class="text-gray-600 mb-6 leading-relaxed">Start a new retrospective and invite your team to collaborate in real-time</p></div><button class="w-full px-6 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"> Create New Retro </button></div></div><div class="group relative"><div class="absolute inset-0 bg-gradient-to-r from-emerald-300 to-green-300 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div><div class="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-emerald-100"><div class="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg"><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg></div><h2 class="text-2xl font-bold text-gray-800 mb-3">Join Session</h2><p class="text-gray-600 mb-6 leading-relaxed">Enter the session link to participate and contribute your insights</p><input${ssrRenderAttr("value", joinLink.value)} type="text" placeholder="retro-abc123" class="w-full px-5 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all outline-none bg-white"><button class="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"> Join Retro </button></div></div></div><div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"><div class="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 group shadow-md border border-gray-100"><div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div><h3 class="font-bold text-gray-800 mb-2">Real-time Sync</h3><p class="text-sm text-gray-600">Instant updates for all participants</p></div><div class="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 group shadow-md border border-gray-100"><div class="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div><h3 class="font-bold text-gray-800 mb-2">Anonymous Mode</h3><p class="text-sm text-gray-600">Safe space for honest feedback</p></div><div class="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 group shadow-md border border-gray-100"><div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><h3 class="font-bold text-gray-800 mb-2">Smart Voting</h3><p class="text-sm text-gray-600">Prioritize what matters most</p></div><div class="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 group shadow-md border border-gray-100"><div class="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg></div><h3 class="font-bold text-gray-800 mb-2">Action Items</h3><p class="text-sm text-gray-600">Convert ideas to outcomes</p></div></div></div></div>`);
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
const HomePage = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$2
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PricingPage",
  __ssrInlineRender: true,
  setup(__props) {
    useSeo({
      title: "Pricing - Simple, Transparent Plans",
      description: "Simple, transparent pricing for teams of all sizes. Start free, upgrade as you grow.",
      keywords: "retrospective pricing, retro tool cost, agile tool pricing"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 py-20" }, _attrs))}><div class="max-w-7xl mx-auto px-6"><h1 class="text-6xl font-bold text-center mb-4"><span class="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent"> Simple Pricing </span></h1><p class="text-xl text-gray-600 text-center mb-16"> Start free, upgrade as you grow </p><div class="text-center"><div class="inline-block bg-white rounded-2xl p-12 shadow-xl"><h2 class="text-3xl font-bold mb-4">Currently Free</h2><p class="text-gray-600 mb-8">All features available during beta</p>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/app/create",
        class: "px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all inline-block"
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
      _push(`</div></div><div class="mt-20 max-w-4xl mx-auto"><div class="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-sky-100"><h3 class="text-2xl font-bold text-gray-800 mb-4 text-center">Future Pricing Plans</h3><p class="text-gray-600 text-center mb-8"> We&#39;re planning to introduce paid plans soon. Early adopters will get special pricing. </p><div class="grid md:grid-cols-3 gap-6"><div class="text-center p-6 bg-white rounded-xl border border-gray-200"><h4 class="text-xl font-bold text-gray-800 mb-2">Free</h4><p class="text-3xl font-bold text-sky-600 mb-2">$0</p><p class="text-sm text-gray-500 mb-4">5 sessions/month</p><ul class="text-sm text-gray-600 space-y-2"><li>✓ Up to 10 participants</li><li>✓ Real-time collaboration</li><li>✓ Anonymous mode</li><li>✓ Smart voting</li></ul></div><div class="text-center p-6 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl border-2 border-sky-300 relative"><div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-sky-600 text-white px-4 py-1 rounded-full text-xs font-bold"> POPULAR </div><h4 class="text-xl font-bold text-gray-800 mb-2">Pro</h4><p class="text-3xl font-bold text-sky-600 mb-2">$15</p><p class="text-sm text-gray-500 mb-4">per month</p><ul class="text-sm text-gray-600 space-y-2"><li>✓ Unlimited sessions</li><li>✓ Up to 25 participants</li><li>✓ Export to Word</li><li>✓ Custom templates</li><li>✓ Priority support</li></ul></div><div class="text-center p-6 bg-white rounded-xl border border-gray-200"><h4 class="text-xl font-bold text-gray-800 mb-2">Team</h4><p class="text-3xl font-bold text-sky-600 mb-2">$49</p><p class="text-sm text-gray-500 mb-4">per month</p><ul class="text-sm text-gray-600 space-y-2"><li>✓ Unlimited sessions</li><li>✓ Up to 50 participants</li><li>✓ Organizations</li><li>✓ Advanced analytics</li><li>✓ SSO (coming soon)</li></ul></div></div></div></div></div></div>`);
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
  HomePage as H,
  JoinModal as J,
  PricingPage as P,
  _export_sfc as _,
  api as a,
  useNotification as b,
  useQuery as c,
  provideNotification as p,
  useMutation as u
};
