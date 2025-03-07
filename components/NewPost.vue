<template>
    <div class="bg-blue-100 p-4 rounded-2xl  mb-4">
        <h2 class="text-lg font-semibold mb-2">Create a New Post</h2>

        <div class="flex items-center   rounded-2xl bg-white mb-4 relative">
            <NuxtImg src="/images/image.webp" alt="User Avatar" class="w-10 h-10 rounded-full m-2" />
            <input v-model="postTitle" type="text" placeholder="Title of your post..."
                class="flex-1 p-2 bg-white border-none  focus:outline-none rounded-2xl" />
            <button @click="toggleVisibility" class="p-2 text-gray-600 hover:text-gray-800">
                <i class="fas fa-share-alt text-xl"></i>
            </button>
            <div v-if="isVisibilityOpen" class="absolute right-1 bg-gray-100  rounded-2xl p-2 flex space-x-3">
                <button @click="setVisibility('public')" class="flex items-center text-gray-600 hover:text-gray-800">
                    <i class="fas fa-globe text-xl"></i>
                </button>
                <button @click="setVisibility('friends')" class="flex items-center text-gray-600 hover:text-gray-800">
                    <i class="fas fa-users text-xl"></i>
                </button>
                <button @click="setVisibility('onlyMe')" class="flex items-center text-gray-600 hover:text-gray-800">
                    <i class="fas fa-lock text-xl"></i>
                </button>
            </div>
        </div>
        <div>
            <div v-if="showEditor" class="bg-white rounded-2xl p-4 mb-4">
                <h2 class="text-lg font-semibold mb-2">Cover Image</h2>
                
                <!-- Image preview area -->
                <div v-if="coverImagePreview" class="mb-3">
                    <img :src="coverImagePreview" alt="Cover image preview" class="w-full h-48 object-cover rounded-lg" />
                    <button @click="removeCoverImage" class="mt-2 text-red-500 text-sm flex items-center">
                        <Icon name="solar:trash-bin-trash-bold" class="mr-1" />
                        Remove image
                    </button>
                </div>
                
                <!-- Upload button -->
                <div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer"
                     @click="$refs.coverImageInput.click()">
                    <Icon name="solar:gallery-add-bold" class="text-3xl text-gray-400 mb-2" />
                    <p class="text-gray-500">Click to upload a cover image</p>
                    <p class="text-xs text-gray-400 mt-1">Recommended: 1200×630px, JPG or PNG</p>
                </div>
                
                <input 
                    ref="coverImageInput"
                    type="file" 
                    accept="image/*" 
                    class="hidden" 
                    @change="uploadCoverImage" 
                />
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
import { Markdown } from 'tiptap-markdown';
import { client, account, ID } from '~/utils/appwrite';
import { Databases, Storage } from 'appwrite';
import { DATABASE_ID, POSTS_COLLECTION_ID, STORAGE_BUCKET_ID } from '~/utils/appwrite';

// Initialize Appwrite services
const databases = new Databases(client);
const storage = new Storage(client);

const postTitle = ref('');
const postContent = ref('');
const isVisibilityOpen = ref(false);
const visibility = ref('public'); // Default visibility
const showEditor = ref(false);
const showMarkdown = ref(false);
const markdownContent = ref('');
const coverImagePreview = ref(null);
const coverImageFile = ref(null);

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

const submitPost = async () => {
    if (postTitle.value.trim() && postContent.value.trim()) {
        try {
            // Get current user
            const currentUser = await account.get();
            
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
            
            const postData = {
                title: postTitle.value,
                Markdown: markdown, // Store as markdown
                authorId: currentUser.$id,
                status: 'published', // or 'draft' based on your UI
                tags: [], // You could add tag functionality later
                views: 0,
                likes: 0,
                createdAt: new Date(),
                coverImage: `https://appwrite-os08sgw04g4swk0s8owwoooc.beamzy.net/v1/storage/buckets/67c9dbab003009fc0a92/files/${coverImageId}/view?project=project-x&project=project-x`,
            };
            
            // Create post in Appwrite
            const response = await databases.createDocument(
                DATABASE_ID,
                POSTS_COLLECTION_ID,
                ID.unique(),
                postData
            );
            
            console.log('Post created successfully:', response);
            
            // Clear form after successful submission
            postTitle.value = '';
            if (editor.value) {
                editor.value.commands.setContent('');
            }
            postContent.value = '';
            markdownContent.value = '';
            showEditor.value = false;
            showMarkdown.value = false;
            
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
