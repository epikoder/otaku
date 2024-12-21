import { onRenderClient } from "vike-react/__internal/integration/onRenderClient";
import { PageContextClient } from "vike/types";

import "../assets/style.css";

export default function (pageContext: PageContextClient) {
    pageContext.isHydration = false;
    onRenderClient(pageContext);
}
