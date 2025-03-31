import { useEffect, useState } from 'react';
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { FilterSidebar } from "./components/FilterSidebar";
import Footer from "./components/Footer";
import { motion, AnimatePresence } from 'framer-motion';
import { pageview } from './utils/analytics';

export default function App() {
  const [repos, setRepos] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has a saved preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    // If no saved preference, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    // Track page view
    pageview(window.location.pathname);

    // Update localStorage when dark mode changes
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // Update document class
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    fetch("https://api.github.com/users/naserraoofi/repos")
      .then((res) => res.json())
      .then((data) => {
        setRepos(data);
        setFiltered(data);
      });
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);
    applyFilters(term, selectedCategories, selectedSubCategories);
  };

  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories);
    applyFilters(search, categories, selectedSubCategories);
  };

  const handleSubCategoryChange = (subCategories) => {
    setSelectedSubCategories(subCategories);
    applyFilters(search, selectedCategories, subCategories);
  };

  const getTagStyle = (topic) => {
    const topicLower = topic.toLowerCase();
    
    // AWS related tags
    if (topicLower.includes('aws') || topicLower.includes('ec2') || topicLower.includes('s3') || 
        topicLower.includes('lambda') || topicLower.includes('cloudformation') || 
        topicLower.includes('rds') || topicLower.includes('dynamodb')) {
      return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100";
    }
    
    // DevOps related tags
    if (topicLower.includes('devops') || topicLower.includes('docker') || topicLower.includes('kubernetes') || 
        topicLower.includes('jenkins') || topicLower.includes('terraform') || 
        topicLower.includes('ansible') || topicLower.includes('github-actions')) {
      return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100";
    }
    
    // AI related tags
    if (topicLower.includes('ai') || topicLower.includes('machine-learning') || topicLower.includes('deep-learning') || 
        topicLower.includes('computer-vision') || topicLower.includes('image-processing') || 
        topicLower.includes('nlp')) {
      return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100";
    }
    
    // Default style for other tags
    return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100";
  };

  const applyFilters = (searchTerm, categories, subCategories) => {
    let filteredRepos = [...repos];

    // Apply search filter
    if (searchTerm) {
      filteredRepos = filteredRepos.filter((repo) => 
        repo.topics?.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (categories.length > 0) {
      filteredRepos = filteredRepos.filter((repo) => {
        const repoTopics = repo.topics?.map(topic => topic.toLowerCase()) || [];
        
        // A repo must match at least one of the selected categories
        return categories.some(category => {
          switch (category) {
            case "AWS":
              return repoTopics.some(topic => 
                topic.includes("aws") || 
                topic.includes("ec2") || 
                topic.includes("s3") || 
                topic.includes("lambda") || 
                topic.includes("cloudformation") || 
                topic.includes("rds") || 
                topic.includes("dynamodb")
              );
            case "DevOps":
              return repoTopics.some(topic => 
                topic.includes("devops") || 
                topic.includes("docker") || 
                topic.includes("kubernetes") || 
                topic.includes("jenkins") || 
                topic.includes("terraform") || 
                topic.includes("ansible") || 
                topic.includes("github-actions")
              );
            case "AI":
              return repoTopics.some(topic => 
                topic.includes("ai") || 
                topic.includes("machine-learning") || 
                topic.includes("deep-learning") || 
                topic.includes("computer-vision") || 
                topic.includes("image-processing") || 
                topic.includes("nlp")
              );
            default:
              return true;
          }
        });
      });
    }

    // Apply subcategory filter
    if (subCategories.length > 0) {
      filteredRepos = filteredRepos.filter((repo) => {
        const repoTopics = repo.topics?.map(topic => topic.toLowerCase()) || [];
        // A repo must match at least one of the selected subcategories
        return subCategories.some(subCategory => 
          repoTopics.some(topic => topic.includes(subCategory.toLowerCase()))
        );
      });
    }

    setFiltered(filteredRepos);
  };

  // Get featured projects (those with "featured" topic or high star count)
  const getFeaturedProjects = () => {
    return repos
      .filter(repo => 
        repo.topics?.includes('featured') || 
        repo.stargazers_count > 5
      )
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 3); // Show top 3 featured projects
  };

  const ProjectCard = ({ repo, isFeatured = false, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`transition-transform duration-100 ease-out hover:shadow-xl hover:shadow-blue-100/50 dark:hover:shadow-blue-900/50 ${
        isFeatured ? 'border-2 border-blue-500 dark:border-blue-400' : ''
      }`}
    >
      <Card>
        <CardContent className="p-4 sm:p-6">
          <motion.div 
            className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.1 }}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white break-words">{repo.name}</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {repo.language}
            </span>
          </motion.div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {repo.description || "No description available"}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {repo.topics?.map((topic, i) => (
              <motion.span
                key={topic}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02, duration: 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`${getTagStyle(topic)} text-xs font-medium px-2.5 py-0.5 rounded-full transition-transform duration-100 ease-out`}
              >
                {topic}
              </motion.span>
            ))}
          </div>

          <motion.div 
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-sm text-gray-500 dark:text-gray-400"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.1 }}
          >
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                {repo.stargazers_count}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8a1 1 0 10-2 0v3.586l-1.293-1.293z" />
                </svg>
                {repo.forks_count}
              </span>
            </div>
            <motion.a
              href={repo.html_url}
              target="_blank"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline flex items-center transition-colors duration-100 ease-out"
              rel="noreferrer"
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              View Project
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </motion.a>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My GitHub Projects</h1>
            <div className="flex items-center space-x-4">
              <Input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={handleSearch}
                className="w-full sm:w-64"
              />
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar - Hidden on mobile, shown in drawer */}
          <div className="hidden lg:block">
            <FilterSidebar
              selectedCategories={selectedCategories}
              selectedSubCategories={selectedSubCategories}
              onCategoryChange={handleCategoryChange}
              onSubCategoryChange={handleSubCategoryChange}
            />
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-between"
            >
              <span className="text-gray-900 dark:text-white">Filters</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${showMobileFilters ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="lg:hidden fixed inset-0 z-50 bg-white dark:bg-gray-800 p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FilterSidebar
                  selectedCategories={selectedCategories}
                  selectedSubCategories={selectedSubCategories}
                  onCategoryChange={handleCategoryChange}
                  onSubCategoryChange={handleSubCategoryChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Projects Grid */}
          <div className="flex-1">
            {/* Featured Projects */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFeaturedProjects().map((repo, index) => (
                  <ProjectCard key={repo.id} repo={repo} isFeatured={true} index={index} />
                ))}
              </div>
            </div>

            {/* All Projects */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">All Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((repo, index) => (
                  <ProjectCard key={repo.id} repo={repo} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
