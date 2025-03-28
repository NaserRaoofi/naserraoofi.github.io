import React, { useEffect, useState } from 'react';
import { Card } from "./ui/card";

const skills = [
  { name: 'AWS', icon: '🌩️' },
  { name: 'Terraform', icon: '🏗️' },
  { name: 'Python', icon: '🐍' },
  { name: 'OpenCV', icon: '👁️' },
  { name: 'Docker', icon: '🐳' },
  { name: 'Kubernetes', icon: '⚙️' },
  { name: 'Jenkins', icon: '🔄' },
  { name: 'GitHub Actions', icon: '⚡' },
  { name: 'Computer Vision', icon: '🔍' },
  { name: 'Machine Learning', icon: '🧠' },
  { name: 'DevOps', icon: '🚀' },
  { name: 'CI/CD', icon: '🔄' },
];

const stats = [
  { label: 'Projects', value: 30, suffix: '+' },
  { label: 'Q1 Papers', value: 2 },
  { label: 'Certifications', value: 4 },
  { label: 'Years Experience', value: 3, suffix: '+' },
];

const AnimatedCounter = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    const interval = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [value]);

  return <span className="text-3xl font-bold">{count}{suffix}</span>;
};

export function AboutMe() {
  return (
    <div className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Bio and Stats */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About Me
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                I'm a passionate AWS DevOps Engineer and Computer Vision PhD student, 
                focused on building scalable cloud solutions and advancing AI research. 
                My expertise spans from infrastructure automation to computer vision applications.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <Card key={stat.label} className="p-4 text-center bg-white dark:bg-gray-800">
                  <div className="text-blue-600 dark:text-blue-400 mb-1">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Skills and CTA */}
          <div>
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Technical Skills
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {skills.map((skill) => (
                  <Card 
                    key={skill.name} 
                    className="p-3 text-center bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="text-xl mb-1">{skill.icon}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {skill.name}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <a
                href="/path-to-your-cv.pdf"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download CV
              </a>
              <a
                href="https://linkedin.com/in/your-profile"
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-.88-.018-2.013-1.226-2.013-1.226 0-1.414.957-1.414 1.949v5.668h-3v-11h2.765v1.55h.04c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.845z"/>
                </svg>
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 