import { onRenderClient } from "vike-react/__internal/integration/onRenderClient";
import { PageContextClient } from "vike/types";

import "../assets/spinner.css";
import "../assets/style.css";
import "../assets/toast.css";

export default function (pageContext: PageContextClient) {
    pageContext.isHydration = false;
    onRenderClient(pageContext);
}
