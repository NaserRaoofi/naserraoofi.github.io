import React from 'react';

const categories = {
  AWS: ['EC2', 'S3', 'Lambda', 'CloudFormation', 'RDS', 'DynamoDB'],
  DevOps: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Ansible', 'GitHub Actions'],
  AI: ['Image Processing', 'Computer Vision', 'Machine Learning', 'Deep Learning', 'NLP']
};

export function FilterSidebar({ selectedCategories, selectedSubCategories, onCategoryChange, onSubCategoryChange }) {
  const toggleCategory = (category) => {
    const isSelected = selectedCategories.includes(category);
    if (isSelected) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const toggleSubCategory = (subCategory) => {
    const isSelected = selectedSubCategories.includes(subCategory);
    if (isSelected) {
      onSubCategoryChange(selectedSubCategories.filter(sc => sc !== subCategory));
    } else {
      onSubCategoryChange([...selectedSubCategories, subCategory]);
    }
  };

  return (
    <div className="w-full lg:w-64 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm h-fit">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Categories</h2>
      <div className="space-y-4">
        {Object.entries(categories).map(([category, subCategories]) => (
          <div key={category}>
            <button
              onClick={() => toggleCategory(category)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                selectedCategories.includes(category)
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 font-medium shadow-md'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{category}</span>
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    selectedCategories.includes(category) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            {selectedCategories.includes(category) && (
              <div className="ml-4 mt-2 space-y-2">
                {subCategories.map((subCategory) => (
                  <button
                    key={subCategory}
                    onClick={() => toggleSubCategory(subCategory)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 ${
                      selectedSubCategories.includes(subCategory)
                        ? 'bg-blue-50 dark:bg-blue-800 text-blue-700 dark:text-blue-100 font-medium shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {subCategory}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 