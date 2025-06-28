// Required entrypoint for Cloudflare Workers
export default {
  fetch() {
    return new Response(`Running in ${navigator.userAgent}!`);
  },
};
