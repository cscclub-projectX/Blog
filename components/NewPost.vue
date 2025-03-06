<template>
    <div class="bg-blue-100 p-4 rounded-2xl  mb-4">
        <h2 class="text-lg font-semibold mb-2">Create a New Post</h2>

        <div class="flex items-center   rounded-2xl bg-white mb-4 relative">
            <NuxtImg src="/images/image.webp" alt="User Avatar" class="w-10 h-10 rounded-full m-2" />
            <input v-model="postTitle" type="text" placeholder="Title of your post..."
                class="flex-1 p-2 bg-white border-none  focus:outline-none rounded-2xl" />
            <button @click="toggleVisibility" class="p-2 text-gray-600 hover:text-gray-800">
                <Icon name="solar:share-circle-bold-duotone"  class="text-3xl"></Icon> <!-- Default icon for visibility -->
            </button>
            <div v-if="isVisibilityOpen" class="absolute right-1 bg-gray-100  rounded-2xl p-2 flex space-x-3">
                <button @click="setVisibility('public')" class="flex items-center text-gray-600 hover:text-gray-800">
                    <Icon name="solar:earth-bold" class="text-2xl"></Icon> <!-- Earth Icon for Public -->
                </button>
                <button @click="setVisibility('friends')" class="flex items-center text-gray-600 hover:text-gray-800">
                    <Icon name="solar:users-group-two-rounded-bold-duotone" class="text-2xl"></Icon>
                    <!-- Friends Icon -->
                </button>
                <button @click="setVisibility('onlyMe')" class="flex items-center text-gray-600 hover:text-gray-800">
                    <Icon name="solar:lock-password-bold-duotone" class="text-2xl"></Icon>
                    <!-- Lock Icon for Only Me -->
                </button>
            </div>
        </div>

        <!-- Rich Text Editor -->
        <div v-if="showEditor" class="bg-white rounded-2xl p-4 mb-4">
            <div class="editor-menu flex flex-wrap gap-2 mb-2 border-b pb-2">
                <button @click="editor.chain().focus().toggleBold().run()" 
                    :class="{ 'bg-blue-100': editor.isActive('bold') }"
                    class="p-1 rounded hover:bg-gray-100">
                    <Icon name="solar:text-bold-bold" class="text-lg"></Icon>
                </button>
                <button @click="editor.chain().focus().toggleItalic().run()"
                    :class="{ 'bg-blue-100': editor.isActive('italic') }"
                    class="p-1 rounded hover:bg-gray-100">
                    <Icon name="solar:text-italic-bold" class="text-lg"></Icon>
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                    :class="{ 'bg-blue-100': editor.isActive('heading', { level: 2 }) }"
                    class="p-1 rounded hover:bg-gray-100">
                    <Icon name="solar:text-bold" class="text-lg"></Icon>
                </button>
                <button @click="editor.chain().focus().toggleBulletList().run()"
                    :class="{ 'bg-blue-100': editor.isActive('bulletList') }"
                    class="p-1 rounded hover:bg-gray-100">
                    <Icon name="solar:list-bold" class="text-lg"></Icon>
                </button>
                <button @click="editor.chain().focus().toggleOrderedList().run()"
                    :class="{ 'bg-blue-100': editor.isActive('orderedList') }"
                    class="p-1 rounded hover:bg-gray-100">
                    <Icon name="solar:list-check-bold" class="text-lg"></Icon>
                </button>
                <button @click="editor.chain().focus().toggleBlockquote().run()"
                    :class="{ 'bg-blue-100': editor.isActive('blockquote') }"
                    class="p-1 rounded hover:bg-gray-100">
                    <Icon name="solar:traffic-bold" class="text-lg"></Icon>
                </button>
                
                <!-- Image upload button -->
                <button @click="$refs.imageInput.click()" class="p-1 rounded hover:bg-gray-100">
                    <Icon name="solar:gallery-add-bold" class="text-lg"></Icon>
                </button>
                <input 
                    ref="imageInput" 
                    type="file" 
                    accept="image/*" 
                    class="hidden" 
                    @change="uploadImage"
                />
                
                <!-- Code block button -->
                <button @click="editor.chain().focus().toggleCodeBlock().run()"
                    :class="{ 'bg-blue-100': editor.isActive('codeBlock') }"
                    class="p-1 rounded hover:bg-gray-100">
                    <Icon name="solar:code-square-bold" class="text-lg"></Icon>
                </button>
                
                <!-- Horizontal rule button -->
                <button @click="editor.chain().focus().setHorizontalRule().run()"
                    class="p-1 rounded hover:bg-gray-100">
                    <Icon name="solar:minus-square-bold" class="text-lg"></Icon>
                </button>
                
                <!-- Toggle markdown view button -->
                <button @click="toggleMarkdownView" 
                    :class="{ 'bg-blue-100': showMarkdown }"
                    class="p-1 rounded hover:bg-gray-100 ml-auto">
                    <Icon name="solar:document-text-bold" class="text-lg"></Icon>
                </button>
            </div>

            <!-- Markdown view -->
            <div v-if="showMarkdown" class="mb-4">
                <textarea 
                    v-model="markdownContent" 
                    class="w-full min-h-[150px] p-2 border rounded-lg font-mono text-sm"
                    placeholder="Write your content in Markdown..."
                    @input="updateFromMarkdown"
                ></textarea>
            </div>

            <!-- Rich text editor view -->
            <editor-content v-else :editor="editor" class="min-h-[150px] focus:outline-none" />
        </div>

        <div class="flex items-center justify-between mt-2">
            <button v-if="!showEditor" @click="toggleEditor" class="text-blue-500 hover:text-blue-700 flex items-center">
                <Icon name="solar:pen-bold" class="text-xl mr-1"></Icon>
                <span>Write content</span>
            </button>
            <div class="flex-grow"></div>
            <button @click="submitPost" class="bg-blue-400 text-white px-4 py-2 rounded-2xl w-24 hover:bg-blue-600">
                Post
            </button>
        </div>
    </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Markdown } from 'tiptap-markdown'; // Changed to named import


