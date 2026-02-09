import { ViteSSG } from "vite-ssg";
import { createPinia } from "pinia";
import { ConvexClient } from "convex/browser";
import { _ as _export_sfc, p as provideNotification, d as useFullPermission, C as ConvexClientKey } from "./assets/marketing-DKkPQd66.js";
import { SignInButton, SignOutButton, clerkPlugin } from "@clerk/vue";
import { defineComponent, ref, mergeProps, useSSRContext, onMounted, resolveComponent, computed, withCtx, createVNode, createTextVNode, unref, openBlock, createBlock } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { useRouter, useRoute } from "vue-router";
import { _ as _sfc_main$4 } from "./assets/retro-DsDD_Z-a.js";
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
    useRouter();
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
    useRouter();
    let user, isSignedIn;
    {
      user = ref(null);
      isSignedIn = ref(false);
    }
    const { isFullPermissionMode } = useFullPermission();
    const showUserMenu = ref(false);
    const getStartedUrl = computed(() => {
      {
        return "/app/create";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g;
      const _component_router_link = resolveComponent("router-link");
      const _component_router_view = resolveComponent("router-view");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col min-h-screen" }, _attrs))}><header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"><nav class="max-w-7xl mx-auto px-6 py-4"><div class="flex items-center justify-between">`);
      _push(ssrRenderComponent(_component_router_link, {
        to: "/",
        class: "flex items-center gap-3 group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$4, {
              size: "md",
              class: "group-hover:scale-110 transition-transform"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent"${_scopeId}> RetroPlatform </span>`);
          } else {
            return [
              createVNode(_sfc_main$4, {
                size: "md",
                class: "group-hover:scale-110 transition-transform"
              }),
              createVNode("span", { class: "text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent" }, " RetroPlatform ")
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
      if (!unref(isFullPermissionMode)) {
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
      } else {
        _push(`<!---->`);
      }
      if (!unref(isSignedIn)) {
        _push(`<div class="flex items-center gap-4">`);
        _push(ssrRenderComponent(unref(SignInButton), {
          mode: "modal",
          afterSignInUrl: "/app/create"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button class="px-6 py-2 border-2 border-sky-500 text-sky-600 font-semibold rounded-xl hover:bg-sky-50 transition-all"${_scopeId}> Sign In </button>`);
            } else {
              return [
                createVNode("button", { class: "px-6 py-2 border-2 border-sky-500 text-sky-600 font-semibold rounded-xl hover:bg-sky-50 transition-all" }, " Sign In ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_router_link, {
          to: getStartedUrl.value,
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
        _push(`</div>`);
      } else {
        _push(ssrRenderComponent(_component_router_link, {
          to: "/app/create",
          class: "px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all"
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
      }
      if (unref(isSignedIn)) {
        _push(`<div class="relative"><button class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-200 hover:border-teal-300 transition-all group"><div class="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">${ssrInterpolate(((_b = (_a = unref(user)) == null ? void 0 : _a.firstName) == null ? void 0 : _b.charAt(0).toUpperCase()) || "U")}</div><div class="flex flex-col items-start"><span class="text-xs text-teal-600 font-medium">Ready to retro?</span><span class="text-sm font-bold text-teal-900">${ssrInterpolate(((_c = unref(user)) == null ? void 0 : _c.firstName) || "User")}</span></div><svg class="${ssrRenderClass([{ "rotate-180": showUserMenu.value }, "w-4 h-4 text-teal-600 transition-transform"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>`);
        if (showUserMenu.value) {
          _push(`<div class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50"><div class="px-4 py-3 border-b border-gray-100"><p class="text-sm font-semibold text-gray-900">${ssrInterpolate(((_d = unref(user)) == null ? void 0 : _d.fullName) || ((_e = unref(user)) == null ? void 0 : _e.firstName) || "User")}</p><p class="text-xs text-gray-500 truncate">${ssrInterpolate((_g = (_f = unref(user)) == null ? void 0 : _f.primaryEmailAddress) == null ? void 0 : _g.emailAddress)}</p></div>`);
          _push(ssrRenderComponent(_component_router_link, {
            to: "/dashboard",
            class: "flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"${_scopeId}></path></svg><span class="text-sm font-medium text-gray-700"${_scopeId}>Dashboard</span>`);
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    class: "w-5 h-5 text-gray-600",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    })
                  ])),
                  createVNode("span", { class: "text-sm font-medium text-gray-700" }, "Dashboard")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (!unref(isFullPermissionMode)) {
            _push(ssrRenderComponent(_component_router_link, {
              to: "/pricing",
              class: "flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"${_scopeId}></path></svg><span class="text-sm font-medium text-gray-700"${_scopeId}>Pricing</span>`);
                } else {
                  return [
                    (openBlock(), createBlock("svg", {
                      class: "w-5 h-5 text-gray-600",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      })
                    ])),
                    createVNode("span", { class: "text-sm font-medium text-gray-700" }, "Pricing")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<hr class="my-2">`);
          _push(ssrRenderComponent(unref(SignOutButton), { redirectUrl: "/" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button class="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left"${_scopeId}><svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"${_scopeId}></path></svg><span class="text-sm font-medium text-red-600"${_scopeId}>Sign Out</span></button>`);
              } else {
                return [
                  createVNode("button", { class: "flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-5 h-5 text-red-600",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      })
                    ])),
                    createVNode("span", { class: "text-sm font-medium text-red-600" }, "Sign Out")
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></nav></header>`);
      if (showUserMenu.value) {
        _push(`<div class="fixed inset-0 z-40"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<main class="flex-1">`);
      _push(ssrRenderComponent(_component_router_view, null, null, _parent));
      _push(`</main><footer class="bg-gray-900 text-white py-12"><div class="max-w-7xl mx-auto px-6"><div class="grid grid-cols-1 md:grid-cols-3 gap-8"><div><div class="flex items-center gap-3 mb-4">`);
      _push(ssrRenderComponent(_sfc_main$4, { size: "md" }, null, _parent));
      _push(`<h3 class="text-xl font-bold">RetroPlatform</h3></div><p class="text-gray-400">AI-powered retrospectives for modern teams.</p></div><div><h4 class="font-semibold mb-3">Product</h4><ul class="space-y-2 text-gray-400"><li>`);
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
      _push(`</li>`);
      if (!unref(isFullPermissionMode)) {
        _push(`<li>`);
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
        _push(`</li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul></div><div><h4 class="font-semibold mb-3">Get Started</h4>`);
      if (!unref(isSignedIn)) {
        _push(`<div class="space-y-3">`);
        if (!unref(isFullPermissionMode)) {
          _push(ssrRenderComponent(_component_router_link, {
            to: "/pricing",
            class: "block px-6 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors text-center"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` View Pricing `);
              } else {
                return [
                  createTextVNode(" View Pricing ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(unref(SignInButton), {
          mode: "modal",
          afterSignInUrl: "/app/create"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button class="block w-full px-6 py-2 border-2 border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 rounded-lg transition-all text-sm font-medium"${_scopeId}> Already have an account? Sign In </button>`);
            } else {
              return [
                createVNode("button", { class: "block w-full px-6 py-2 border-2 border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 rounded-lg transition-all text-sm font-medium" }, " Already have an account? Sign In ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
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
      }
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
        component: () => import("./assets/marketing-DKkPQd66.js").then((n) => n.H),
        meta: {
          title: "Retrospective Platform - Real-time Team Collaboration",
          description: "Empower your team with engaging, structured retrospectives that drive real change.",
          keywords: "retrospective, retro platform, agile, scrum, team collaboration"
        },
        // Redirect if ?session query param is present
        beforeEnter: (to, from, next) => {
          if (to.query.session) {
            next({ path: "/app/join", query: { session: to.query.session } });
          } else {
            next();
          }
        }
      },
      {
        path: "features",
        name: "features",
        component: () => import("./assets/marketing-DKkPQd66.js").then((n) => n.F),
        meta: {
          title: "Features - Powerful Retrospective Tools",
          description: "Real-time collaboration, anonymous feedback, smart voting, and action tracking."
        }
      },
      {
        path: "pricing",
        name: "pricing",
        component: () => import("./assets/marketing-DKkPQd66.js").then((n) => n.P),
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
        component: () => import("./assets/app-Cn7Th26i.js").then((n) => n.S)
      },
      {
        path: "board/:sessionId",
        name: "board",
        component: () => import("./assets/app-Cn7Th26i.js").then((n) => n.R),
        props: true
      },
      // Join route - handles ?session=xxx
      {
        path: "join",
        name: "join",
        component: () => import("./assets/app-Cn7Th26i.js").then((n) => n.R)
      }
    ]
  },
  // Dashboard (requires auth)
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("./assets/DashboardPage-BugThA2x.js")
  }
];
const createApp = ViteSSG(
  _sfc_main$2,
  { routes },
  ({ app, router, isClient }) => {
    const pinia = createPinia();
    app.use(pinia);
    if (isClient) {
      const clerkPubKey = "pk_test_ZGVmaW5pdGUtZ3JpenpseS01MC5jbGVyay5hY2NvdW50cy5kZXYk";
      {
        app.use(clerkPlugin, {
          publishableKey: clerkPubKey
        });
      }
    }
    if (isClient) {
      const convexUrl = "https://next-orca-400.convex.cloud";
      {
        const convexClient = new ConvexClient(convexUrl);
        app.provide(ConvexClientKey, convexClient);
      }
    } else {
      const mockClient = {};
      app.provide(ConvexClientKey, mockClient);
    }
  }
);
export {
  createApp
};
