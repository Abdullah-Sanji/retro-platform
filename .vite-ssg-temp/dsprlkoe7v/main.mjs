import { ViteSSG } from "vite-ssg";
import { createPinia } from "pinia";
import { ConvexClient } from "convex/browser";
import { _ as _export_sfc, p as provideNotification, C as ConvexClientKey } from "./assets/marketing-sqXyumEb.js";
import { defineComponent, ref, mergeProps, useSSRContext, onMounted, resolveComponent, withCtx, createTextVNode } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { useRouter, useRoute } from "vue-router";
import "convex/server";
import "@unhead/vue";
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "NotificationToast",
  __ssrInlineRender: true,
  setup(__props, { expose: __expose }) {
    const notifications = ref([]);
    const show = (message, type = "info", duration = 5e3) => {
      const id = Math.random().toString(36).substr(2, 9);
      const notification = { id, type, message, duration };
      notifications.value.push(notification);
      if (duration > 0) {
        setTimeout(() => {
          remove(id);
        }, duration);
      }
    };
    const remove = (id) => {
      notifications.value = notifications.value.filter((n) => n.id !== id);
    };
    __expose({ show, remove });
    const getIcon = (type) => {
      switch (type) {
        case "success":
          return "✓";
        case "error":
          return "✕";
        case "warning":
          return "⚠";
        case "info":
          return "ℹ";
      }
    };
    const getColorClasses = (type) => {
      switch (type) {
        case "success":
          return "bg-gradient-to-r from-emerald-500 to-green-500 text-white";
        case "error":
          return "bg-gradient-to-r from-rose-500 to-red-500 text-white";
        case "warning":
          return "bg-gradient-to-r from-amber-500 to-orange-500 text-white";
        case "info":
          return "bg-gradient-to-r from-cyan-500 to-blue-500 text-white";
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none" }, _attrs))} data-v-3f06d9d4><!--[-->`);
      ssrRenderList(notifications.value, (notification) => {
        _push(`<div class="${ssrRenderClass([
          "pointer-events-auto rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4 min-w-96 max-w-md backdrop-blur-xl border border-white/30",
          getColorClasses(notification.type)
        ])}" data-v-3f06d9d4><div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0" data-v-3f06d9d4><div class="text-2xl font-bold" data-v-3f06d9d4>${ssrInterpolate(getIcon(notification.type))}</div></div><div class="flex-1 font-medium" data-v-3f06d9d4>${ssrInterpolate(notification.message)}</div><button class="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center text-white font-bold flex-shrink-0" data-v-3f06d9d4> × </button></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/shared/NotificationToast.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const NotificationToast = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-3f06d9d4"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "App",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const notificationRef = ref();
    onMounted(() => {
      if (notificationRef.value) {
        const notificationAPI = {
          success: (msg, duration) => {
            var _a;
            return (_a = notificationRef.value) == null ? void 0 : _a.show(msg, "success", duration);
          },
          error: (msg, duration) => {
            var _a;
            return (_a = notificationRef.value) == null ? void 0 : _a.show(msg, "error", duration);
          },
          warning: (msg, duration) => {
            var _a;
            return (_a = notificationRef.value) == null ? void 0 : _a.show(msg, "warning", duration);
          },
          info: (msg, duration) => {
            var _a;
            return (_a = notificationRef.value) == null ? void 0 : _a.show(msg, "info", duration);
          }
        };
        provideNotification(notificationAPI);
      }
      const urlParams = new URLSearchParams(window.location.search);
      const sessionLink = urlParams.get("session");
      if (sessionLink && router.currentRoute.value.path === "/") {
        router.push({
          name: "board",
          params: { sessionId: sessionLink },
          query: { session: sessionLink }
        });
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_view = resolveComponent("router-view");
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_router_view, null, null, _parent));
      _push(ssrRenderComponent(NotificationToast, {
        ref_key: "notificationRef",
        ref: notificationRef
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/App.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MarketingLayout",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      const _component_router_view = resolveComponent("router-view");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col min-h-screen" }, _attrs))}><header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"><nav class="max-w-7xl mx-auto px-6 py-4"><div class="flex items-center justify-between">`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/",
        class: "text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` RetroPlatform `);
          } else {
            return [
              createTextVNode(" RetroPlatform ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="hidden md:flex items-center gap-8">`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/",
        class: "text-gray-700 hover:text-sky-600 font-medium transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Home `);
          } else {
            return [
              createTextVNode(" Home ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        to: "/features",
        class: "text-gray-700 hover:text-sky-600 font-medium transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Features `);
          } else {
            return [
              createTextVNode(" Features ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        to: "/pricing",
        class: "text-gray-700 hover:text-sky-600 font-medium transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Pricing `);
          } else {
            return [
              createTextVNode(" Pricing ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_router_link, {
        to: "/app/create",
        class: "px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Get Started `);
          } else {
            return [
              createTextVNode(" Get Started ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></nav></header><main class="flex-1">`);
      _push(ssrRenderComponent(_component_router_view, null, null, _parent));
      _push(`</main><footer class="bg-gray-900 text-white py-12"><div class="max-w-7xl mx-auto px-6"><div class="grid grid-cols-1 md:grid-cols-3 gap-8"><div><h3 class="text-xl font-bold mb-4">RetroPlatform</h3><p class="text-gray-400">Empower your team with better retrospectives.</p></div><div><h4 class="font-semibold mb-3">Product</h4><ul class="space-y-2 text-gray-400"><li>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/features",
        class: "hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Features`);
          } else {
            return [
              createTextVNode("Features")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/pricing",
        class: "hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Pricing`);
          } else {
            return [
              createTextVNode("Pricing")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div><h4 class="font-semibold mb-3">Get Started</h4>`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/app/create",
        class: "inline-block px-6 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors"
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
      _push(`</div></div><div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"><p>© 2026 RetroPlatform. All rights reserved.</p></div></div></footer></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/layouts/MarketingLayout.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_router_view = resolveComponent("router-view");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_router_view, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/layouts/AppLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AppLayout = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
const routes = [
  // Marketing Routes (will be prerendered for SEO)
  {
    path: "/",
    component: _sfc_main$1,
    children: [
      {
        path: "",
        name: "home",
        component: () => import("./assets/marketing-sqXyumEb.js").then((n) => n.H),
        meta: {
          title: "Retrospective Platform - Real-time Team Collaboration",
          description: "Empower your team with engaging, structured retrospectives that drive real change.",
          keywords: "retrospective, retro platform, agile, scrum, team collaboration"
        }
      },
      {
        path: "features",
        name: "features",
        component: () => import("./assets/marketing-sqXyumEb.js").then((n) => n.F),
        meta: {
          title: "Features - Powerful Retrospective Tools",
          description: "Real-time collaboration, anonymous feedback, smart voting, and action tracking."
        }
      },
      {
        path: "pricing",
        name: "pricing",
        component: () => import("./assets/marketing-sqXyumEb.js").then((n) => n.P),
        meta: {
          title: "Pricing - Simple, Transparent Plans",
          description: "Start free, upgrade as you grow. Plans for teams of all sizes."
        }
      }
    ]
  },
  // App Routes (SPA only, NOT prerendered)
  {
    path: "/app",
    component: AppLayout,
    children: [
      {
        path: "create",
        name: "create-session",
        component: () => import("./assets/app-BblRfkeM.js").then((n) => n.S)
      },
      {
        path: "board/:sessionId",
        name: "board",
        component: () => import("./assets/app-BblRfkeM.js").then((n) => n.R),
        props: true
      }
    ]
  },
  // Backward compatibility: ?session=xxx redirects to new URL
  {
    path: "/",
    redirect: (to) => {
      const sessionId = to.query.session;
      if (sessionId) {
        return { name: "board", params: { sessionId } };
      }
      return { name: "home" };
    }
  }
];
const createApp = ViteSSG(
  _sfc_main$2,
  { routes },
  ({ app, router, isClient }) => {
    const pinia = createPinia();
    app.use(pinia);
    if (isClient) {
      const convexUrl = "https://next-orca-400.convex.cloud";
      {
        const convexClient = new ConvexClient(convexUrl);
        app.provide(ConvexClientKey, convexClient);
      }
    }
  }
);
export {
  createApp
};
