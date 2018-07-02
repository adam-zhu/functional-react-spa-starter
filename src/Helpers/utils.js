// @flow
export const reset_window_scroll = () => {
  window.scrollTo(0, 0);

  if (document.body) {
    document.body.scrollTop = 0;
  }

  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
  }

  const el_html = document.querySelector("html");
  if (el_html) {
    el_html.scrollTop = 0;
  }
};
