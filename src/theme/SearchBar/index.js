import React, { useCallback, useRef } from "react";
import { DocSearchButton } from "@docsearch/react";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import "./styles.scss";

let DocSearchModal = null;
function DocSearch() {
  // We let user override default searchParameters if she wants to
  const searchButtonRef = useRef(null);
  const importDocSearchModalIfNeeded = useCallback(() => {
    if (DocSearchModal) {
      return Promise.resolve();
    }
    return Promise.all([
      import("@docsearch/react/modal"),
      import("@docsearch/react/style"),
    ]).then(([{ DocSearchModal: Modal }]) => {
      DocSearchModal = Modal;
    });
  }, []);

  return (
    <>
      <Head>
        <script
          type="text/javascript"
          defer
          src="https://widget.orbit.love/widget.js"
        />
        <script type="text/javascript">
          {`  window.Widget = Object.assign({}, window.Widget, {
                baseUrl: "https://search.orbit.love/widget/0f886bc2-4085-476d-94d2-de69a7c2a438",
                options: {
                    docResultsLinkTarget: "_top",
                    showCornerIcon: false
                },
            });
            if (window.Widget.init) {
                window.Widget.init();
            }`}
        </script>
      </Head>

      <DocSearchButton
        onTouchStart={importDocSearchModalIfNeeded}
        onFocus={importDocSearchModalIfNeeded}
        onMouseOver={importDocSearchModalIfNeeded}
        onClick={() => {
          window.Widget.toggleWidget();
        }}
        ref={searchButtonRef}
      />
    </>
  );
}
export default function SearchBar() {
  useDocusaurusContext();
  return <DocSearch />;
}