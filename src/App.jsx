import React, { useState, useEffect } from 'react';
import profileImage from './assets/profile.jpg';
import { getPosts } from './api';
import './index.css';

function App() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getPosts();
        setBlogPosts(posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <div className="container">
      <header className="header">
        <img src={profileImage} alt="Tyler Horn" className="profile-img" />
        <h1>Tyler Horn, LCSW</h1>
      </header>

      <section className="section">
        <h2>About Me</h2>
        <p>
          As a Licensed Clinical Social Worker with over a decade of experience, I specialize in child and family therapy, 
          helping individuals and families navigate life's challenges. My approach is rooted in compassion, understanding, 
          and evidence-based practices. I co-own Louisville Mental Health, where we strive to create a safe and supportive 
          environment for all our clients.
        </p>
      </section>

      <section className="section">
        <h2>Specialties</h2>
        <ul className="resources-list">
          <li>Child and Adolescent Therapy</li>
          <li>Family Therapy</li>
          <li>Trauma-Focused Cognitive Behavioral Therapy</li>
          <li>Parenting Support</li>
        </ul>
      </section>

      <section className="section">
        <h2>Practice Resources</h2>
        <ul className="resources-list">
          <li><a href="https://www.psychologytoday.com/us/therapists/tyler-horn-louisville-ky/193109" target="_blank" rel="noopener noreferrer">Psychology Today Profile</a></li>
          <li><a href="https://louisvillementalhealth.org" target="_blank" rel="noopener noreferrer">Louisville Mental Health</a></li>
        </ul>
      </section>

      <div className="blog-section">
        <h2>Professional Thoughts</h2>
        {blogPosts.map(post => (
          <div className="blog-post" key={post.id}>
            {post.image && <img src={post.image} alt={post.title} />}
            <h3>{post.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
