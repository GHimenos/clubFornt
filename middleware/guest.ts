/*
export default defineNuxtRouteMiddleware((to, _from) => {
  const user = useStrapiUser();
  if (user.value) {
    useCookie("redirect", { path: "/login" }).value = to.fullPath;
    return navigateTo("/");
  }
});
*/

export default defineNuxtRouteMiddleware((to, from) => {
  const user = useStrapiUser();
  if (user.value) {
    return navigateTo("/");
  }
});
