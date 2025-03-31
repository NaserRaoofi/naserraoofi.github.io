// Google Analytics Measurement ID
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX' // Replace with your actual Google Analytics ID

// Pageview tracking
export const pageview = (url) => {
  if (typeof window.gtag === 'function') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

// Event tracking
export const event = ({ action, category, label, value }) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
} 