<template>
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 relative">
        <!-- Overlay for disabled state -->
        <div v-if="disabled"
            class="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex flex-col items-center justify-center z-10">
            <Icon name="solar:lock-bold" class="text-4xl text-gray-700 mb-2" />
            <p class="text-gray-800 font-medium mb-3">Create a profile to start posting</p>
            <button @click="$emit('request-profile')"
                class="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition">
                Create Profile
            </button>
        </div>

        <!-- User Info and Post Type Selector -->
        <div class="flex items-center space-x-3 mb-4">
            <NuxtImg :src="Profile?.profileImage" alt="User Avatar" class="w-10 h-10 rounded-full" />
            <div class="flex-1">
                <p class="font-medium text-gray-800">{{ Profile?.name || 'Your Name' }}</p>
                <div class="flex items-center text-sm text-gray-500">
                    <select v-model="postType" class="bg-transparent border-none p-0 pr-4 focus:ring-0 text-gray-500 cursor-pointer">
                        <option value="post">Short Post</option>
                        <option value="article">Full Article</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Title Input - Medium-style large input -->
        <input v-model="postTitle" type="text" placeholder="Title"
            class="w-full text-xl md:text-2xl font-bold mb-4 border-none p-0 focus:outline-none focus:ring-0" />

        <!-- Cover Image Preview -->
        <div v-if="coverImagePreview" class="mb-6 relative group">
            <img :src="coverImagePreview" alt="Cover image preview"
                class="w-full h-48 md:h-64 object-cover rounded-lg" />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button @click="removeCoverImage" class="bg-white text-red-500 p-2 rounded-full">
                    <Icon name="solar:trash-bin-trash-bold" class="text-xl" />
                </button>
            </div>
        </div>

        <!-- Editor Toggle Button -->
        <div v-if="!showEditor" class="flex items-center space-x-2 mb-4 cursor-pointer" @click="toggleEditor">
            <div class="w-full border-b border-gray-200 py-3 text-gray-500 hover:text-gray-700 transition-colors">
                <p class="text-sm">Tell your story...</p>
            </div>
        </div>
    
        <!-- Rich Text Editor -->
        <div v-if="showEditor" class="mb-6">
            <div class="editor-menu flex flex-wrap gap-2 mb-3 border-b pb-2">
                <button @click="editor.chain().focus().toggleBold().run()"
                    :class="{ 'bg-gray-100': editor.isActive('bold') }" 
                    class="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <Icon name="solar:text-bold-bold" class="text-lg"></Icon>
                </button>
                <button @click="editor.chain().focus().toggleItalic().run()"
                    :class="{ 'bg-gray-100': editor.isActive('italic') }" 
                    class="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <Icon name="solar:text-italic-bold" class="text-lg"></Icon>
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                    :class="{ 'bg-gray-100': editor.isActive('heading', { level: 2 }) }"
                    class="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <Icon name="solar:text-bold" class="text-lg"></Icon>
                </button>
                <button @click="editor.chain().focus().toggleBulletList().run()"
                    :class="{ 'bg-gray-100': editor.isActive('bulletList') }" 
                    class="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <Icon name="solar:list-bold" class="text-lg"></Icon>
                </button>
                <button @click="editor.chain().focus().toggleOrderedList().run()"
                    :class="{ 'bg-gray-100': editor.isActive('orderedList') }" 
                    class="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <Icon name="solar:list-check-bold" class="text-lg"></Icon>
                </button>
                <button @click="editor.chain().focus().toggleBlockquote().run()"
                    :class="{ 'bg-gray-100': editor.isActive('blockquote') }" 
                    class="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <Icon name="solar:traffic-bold" class="text-lg"></Icon>
                </button>

                <!-- Image upload button -->
                <button @click="$refs.imageInput.click()" 
                    class="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <Icon name="solar:gallery-add-bold" class="text-lg"></Icon>
                </button>
                <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="uploadImage" />

                <!-- Code block button -->
                <button @click="editor.chain().focus().toggleCodeBlock().run()"
                    :class="{ 'bg-gray-100': editor.isActive('codeBlock') }" 
                    class="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <Icon name="solar:code-square-bold" class="text-lg"></Icon>
                </button>

                <!-- Horizontal rule button -->
                <button @click="editor.chain().focus().setHorizontalRule().run()" 
                    class="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <Icon name="solar:minus-square-bold" class="text-lg"></Icon>
                </button>

                <!-- Toggle markdown view button -->
                <button @click="toggleMarkdownView" :class="{ 'bg-gray-100': showMarkdown }"
                    class="p-1.5 rounded-full hover:bg-gray-100 transition-colors ml-auto">
                    <Icon name="solar:document-text-bold" class="text-lg"></Icon>
                </button>
            </div>

            <!-- Markdown view -->
            <div v-if="showMarkdown" class="mb-4">
                <textarea v-model="markdownContent" 
                    class="w-full min-h-[200px] p-3 border rounded-lg font-mono text-sm focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                    placeholder="Write your content in Markdown..." 
                    @input="updateFromMarkdown"></textarea>
            </div>

            <!-- Rich text editor view -->
            <editor-content v-else :editor="editor" class="min-h-[200px] focus:outline-none prose max-w-none" />
        </div>

        <!-- Tags Input Section -->
        <div v-if="showEditor" class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Add tags (up to 5)</h3>
            <div class="relative">
                <div class="flex flex-wrap gap-2 items-center p-2 border border-gray-200 rounded-lg min-h-[42px]">
                    <!-- Tags inside input area -->
                    <div v-for="(tag, index) in tags" :key="index" 
                        class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center text-sm">
                        <span>{{ tag }}</span>
                        <button @click="removeTag(index)" class="ml-1 text-gray-500 hover:text-gray-700">
                            <Icon name="solar:close-circle-bold" class="text-xs" />
                        </button>
                    </div>
                    
                    <!-- Input field inline with tags -->
                    <input 
                        v-model="tagInput" 
                        @keydown.enter.prevent="addTag"
                        type="text" 
                        placeholder="Add a tag and press Enter"
                        class="flex-1 min-w-[120px] border-none p-0 focus:outline-none focus:ring-0"
                    />
                </div>
            </div>
            <p class="text-xs text-gray-500 mt-1">Add relevant tags to help others discover your post</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between mt-4">
            <!-- Cover Image Upload Button -->
            <input ref="coverImageInput" type="file" accept="image/*" class="hidden" @change="uploadCoverImage" />
            <button v-if="showEditor" @click="$refs.coverImageInput.click()" 
                class="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1">
                <Icon name="solar:gallery-add-bold" class="text-lg"></Icon>
                <span class="text-sm">Add cover image</span>
            </button>
            <div class="flex-grow"></div>
            
            <!-- Publish Button -->
            <button @click="submitPost" 
                class="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors">
                Publish
            </button>
        </div>
    </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Markdown } from 'tiptap-markdown';
