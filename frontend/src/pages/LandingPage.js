import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Award, 
  Users, 
  BookOpen, 
  CheckCircle, 
  Star,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Globe
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Quality Courses",
      description: "Access to high-quality courses from industry experts"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Certificates",
      description: "Earn certificates upon course completion (30% minimum)"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Startup Connect",
      description: "Connect with startups for internships and jobs"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Affordable Learning",
      description: "Any course for just ₹19 - breaking cost barriers"
    }
  ];

  const stats = [
    { number: "1000+", label: "Courses Available" },
    { number: "₹19", label: "Per Course" },
    { number: "50+", label: "Partner Startups" },
    { number: "10K+", label: "Students Enrolled" }
  ];

  const courses = [
    {
      title: "Web Development",
      category: "Programming",
      duration: "8 hours",
      rating: 4.8,
      students: 1200
    },
    {
      title: "Data Science",
      category: "Analytics",
      duration: "12 hours",
      rating: 4.9,
      students: 800
    },
    {
      title: "Digital Marketing",
      category: "Marketing",
      duration: "6 hours",
      rating: 4.7,
      students: 1500
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Any Course Under
              <span className="block text-yellow-300">₹19</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Unlock your potential with affordable, high-quality online courses. 
              Learn from experts and advance your career without breaking the bank.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-secondary text-lg px-8 py-4">
                Get Started Free
              </Link>
              <Link to="/signin" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose CareerCycle?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're revolutionizing online education by making quality learning accessible to everyone
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center"
              >
                <div className="text-primary-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Courses
            </h2>
            <p className="text-xl text-gray-600">
              Start your learning journey with our most popular courses
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-full h-32 rounded-lg mb-4 flex items-center justify-center">
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.category}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{course.duration}</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    {course.rating}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{course.students} students</span>
                  <div className="text-2xl font-bold text-primary-600">₹19</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/signup" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
              Explore All Courses
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join thousands of learners who are already advancing their skills with CareerCycle
            </p>
            <Link to="/signup" className="btn-secondary text-lg px-8 py-4">
              Start Learning Today
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

