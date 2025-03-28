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
        <CardContent className="p-6">
          <motion.div 
            className="flex justify-between items-start mb-4"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{repo.name}</h2>
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
            className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400"
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
              transition={{ duration: 0.1 }}
            >
              View on GitHub
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
    <motion.div 
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-10 rounded-xl shadow-lg mb-8 relative">
        {/* Dark Mode Toggle */}
        <motion.button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
          aria-label="Toggle dark mode"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {darkMode ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </motion.button>

        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Naser Raoofi
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl italic mb-8 text-blue-100"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Turning cloud challenges into elegant solutions
          </motion.p>
          
          {/* Enhanced Search Section */}
          <motion.div 
            className="relative max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative">
              <Input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={handleSearch}
                className="w-full px-6 py-4 text-lg bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-full 
                         text-white placeholder-white focus:outline-none focus:border-white/40 
                         transition-all duration-300 shadow-lg hover:shadow-xl"
              />
              <motion.div 
                className="absolute right-4 top-1/2 -translate-y-1/2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg 
                  className="w-6 h-6 text-white/80" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </motion.div>
            </div>
            
            {/* Search Suggestions */}
            {search && (
              <motion.div 
                className="absolute w-full mt-2 bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="p-4">
                  <p className="text-white/80 text-sm mb-2">Search by:</p>
                  <div className="flex flex-wrap gap-2">
                    {['AWS', 'DevOps', 'AI', 'Computer Vision', 'Cloud'].map((term) => (
                      <motion.button
                        key={term}
                        onClick={() => setSearch(term)}
                        className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm 
                                 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {term}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </header>

      <div className="px-6">
        <div className="flex gap-6">
          <FilterSidebar
            selectedCategories={selectedCategories}
            selectedSubCategories={selectedSubCategories}
            onCategoryChange={handleCategoryChange}
            onSubCategoryChange={handleSubCategoryChange}
          />
          
          <div className="flex-1">
            {/* Featured Projects Section */}
            <AnimatePresence>
              {getFeaturedProjects().length > 0 && (
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
                    <svg className="w-6 h-6 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured Projects
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {getFeaturedProjects().map((repo, index) => (
                      <ProjectCard key={repo.id} repo={repo} isFeatured={true} index={index} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* All Projects Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">All Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filtered.map((repo, index) => (
                    <ProjectCard key={repo.id} repo={repo} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}
