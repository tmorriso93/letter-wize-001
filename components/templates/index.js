import dynamic from "next/dynamic";

// Metadata and components for different resume templates
export const TEMPLATE_META = {
  classic: { label: "Classic" },
  businessPro: { label: "Business Professional" },
};

export const TEMPLATE_COMPONENTS = {
  classic: dynamic(() => import("./classic/ClassicCard")),
  businessPro: dynamic(() => import("./business-pro/BusinessProfessionalCard")),
};

export function getTemplateComponent(key) {
  return TEMPLATE_COMPONENTS[key] || TEMPLATE_COMPONENTS.classic;
}


// how to add more templates (steps):
// Adding more templates later

// Create components/templates/<new-key>/<NewCard>.jsx

// Add to TEMPLATE_META and TEMPLATE_COMPONENTS in components/templates/index.js

// Done. The selector and renderer will pick it up automatically.