const postTitle = ref('');
const postContent = ref('');
const isVisibilityOpen = ref(false);
const visibility = ref('public'); // Default visibility
const showEditor = ref(false);
const showMarkdown = ref(false);
const markdownContent = ref('');

// Create the editor immediately
const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Image,
    Markdown,
  ],
  onUpdate: ({ editor }) => {
    postContent.value = editor.getHTML();
    if (showMarkdown.value) {
      try {
        markdownContent.value = editor.storage.markdown.getMarkdown();
      } catch (error) {
        console.error('Error converting to markdown:', error);
      }
    }
  },
});

const toggleVisibility = () => {
  isVisibilityOpen.value = !isVisibilityOpen.value;
};

const toggleEditor = () => {
  console.log('Toggle editor clicked');
  showEditor.value = !showEditor.value;
  
  // Force a re-render if needed
  nextTick(() => {
    if (showEditor.value && editor.value) {
      editor.value.commands.focus();
    }
  });
};

const toggleMarkdownView = () => {
  showMarkdown.value = !showMarkdown.value;
  if (showMarkdown.value && editor.value) {
    markdownContent.value = editor.value.storage.markdown.getMarkdown();
  }
};

const updateFromMarkdown = () => {
  if (editor.value) {
    const html = editor.value.storage.markdown.setMarkdown(markdownContent.value);
    editor.value.commands.setContent(html, false);
    postContent.value = editor.value.getHTML();
  }
};

const uploadImage = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.includes('image/')) {
        alert('Please upload an image file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const result = e.target.result;
        editor.value.chain().focus().setImage({ src: result }).run();
    };
    reader.readAsDataURL(file);
    
    // Reset the input so the same file can be selected again
    event.target.value = '';
};

const setVisibility = (option) => {
    visibility.value = option;
    isVisibilityOpen.value = false; // Close the visibility options after selection
    console.log('Visibility set to:', visibility.value);
};

const submitPost = () => {
    if (postTitle.value.trim() && postContent.value.trim()) {
        // Logic to handle post submission (e.g., API call)
        console.log('New Post:', { 
            title: postTitle.value, 
            content: postContent.value, 
            visibility: visibility.value 
        });
        postTitle.value = ''; // Clear the title input after submission
        if (editor.value) {
            editor.value.commands.setContent(''); // Clear the editor content
        }
        postContent.value = ''; // Clear the content after submission
        markdownContent.value = ''; // Clear markdown content
        showEditor.value = false; // Hide the editor after posting
        showMarkdown.value = false; // Reset to rich text view
    } else {
        alert('Please add both a title and content to your post');
    }
};
</script>

<style scoped>
:deep(.ProseMirror) {
    outline: none;
    min-height: 150px;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
}
</style>
