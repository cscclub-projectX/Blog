<template>
    <bubble-menu
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      v-if="editor"
      :should-show="shouldShow"
      class="flex bg-white rounded-md shadow-md p-1 mb-2.5"
    >
      <div class="flex items-center space-x-2">
        <button
          v-for="action in textActions"
          :key="action.name"
          @click="action.command()"
          :class="{
            'bg-gray-100/80 text-gray-900': editor.isActive(action.name),
          }"
          :title="action.label"
          class="rounded hover:bg-gray-100/80 w-8 h-8 grid place-items-center"
        >
          <Icon :name="action.icon" class="h-5 w-5" />
        </button>
      </div>
    </bubble-menu>
  </template>
  
  <script setup>
  import { Editor, BubbleMenu } from "@tiptap/vue-3";
  
  const props = defineProps({editor: Editor})
  
  const shouldShow = (props) => {
    const { state, from } = props;
    const { doc, selection } = state;
    const { empty } = selection;
  
    if (empty) return false;
  
    return true;
  };
  const contentTypes = [
  {
    name: "paragraph",
    label: "Text",
    icon: "mdi:text",
    command: () => props.editor?.chain().focus().setParagraph().run(),
  },
  {
    name: "heading",
    label: "Heading 1",
    icon: "mdi:format-header-1",
    command: () =>
      props.editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    attrs: { level: 1 },
  },
  {
    name: "heading",
    label: "Heading 2",
    icon: "mdi:format-header-2",
    command: () =>
      props.editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    attrs: { level: 2 },
  },
  {
    name: "heading",
    label: "Heading 3",
    icon: "mdi:format-header-3",
    command: () =>
      props.editor?.chain().focus().toggleHeading({ level: 3 }).run(),
    attrs: { level: 3 },
  },
  {
    name: "bulletList",
    label: "Bullet List",
    icon: "material-symbols-light:format-list-bulleted",
    command: () => props.editor?.chain().focus().toggleBulletList().run(),
  },
  {
    name: "orderedList",
    label: "Numbered List",
    icon: "material-symbols-light:format-list-numbered",
    command: () => props.editor?.chain().focus().toggleOrderedList().run(),
  },
  {
    name: "codeBlock",
    label: "Code Block",
    icon: "mdi:code-tags",
    command: () => props.editor?.chain().focus().toggleCodeBlock().run(),
  },
  {
    name: "blockquote",
    label: "Quote",
    icon: "mdi:format-quote-close",
    command: () => props.editor?.chain().focus().toggleBlockquote().run(),
  },
];

  const textActions = [
    {
      name: "bold",
      label: "Bold",
      icon: "material-symbols-light:format-bold",
      command: () => props.editor?.chain().focus().toggleBold().run(),
    },
    {
      name: "italic",
      label: "Italic",
      icon: "material-symbols-light:format-italic",
      command: () => props.editor?.chain().focus().toggleItalic().run(),
    },
    {
      name: "strike",
      label: "Strikethrough",
      icon: "material-symbols-light:format-strikethrough",
      command: () => props.editor?.chain().focus().toggleStrike().run(),
    },
    {
    name: "bulletList",
    label: "Bullet List",
    icon: "material-symbols-light:format-list-bulleted",
    command: () => props.editor?.chain().focus().toggleBulletList().run(),
  },
  {
    name: "orderedList",
    label: "Numbered List",
    icon: "material-symbols-light:format-list-numbered",
    command: () => props.editor?.chain().focus().toggleOrderedList().run(),
  },
  ];
  const currentContentType = computed(() => {
  if (props.editor?.isActive("heading", { level: 1 })) return "Heading 1";
  if (props.editor?.isActive("heading", { level: 2 })) return "Heading 2";
  if (props.editor?.isActive("heading", { level: 3 })) return "Heading 3";
  if (props.editor?.isActive("bulletList")) return "Bullet List";
  if (props.editor?.isActive("orderedList")) return "Numbered List";
  if (props.editor?.isActive("codeBlock")) return "Code Block";
  if (props.editor?.isActive("blockquote")) return "Quote";
  return "Text";
});
const colors = [
  { name: "Default", value: "inherit" },
  { name: "Gray", value: "#6B7280" },
  { name: "Brown", value: "#92400E" },
  { name: "Orange", value: "#EA580C" },
  { name: "Yellow", value: "#CA8A04" },
  { name: "Green", value: "#16A34A" },
  { name: "Blue", value: "#2563EB" },
  { name: "Purple", value: "#9333EA" },
  { name: "Pink", value: "#DB2777" },
  { name: "Red", value: "#DC2626" },
];

// ...

const setTextColor = (color) => {
  props.editor?.chain().focus().setColor(color).run();
  showColorMenu.value = false;
};
  </script>
  