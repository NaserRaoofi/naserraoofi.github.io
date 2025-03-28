// Google Analytics Measurement ID
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX' // Replace with your actual Google Analytics ID

// Pageview tracking
export const pageview = (url) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

// Event tracking
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
} 