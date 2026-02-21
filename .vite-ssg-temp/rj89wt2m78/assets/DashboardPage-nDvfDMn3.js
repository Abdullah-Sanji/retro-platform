import { defineComponent, ref, computed, onMounted, resolveComponent, withCtx, createVNode, createTextVNode, unref, watch, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useRouter, useRoute } from "vue-router";
import { useUser } from "@clerk/vue";
import { b as useNotification, f as usePayPal, g as useAction, a as api, u as useMutation, c as useQuery } from "./marketing-1kkeCTA4.js";
import { _ as _sfc_main$1 } from "./retro-DUribbta.js";
import "convex/server";
import "@unhead/vue";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DashboardPage",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const route = useRoute();
    const { user, isSignedIn } = useUser();
    const notification = useNotification();
    usePayPal();
    const showCancelConfirm = ref(false);
    const isCancelling = ref(false);
    const activateSubscription = useAction(api.paypal.activateSubscription);
    useMutation(api.users.syncClerkUser);
    computed(() => {
      return null;
    });
    const userData = useQuery(
      api.users.getCurrentUser,
      computed(() => {
        var _a;
        return ((_a = user.value) == null ? void 0 : _a.id) ? { clerkId: user.value.id } : "skip";
      })
    );
    const usageStats = useQuery(
      api.sessions.getUserUsage,
      computed(() => userData.value ? { userId: userData.value._id } : "skip")
    );
    const userSessions = useQuery(
      api.sessions.getUserSessions,
      computed(() => userData.value ? { userId: userData.value._id } : "skip")
    );
    function waitForUser() {
      return new Promise((resolve) => {
        if (userData.value) {
          resolve(userData.value);
          return;
        }
        const stop = watch(() => userData.value, (val) => {
          if (val) {
            stop();
            resolve(val);
          }
        });
      });
    }
    onMounted(async () => {
      if (isSignedIn.value === false) {
        notification.warning("Please sign in to view dashboard");
        router.push("/");
        return;
      }
      const subscriptionId = route.query.subscription_id;
      if (!subscriptionId) return;
      try {
        const user2 = await waitForUser();
        await activateSubscription({ subscriptionId, userId: user2._id });
        notification.success("Welcome to Pro! Your subscription is now active.");
        router.replace("/dashboard");
      } catch (error) {
        console.error("Failed to activate subscription:", error);
        notification.error((error == null ? void 0 : error.message) || "Could not activate subscription. Please contact support.");
      }
    });
    const subscriptionStatus = computed(() => {
      var _a;
      return ((_a = userData.value) == null ? void 0 : _a.subscriptionStatus) || "free";
    });
    const isFreeTier = computed(() => subscriptionStatus.value === "free");
    const usagePercentage = computed(() => {
      if (!usageStats.value || usageStats.value.limit === Infinity) return 0;
      return usageStats.value.used / usageStats.value.limit * 100;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_router_link = resolveComponent("router-link");
      _push(`<!--[--><div class="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50"><header class="bg-white border-b border-gray-200 sticky top-0 z-10"><div class="max-w-7xl mx-auto px-6 py-4"><div class="flex items-center justify-between">`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/",
        class: "flex items-center gap-3 group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$1, {
              size: "md",
              class: "group-hover:scale-110 transition-transform"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent"${_scopeId}> RetroPlatform </span>`);
          } else {
            return [
              createVNode(_sfc_main$1, {
                size: "md",
                class: "group-hover:scale-110 transition-transform"
              }),
              createVNode("span", { class: "text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent" }, " RetroPlatform ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        to: "/app/create",
        class: "px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Create Session `);
          } else {
            return [
              createTextVNode(" Create Session ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></header><div class="max-w-7xl mx-auto px-6 py-12"><div class="mb-8"><h1 class="text-4xl font-bold text-gray-800 mb-2"> Welcome back, ${ssrInterpolate(((_a = unref(user)) == null ? void 0 : _a.firstName) || "there")}! </h1><p class="text-gray-600">Manage your retrospectives and subscription</p></div><div class="grid lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-8"><div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"><h2 class="text-2xl font-bold text-gray-800 mb-6">Usage This Month</h2>`);
      if (unref(usageStats)) {
        _push(`<div class="space-y-4"><div class="flex items-center justify-between mb-2"><span class="text-gray-600">Sessions Used</span><span class="text-2xl font-bold text-sky-600">${ssrInterpolate(unref(usageStats).used)} / ${ssrInterpolate(unref(usageStats).limit === Infinity ? "∞" : unref(usageStats).limit)}</span></div>`);
        if (unref(usageStats).limit !== Infinity) {
          _push(`<div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden"><div class="${ssrRenderClass([usagePercentage.value >= 80 ? "bg-red-500" : usagePercentage.value >= 60 ? "bg-yellow-500" : "bg-green-500", "h-full transition-all duration-500"])}" style="${ssrRenderStyle({ width: `${Math.min(usagePercentage.value, 100)}%` })}"></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (isFreeTier.value && unref(usageStats).used >= 4) {
          _push(`<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4"><p class="text-yellow-800 font-medium flex items-center"><svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg> You&#39;re approaching your monthly limit. Upgrade for unlimited sessions! </p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-6 p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">Current Plan</p><p class="text-xl font-bold text-sky-600 capitalize">${ssrInterpolate(subscriptionStatus.value)}</p></div>`);
        if (isFreeTier.value) {
          _push(`<button class="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all"> Upgrade Now </button>`);
        } else {
          _push(`<button class="px-6 py-3 bg-gray-100 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all"> Cancel Plan </button>`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"><h2 class="text-2xl font-bold text-gray-800 mb-6">Recent Sessions</h2>`);
      if (unref(userSessions) && unref(userSessions).length > 0) {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(unref(userSessions).slice(0, 10), (session) => {
          _push(`<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"><div class="flex-1"><h3 class="font-semibold text-gray-800">${ssrInterpolate(session.title)}</h3><p class="text-sm text-gray-600">${ssrInterpolate(session.teamName)}</p><p class="text-xs text-gray-500 mt-1">${ssrInterpolate(new Date(session.createdAt).toLocaleDateString())}</p></div>`);
          _push(ssrRenderComponent(_component_router_link, {
            to: `/app/board/${session._id}`,
            class: "px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm font-medium"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` View `);
              } else {
                return [
                  createTextVNode(" View ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-12"><p class="text-gray-500 mb-4">No sessions yet</p>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: "/app/create",
          class: "inline-block px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Create Your First Session `);
            } else {
              return [
                createTextVNode(" Create Your First Session ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div></div><div class="space-y-8"><div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"><h3 class="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3><div class="space-y-3">`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/app/create",
        class: "block w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all text-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Create Session `);
          } else {
            return [
              createTextVNode(" Create Session ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        to: "/pricing",
        class: "block w-full px-4 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-all text-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View Plans `);
          } else {
            return [
              createTextVNode(" View Plans ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (isFreeTier.value) {
        _push(`<div class="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white"><h3 class="text-xl font-bold mb-2">Upgrade to Pro</h3><p class="text-sky-100 mb-4 text-sm"> Get unlimited sessions, export to Word, and priority support for just $15/month. </p><button class="w-full px-4 py-3 bg-white text-sky-600 font-semibold rounded-xl hover:bg-gray-50 transition-all"> Upgrade Now </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div>`);
      if (showCancelConfirm.value) {
        _push(`<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"><h3 class="text-xl font-bold text-gray-800 mb-2">Cancel Subscription?</h3><p class="text-gray-600 mb-6"> You&#39;ll be downgraded to the Free plan immediately. You&#39;ll lose access to unlimited sessions, all templates, and other Pro features. </p><div class="flex gap-3"><button class="flex-1 px-4 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-all"> Keep Pro </button><button${ssrIncludeBooleanAttr(isCancelling.value) ? " disabled" : ""} class="flex-1 px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">${ssrInterpolate(isCancelling.value ? "Cancelling..." : "Yes, Cancel")}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/app/DashboardPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
