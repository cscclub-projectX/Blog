import { VueRenderer } from "@tiptap/vue-3";
import tippy from "tippy.js";
import { Editor, Range } from "@tiptap/core";
import CommandsList from "@/components/TipTap/CommandsList.vue";





const items = [
    {
        name: "Text",
        description: "Just start writing with plain text.",
        icon: "mdi:text",
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setParagraph().run();
        },
    },
    {
        name: "Heading 1",
        description: "Big section heading.",
        icon: "mdi:format-header-1",
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 1 })
                .run();
        },
    },
    // Add more items here...
];
export const suggestion = {
    items: ({ query }) => {
        return items.filter((item) =>
            item.name.toLowerCase().startsWith(query.toLowerCase())
        );
    },

    render: () => {
        let component;
        let popup;

        return {
            onStart: (props) => {
                component = new VueRenderer(CommandsList, {
                    props,
                    editor: props.editor,
                });

                if (!props.clientRect) {
                    return;
                }

                popup = tippy("body", {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: "manual",
                    placement: "bottom-start",
                });
            },

            onUpdate(props) {
                component.updateProps(props);

                if (!props.clientRect) {
                    return;
                }

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                });
            },

            onKeyDown(props) {
                if (props.event.key === "Escape") {
                    popup[0].hide();
                    return true;
                }

                return component.ref?.onKeyDown(props.event);
            },

            onExit() {
                popup[0].destroy();
                component.destroy();
            },
        };
    },
};

export default suggestion;