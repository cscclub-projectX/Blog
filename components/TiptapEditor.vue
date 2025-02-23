<template>
    <div v-if="editor" class="container">
        <div class="control-group">
            <div class="button-group flex flex-wrap gap-2">
                <button @click="editor.chain().focus().toggleBold().run()"
                    :disabled="!editor.can().chain().focus().toggleBold().run()"
                    :class="{ 'is-active': editor.isActive('bold') }"
                    class="flex items-center">
                    <Icon name="mdi:format-bold" class="mr-1" />
                    Bold
                </button>
                <button @click="editor.chain().focus().toggleItalic().run()"
                    :disabled="!editor.can().chain().focus().toggleItalic().run()"
                    :class="{ 'is-active': editor.isActive('italic') }"
                    class="flex items-center">
                    <Icon name="mdi:format-italic" class="mr-1" />
                    Italic
                </button>
                <button @click="editor.chain().focus().toggleStrike().run()"
                    :disabled="!editor.can().chain().focus().toggleStrike().run()"
                    :class="{ 'is-active': editor.isActive('strike') }"
                    class="flex items-center">
                    <Icon name="mdi:format-strikethrough" class="mr-1" />
                    Strike
                </button>
                <button @click="editor.chain().focus().toggleCode().run()"
                    :disabled="!editor.can().chain().focus().toggleCode().run()"
                    :class="{ 'is-active': editor.isActive('code') }"
                    class="flex items-center">
                    <Icon name="mdi:code-tags" class="mr-1" />
                    Code
                </button>
                <button @click="editor.chain().focus().unsetAllMarks().run()"
                    class="flex items-center">
                    <Icon name="mdi:format-clear" class="mr-1" />
                    Clear marks
                </button>
                <button @click="editor.chain().focus().clearNodes().run()"
                    class="flex items-center">
                    <Icon name="mdi:format-remove" class="mr-1" />
                    Clear nodes
                </button>
                <button @click="editor.chain().focus().setParagraph().run()"
                    :class="{ 'is-active': editor.isActive('paragraph') }"
                    class="flex items-center">
                    <Icon name="mdi:format-paragraph" class="mr-1" />
                    Paragraph
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
                    class="flex items-center">
                    <Icon name="mdi:format-header-1" class="mr-1" />
                    H1
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
                    class="flex items-center">
                    <Icon name="mdi:format-header-2" class="mr-1" />
                    H2
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
                    class="flex items-center">
                    <Icon name="mdi:format-header-3" class="mr-1" />
                    H3
                </button>
                <button @click="editor.chain().focus().toggleBulletList().run()"
                    :class="{ 'is-active': editor.isActive('bulletList') }"
                    class="flex items-center">
                    <Icon name="mdi:format-list-bulleted" class="mr-1" />
                    Bullet list
                </button>
                <button @click="editor.chain().focus().toggleOrderedList().run()"
                    :class="{ 'is-active': editor.isActive('orderedList') }"
                    class="flex items-center">
                    <Icon name="mdi:format-list-numbered" class="mr-1" />
                    Ordered list
                </button>
                <button @click="editor.chain().focus().toggleCodeBlock().run()"
                    :class="{ 'is-active': editor.isActive('codeBlock') }"
                    class="flex items-center">
                    <Icon name="mdi:code-braces" class="mr-1" />
                    Code block
                </button>
                <button @click="editor.chain().focus().toggleBlockquote().run()"
                    :class="{ 'is-active': editor.isActive('blockquote') }"
                    class="flex items-center">
                    <Icon name="mdi:format-quote" class="mr-1" />
                    Blockquote
                </button>
                <button @click="editor.chain().focus().setHorizontalRule().run()"
                    class="flex items-center">
                    <Icon name="mdi:minus-horizontal" class="mr-1" />
                    Horizontal rule
                </button>
                <button @click="editor.chain().focus().setHardBreak().run()"
                    class="flex items-center">
                    <Icon name="mdi:break" class="mr-1" />
                    Hard break
                </button>
                <button @click="editor.chain().focus().undo().run()"
                    :disabled="!editor.can().chain().focus().undo().run()"
                    class="flex items-center">
                    <Icon name="mdi:undo" class="mr-1" />
                    Undo
                </button>
                <button @click="editor.chain().focus().redo().run()"
                    :disabled="!editor.can().chain().focus().redo().run()"
                    class="flex items-center">
                    <Icon name="mdi:redo" class="mr-1" />
                    Redo
                </button>
                <button @click="editor.chain().focus().setColor('#958DF1').run()"
                    :class="{ 'is-active': editor.isActive('textStyle', { color: '#958DF1' }) }"
                    class="flex items-center">
                    <Icon name="mdi:palette" class="mr-1" />
                    Purple
                </button>
                <button @click="editor.chain().focus().toggleImage().run()"
                    class="flex items-center">
                    <Icon name="mdi:image-plus" class="mr-1" />
                    Upload Image
                </button>
            </div>
        </div>
        <editor-content :editor="editor" />
    </div>
