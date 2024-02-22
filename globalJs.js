import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

if (ExecutionEnvironment.canUseDOM) {
  window.addEventListener("load", () => {
    window.CommunitySearch = window.CommunitySearch || {};
    window.CommunitySearch = Object.assign({}, window.CommunitySearch, {
      baseUrl:
        "https://search.orbit.love/widget/0f886bc2-4085-476d-94d2-de69a7c2a438",
      options: {
        docResultsLinkTarget: "_top",
        showCornerIcon: false,
        showSearchBox: true,
        searchBoxContainer: ".community-search > div",
        colorScheme: "light",
      },
    });
    if (window.CommunitySearch.init) {
      window.CommunitySearch.init();
    }
    const scriptElement = document.createElement("script");
    scriptElement.src = "https://search.orbit.love/widget.js";
    scriptElement.defer = "true";
    scriptElement.type = "text/javascript";

    document.body.appendChild(scriptElement);
  });
}