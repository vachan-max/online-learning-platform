import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CourseContext = createContext();

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch all courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured courses
  const fetchFeaturedCourses = async () => {
    try {
      const response = await axios.get('/api/courses/featured/limit/6');
      setFeaturedCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch featured courses:', error);
    }
  };

  // Search courses
  const searchCourses = async (query) => {
    if (!query.trim()) {
      fetchCourses();
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/courses/search/${encodeURIComponent(query)}`);
      setCourses(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Get courses by category
  const getCoursesByCategory = async (category) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/courses/category/${encodeURIComponent(category)}`);
      setCourses(response.data);
      setSelectedCategory(category);
    } catch (error) {
      console.error('Failed to fetch courses by category:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  // Get course by ID
  const getCourseById = async (courseId) => {
    try {
      const response = await axios.get(`/api/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch course:', error);
      toast.error('Failed to load course');
      return null;
    }
  };

  // Get course duration
  const getCourseDuration = async (courseId) => {
    try {
      const response = await axios.get(`/api/courses/${courseId}/duration`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch course duration:', error);
      return null;
    }
  };

  // Check if user has purchased a course
  const checkCoursePurchase = async (courseId) => {
    try {
      const response = await axios.get(`/api/payments/status/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to check course purchase:', error);
      return { purchased: false, status: 'error' };
    }
  };

  // Get user progress for a course
  const getCourseProgress = async (courseId) => {
    try {
      const response = await axios.get(`/api/progress/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch course progress:', error);
      return null;
    }
  };

  // Update course progress
  const updateCourseProgress = async (courseId, progressData) => {
    try {
      const response = await axios.put(`/api/progress/course/${courseId}`, progressData);
      return response.data;
    } catch (error) {
      console.error('Failed to update progress:', error);
      toast.error('Failed to update progress');
      return null;
    }
  };

  // Get user's overall progress
  const getUserProgress = async () => {
    try {
      const response = await axios.get('/api/progress');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user progress:', error);
      return [];
    }
  };

  // Get progress statistics
  const getProgressStats = async () => {
    try {
      const response = await axios.get('/api/progress/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch progress stats:', error);
      return null;
    }
  };

  // Get course categories
  const getCourseCategories = () => {
    const categories = [...new Set(courses.map(course => course.category))];
    return categories.filter(Boolean);
  };

  // Filter courses by search and category
  const getFilteredCourses = () => {
    let filtered = courses;

    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(course =>
        course.category === selectedCategory
      );
    }

    return filtered;
  };

  // Initialize data
  useEffect(() => {
    fetchCourses();
    fetchFeaturedCourses();
  }, []);

  const value = {
    // State
    courses,
    featuredCourses,
    loading,
    searchQuery,
    selectedCategory,
    
    // Actions
    fetchCourses,
    fetchFeaturedCourses,
    searchCourses,
    getCoursesByCategory,
    getCourseById,
    getCourseDuration,
    checkCoursePurchase,
    getCourseProgress,
    updateCourseProgress,
    getUserProgress,
    getProgressStats,
    getCourseCategories,
    getFilteredCourses,
    
    // Setters
    setSearchQuery,
    setSelectedCategory
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

