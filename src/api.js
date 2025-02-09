export const getPosts = async () => {
  try {
    const response = await fetch('/api/posts');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

// Update other API calls to use '/api' prefix
export const createPost = async (postData, token) => {
  try {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    if (postData.image) {
      formData.append('image', postData.image);
    }

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Authorization': token
      },
      body: formData
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
};

export const login = async (credentials) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    return await response.text();
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
};

export const register = async (credentials) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    return await response.text();
  } catch (error) {
    console.error('Error registering:', error);
    return null;
  }
};
