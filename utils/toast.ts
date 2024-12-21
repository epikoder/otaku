import Toastify, {} from "toastify-js";

const Toast = {
    success(text: string) {
        Toastify({
            text: `<p class="flex items-center gap-4">
            <span class="text-green-500 text-base">
             &check;
            </span>
            <span>
            ${text}
            </span>
            </p>`,
            duration: 2000,
            close: true,
            gravity: "bottom",
            position: "right",
            className: "toast border-green-500 border",
            style: {},
            stopOnFocus: true,
            escapeMarkup: false,
        }).showToast();
    },

    error(text?: string) {
        Toastify({
            text: `<p class="flex items-center gap-4">
            <span class="text-yellow-500 text-base">
             &#10071;
            </span>
            <span>
            ${text ?? "Something went wrong"}
            </span>
            </p>`,
            duration: 2000,
            close: true,
            gravity: "bottom",
            position: "right",
            className: "toast border-red-700 border",
            style: {},
            stopOnFocus: true,
            escapeMarkup: false,
        }).showToast();
    },
    waring(text: string) {
        Toastify({
            text: `<p class="flex items-center gap-4">
            <span class="text-yellow-500 text-base">
             &#9888;
            </span>
            <span>
            ${text}
            </span>
            </p>`,
            duration: 2000,
            close: true,
            gravity: "bottom",
            position: "right",
            className: "toast border-yellow-700 border",
            style: {},
            stopOnFocus: true,
            escapeMarkup: false,
        }).showToast();
    },
};

export default Toast;