import { client, ID } from '~/utils/appwrite';
import { Databases, Storage } from 'appwrite';
import { DATABASE_ID, POSTS_COLLECTION_ID, STORAGE_BUCKET_ID } from '~/utils/appwrite';

// Define props for the component
const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    }
});

// Define emits
const emit = defineEmits(['request-profile', 'post-created']);

// Initialize Appwrite services
const databases = new Databases(client);
const storage = new Storage(client);

// Use the shared state instead of direct API calls
const currentUser = useState('currentUser', () => null);
const Profile = useState('Profile', () => null);

const postTitle = ref('');
const postContent = ref('');
const postType = ref('post'); // Default post type
const isVisibilityOpen = ref(false);
const visibility = ref('public'); // Default visibility
const showEditor = ref(false);
const showMarkdown = ref(false);
const markdownContent = ref('');
const coverImagePreview = ref(null);
const coverImageFile = ref(null);
const tags = ref([]);
const tagInput = ref('');

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
};

const submitPost = async () => {
    if (postTitle.value.trim() && postContent.value.trim()) {
        try {
            // Get markdown content
            let markdown = '';
            if (editor.value) {
                markdown = editor.value.storage.markdown.getMarkdown();
            } else {
                markdown = markdownContent.value;
            }

            // Prepare post data
            let coverImageId = null;
            if (coverImageFile.value) {
                try {
                    coverImageId = await uploadCoverImageToStorage(coverImageFile.value);
                } catch (error) {
                    console.error('Error uploading cover image:', error);
                    // Decide if you want to continue with post creation or abort
                }
            }
            let postData = {}
            if (coverImageId) {
                postData = {
                    title: postTitle.value,
                    Markdown: markdown, // Store as markdown
                    authorId: currentUser.value.$id,
                    status: 'published', // or 'draft' based on your UI
                    tags: tags.value,
                    views: 0,
                    likes: 0,
                    createdAt: new Date(),
                    type: postType.value, // Add the post type
                    coverImage: `https://appwrite-os08sgw04g4swk0s8owwoooc.beamzy.net/v1/storage/buckets/67c9dbab003009fc0a92/files/${coverImageId}/view?project=project-x&project=project-x`,
                };
            } else {
                postData = {
                    title: postTitle.value,
                    Markdown: markdown, // Store as markdown
                    authorId: currentUser.value.$id,
                    status: 'published', // or 'draft' based on your UI
                    tags: tags.value,
                    views: 0,
                    likes: 0,
                    createdAt: new Date(),
                    type: postType.value, // Add the post type
                };
            }

            // Create post in Appwrite
            const response = await databases.createDocument(
                DATABASE_ID,
                POSTS_COLLECTION_ID,
                ID.unique(),
                postData
            );

            console.log('Post created successfully:', response);

            // Emit event with the new post data
            emit('post-created', response);

            // Clear form after successful submission
            postTitle.value = '';
            if (editor.value) {
                editor.value.commands.setContent('');
            }
            postContent.value = '';
            markdownContent.value = '';
            showEditor.value = false;
            showMarkdown.value = false;
            coverImagePreview.value = null;
            coverImageFile.value = null;
            tags.value = [];
            tagInput.value = '';
            postType.value = 'post'; // Reset post type to default

            // You could add a success notification here

        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post. Please try again.');
        }
    } else {
        alert('Please add both a title and content to your post');
    }
};