</template>

<script setup>
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import Image from '@tiptap/extension-image'

const editor = ref(null);

onMounted(() => {
    editor.value = new Editor({
        extensions: [
            Color.configure({ types: [TextStyle.name, ListItem.name] }),
            TextStyle.configure({ types: [ListItem.name] }),
            StarterKit,
            Image,
        ],
        content: `
          <h2>
            Hi there,
          </h2>
          <p>
            this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you'd probably expect from a text editor. But wait until you see the lists:
          </p>
          <ul>
            <li>
              That's a bullet list with one …
            </li>
            <li>
              … or two list items.
            </li>
          </ul>
          <p>
            Isn't that great? And all of that is editable. But wait, there's more. Let's try a code block:
          </p>
          <pre><code class="language-css">body {
    display: none;
  }</code></pre>
          <p>
            I know, I know, this is impressive. It's only the tip of the iceberg though. Give it a try and click a little bit around. Don't forget to check the other examples too.
          </p>
          <blockquote>
            Wow, that's amazing. Good work, boy! 👏
            <br />
            — Mom
          </blockquote>
        `,
    })

    // Function to handle image upload
    const uploadImage = async (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const imageUrl = event.target.result;
            editor.value.chain().focus().setImage({ src: imageUrl }).run();
        };
        reader.readAsDataURL(file);
    };

    // Add event listener for image upload
    editor.value.on('uploadImage', (file) => {
        uploadImage(file);
    });
})

onBeforeUnmount(() => {
    if (editor.value) {
        editor.value.destroy()
    }
})
</script>

<style lang="scss">
/* Basic editor styles */
.tiptap {
    :first-child {
        margin-top: 0;
    }

    /* List styles */
    ul,
    ol {
        padding: 0 1rem;
        margin: 1.25rem 1rem 1.25rem 0.4rem;

        li p {
            margin-top: 0.25em;
            margin-bottom: 0.25em;
        }
    }

    /* Heading styles */
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        line-height: 1.1;
        margin-top: 2.5rem;
        text-wrap: pretty;
    }

    h1,
    h2 {
        margin-top: 3.5rem;
        margin-bottom: 1.5rem;
    }

    h1 {
        font-size: 1.4rem;
    }

    h2 {
        font-size: 1.2rem;
    }

    h3 {
        font-size: 1.1rem;
    }

    h4,
    h5,
    h6 {
        font-size: 1rem;
    }

    /* Code and preformatted text styles */
    code {
        background-color: var(--purple-light);
        border-radius: 0.4rem;
        color: var(--black);
        font-size: 0.85rem;
        padding: 0.25em 0.3em;
    }

    pre {
        background: var(--black);
        border-radius: 0.5rem;
        color: var(--white);
        font-family: 'JetBrainsMono', monospace;
        margin: 1.5rem 0;
        padding: 0.75rem 1rem;

        code {
            background: none;
            color: inherit;
            font-size: 0.8rem;
            padding: 0;
        }
    }

    blockquote {
        border-left: 3px solid var(--gray-3);
        margin: 1.5rem 0;
        padding-left: 1rem;
    }

    hr {
        border: none;
        border-top: 1px solid var(--gray-2);
        margin: 2rem 0;
    }
}

.button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
</style>