const uploadCoverImage = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.includes('image/')) {
        alert('Please upload an image file');
        return;
    }

    coverImageFile.value = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
        coverImagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
};

const removeCoverImage = () => {
    coverImagePreview.value = null;
    coverImageFile.value = null;
    if (this.$refs.coverImageInput) {
        this.$refs.coverImageInput.value = '';
    }
};

const uploadCoverImageToStorage = async (file) => {
    try {
        const response = await storage.createFile(
            STORAGE_BUCKET_ID,
            ID.unique(),
            file
        );
        console.log('Cover image uploaded successfully:', response);
        return response.$id; // Return the file ID for reference in the post
    } catch (error) {
        console.error('Error uploading cover image:', error);
        throw error;
    }
};

const addTag = () => {
    const tag = tagInput.value.trim();
    if (tag && !tags.value.includes(tag) && tags.value.length < 5) {
        tags.value.push(tag);
        tagInput.value = '';
    } else if (tags.value.length >= 5) {
        alert('Maximum 5 tags allowed');
    } else if (tags.value.includes(tag)) {
        alert('Tag already exists');
        tagInput.value = '';
    }
};

const removeTag = (index) => {
    tags.value.splice(index, 1);
};
</script>

<style scoped>
:deep(.ProseMirror) {
    outline: none;
    min-height: 200px;
    font-family: 'Charter', 'Georgia', serif;
    font-size: 1.1rem;
    line-height: 1.6;
    color: #292929;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
    content: "Tell your story...";
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
    font-style: italic;
}

:deep(.ProseMirror h2) {
    font-size: 1.5rem;
    font-weight: 700;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
}

:deep(.ProseMirror blockquote) {
    border-left: 3px solid #292929;
    padding-left: 1rem;
    font-style: italic;
    margin: 1rem 0;
}

:deep(.ProseMirror img) {
    max-width: 100%;
    border-radius: 0.375rem;
    margin: 1rem 0;
}

:deep(.ProseMirror pre) {
    background-color: #f8f9fa;
    border-radius: 0.375rem;
    padding: 1rem;
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
    font-size: 0.9rem;
    overflow-x: auto;
}
</style>
